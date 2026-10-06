# System Architecture — AI Job & Resume Matching Platform (CareerAI)

## 1. Executive Summary

CareerAI is an enterprise-grade SaaS platform built to solve the opacity and inefficiencies of modern technical recruitment. It connects Candidates, Employers, and Administrators using a high-fidelity, explainable matching engine rather than black-box AI scores. 

---

## 2. High-Level Architecture Diagram

```
+-----------------------------------------------------------------------------------+
|                                 CLIENT TIER                                       |
|  React 19 + TypeScript + Vite + Tailwind CSS + TanStack Query + React Router      |
|  - Candidate Portal  |  - Employer Portal  |  - Admin Console  |  - Public Search |
+------------------------------------------+----------------------------------------+
                                           | HTTPS / REST + SSE
                                           v
+-----------------------------------------------------------------------------------+
|                                API GATEWAY / REVERSE PROXY                        |
|  Nginx / Cloudflare / Ingress Controller (SSL, Rate Limiting, CORS, Gzip)         |
+------------------------------------------+----------------------------------------+
                                           |
                                           v
+-----------------------------------------------------------------------------------+
|                            APPLICATION TIER (FastAPI)                             |
|  Python 3.12+ | Pydantic v2 | SQLAlchemy 2.0 (Async) | Argon2 / Jose JWT          |
|                                                                                   |
|  +--------------------+  +----------------------+  +---------------------------+  |
|  | Auth & OTP Engine  |  | Explainable Matching |  | Resume & Job AI Parsers   |  |
|  | - Email / SMS OTP  |  | - 6-Factor Algorithm |  | - Structured Extraction  |  |
|  | - Refresh Rotation |  | - Vector Cosine Sim  |  | - ATS Score Assessment   |  |
|  +--------------------+  +----------------------+  +---------------------------+  |
|                                                                                   |
|  +--------------------+  +----------------------+  +---------------------------+  |
|  | RBAC Middleware    |  | Skill Normalizer     |  | Audit & AI Telemetry      |  |
|  | - Strict Scoping   |  | - Canonical Registry |  | - Latency & Token Logs    |  |
|  +--------------------+  +----------------------+  +---------------------------+  |
+---------------------+-------------------------------+-----------------------------+
                      |                               |
        SQLAlchemy    |                 Asynchronous  | Celery / Arq
       Async Engine   |                 Task Dispatch |
                      v                               v
+-----------------------------+     +-------------------------------+
|       DATABASE TIER         |     |      BACKGROUND WORKER        |
|  PostgreSQL 16 + pgvector   |     |  Python Celery Worker         |
|  - Relational Schemas (30+) |     |  - Async Resume OCR / Parsing |
|  - Vector Embeddings (768d) |     |  - Gemini AI Batch Calling    |
|  - Full-Text Search (tsvector)|   |  - Notification Dispatch      |
+--------------+--------------+     +---------------+---------------+
               ^                                    |
               | Cache & Session Storage            |
               v                                    v
+-----------------------------+     +-------------------------------+
|         REDIS 7             |     |     PRIVATE OBJECT STORE      |
|  - Ephemeral OTP Tokens     |     |  MinIO / AWS S3 / Cloud GCS   |
|  - Celery Message Broker    |     |  - Private PDFs / DOCX Resumes|
|  - Rate Limit Leaky Bucket  |     |  - Signed Pre-authenticated   |
|  - Hot Match Cache (TTL 1h) |     |    Download URLs (15m expiry) |
+-----------------------------+     +-------------------------------+
```

---

## 3. Explainable AI Matching Pipeline

Unlike opaque LLM classification, the CareerAI engine executes a deterministically weighted, 6-component scoring formula:

$$\text{Overall Score} = W_{rs} S_{rs} + W_{ps} S_{ps} + W_{exp} S_{exp} + W_{edu} S_{edu} + W_{sem} S_{sem} + W_{loc} S_{loc}$$

### Configurable Weights
* **Required Skills ($W_{rs}$ = 0.40)**: Exact match ratio between verified candidate skills and mandatory job requirements using canonical skill normalization.
* **Preferred Skills ($W_{ps}$ = 0.20)**: Bonus skill match for secondary proficiencies.
* **Experience Fit ($W_{exp}$ = 0.15)**: Sigmoidal penalty for under-qualification; smooth plateau for exceeding years of relevant domain experience.
* **Education Fit ($W_{edu}$ = 0.10)**: Degree level match (Bachelors, Masters, PhD) and field of study relevance.
* **Semantic Vector Similarity ($W_{sem}$ = 0.10)**: Cosine similarity between resume embeddings and job description embeddings via pgvector `1 - (resume_vector <=> job_vector)`.
* **Work Mode & Location ($W_{loc}$ = 0.05)**: Remote compatibility or geographical proximity match.

---

## 4. OTP Authentication Architecture

To accommodate both global web users and candidates in mobile-first markets:
1. User enters Email or Mobile phone on the login screen.
2. The client invokes `POST /api/v1/auth/send-otp`.
3. Backend creates a cryptographically secure 6-digit OTP, computes its salted Argon2/SHA-256 hash, and stores it in Redis (`key: otp:{destination}`, TTL: 300 seconds) alongside an audit row in `otp_verifications`.
4. The provider sends the OTP via email or SMS.
5. User enters the 6 digits; client sends `POST /api/v1/auth/verify-otp`.
6. Backend compares the hashes using constant-time comparison `hmac.compare_digest`.
7. Upon verification, the OTP key is immediately deleted to prevent replay attacks, and JWT access + refresh tokens are issued with user role claims.

---

## 5. Security & Isolation Controls
* **Object Store Isolation**: Resumes are uploaded to private buckets (`no public read`). Access is mediated strictly via pre-signed S3 URLs with 15-minute expirations.
* **Database Safety**: Full parameterized queries through SQLAlchemy ORM; no dynamic raw SQL string concatenation.
* **Role-Based Access Control**: Decorators (`@require_roles([Role.EMPLOYER, Role.ADMIN])`) validate claims on every incoming backend request.
