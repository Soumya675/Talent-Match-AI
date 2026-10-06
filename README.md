# CareerAI — AI Job & Resume Matching Platform

[![CI/CD Pipeline](https://github.com/careerai/careerai-platform/actions/workflows/ci.yml/badge.svg)](https://github.com/careerai/careerai-platform/actions/workflows/ci.yml)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16%20%2B%20pgvector-blue.svg)](https://www.postgresql.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB.svg)](https://react.dev/)

**CareerAI** is an enterprise-grade SaaS platform connecting candidates and employers using an **explainable 6-component AI job-match engine**, automated ATS resume scoring, real-time skill-gap roadmaps, interactive interview preparation, and dual Email/SMS OTP passwordless authentication.

---

## 🌟 Key Architectural Features

1. **Explainable AI Matching Engine**:
   - Scores candidates against job descriptions across 6 weighted parameters:
     - **Required Core Skills (40%)**
     - **Preferred/Bonus Skills (20%)**
     - **Experience Alignment (15%)**
     - **Education Fit (10%)**
     - **Semantic Vector Cosine Similarity (10%)**
     - **Work Mode & Location (5%)**
   - Provides clear verbal justifications ("*84% Match: Strong alignment in React and TypeScript; recommended to learn Docker*") rather than unexplainable black-box scores.

2. **Dual-Channel Passwordless OTP & RBAC**:
   - Supports Email & SMS OTP verification with SHA-256 hashed ephemeral storage and replay-attack defense.
   - Strict Role-Based Access Control (`CANDIDATE`, `EMPLOYER`, `ADMIN`).

3. **Production Tech Stack**:
   - **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons, Motion.
   - **Backend**: Python 3.12+, FastAPI, Pydantic v2, SQLAlchemy 2.0 Async, Celery, Redis 7.
   - **Database**: PostgreSQL 16 with `pgvector` and `pgcrypto`.

---

## 📁 Repository Structure

```
├── .github/workflows/ci.yml       # GitHub Actions CI/CD Pipeline
├── backend/                       # Python FastAPI Backend
│   ├── app/
│   │   ├── api/v1/endpoints/      # REST API endpoints (auth, jobs, matching, etc.)
│   │   ├── core/                  # Pydantic Settings, JWT, OTP security
│   │   ├── database/              # SQLAlchemy AsyncEngine session
│   │   ├── models/                # SQLAlchemy ORM models (30+ tables)
│   │   ├── schemas/               # Pydantic validation schemas
│   │   ├── services/              # Explainable matching engine & OTP service
│   │   └── main.py                # FastAPI entry point
│   ├── requirements.txt
│   └── Dockerfile
├── docs/                          # Comprehensive Architectural Documentation
│   ├── ARCHITECTURE.md            # High-level architecture & data flows
│   ├── DATABASE.md                # PostgreSQL schema & Mermaid ER diagram
│   ├── API.md                     # OpenAPI REST endpoint specifications
│   ├── SRS.md                     # Software Requirements Specification
│   ├── AI.md                      # AI algorithm & prompt guidelines
│   └── SECURITY.md                # Security, RBAC & Privacy policies
├── src/                           # Live Interactive React SPA
│   ├── components/                # Candidate, Employer, and Admin dashboards
│   ├── services/                  # Client-side matching engine, OTP auth, parser
│   ├── types/                     # TypeScript definitions
│   └── App.tsx                    # Main interactive portal
├── docker-compose.yml             # Postgres, Redis, FastAPI, Celery, and Vite
├── .env.example                   # Environment configuration template
└── README.md                      # Documentation
```

---

## 🚀 Quickstart with Docker Compose

To boot the entire full-stack ecosystem (PostgreSQL with pgvector, Redis, FastAPI backend, Celery worker, and Vite React frontend):

```bash
# 1. Clone repository & configure environment
cp .env.example .env

# 2. Spin up all containers
docker compose up --build -d

# 3. View running services
# Frontend:  http://localhost:3000
# Backend:   http://localhost:8000/docs
# Redis:     localhost:6379
# Postgres:  localhost:5432
```

---

## 🔐 OTP Authentication Flow

```
User enters Email/Phone 
        │
        ▼
POST /api/v1/auth/send-otp
        │
        ├─► Generates 6-digit numeric OTP
        ├─► Hashes OTP with SHA-256
        └─► Stores in Redis (TTL: 300s) + sends via Email/SMS
        │
        ▼
User enters 6 digits in UI
        │
        ▼
POST /api/v1/auth/verify-otp
        │
        ├─► Validates hash (max 5 attempts)
        ├─► Deletes key (prevents replay)
        └─► Issues JWT Access (30m) & Refresh (7d) tokens
```

---

## 🛡️ Phase 1 Verification Checklist

- [x] Complete folder structure implemented
- [x] System Architecture diagram documented (`docs/ARCHITECTURE.md`)
- [x] Mermaid ER Diagram and PostgreSQL DDL schema (`docs/DATABASE.md`)
- [x] Docker Compose with Postgres 16 (pgvector), Redis 7, FastAPI, Celery, and Frontend (`docker-compose.yml`)
- [x] FastAPI skeleton with Pydantic v2, SQLAlchemy 2.0 models, and CORS (`backend/`)
- [x] Dual-channel OTP authentication service (`POST /api/v1/auth/send-otp` & `verify-otp`)
- [x] React 19 + TypeScript + Vite interactive web interface (`src/`)
- [x] Environment configuration (`.env.example`)
- [x] GitHub Actions CI workflow (`.github/workflows/ci.yml`)
- [x] Explainable 6-component matching engine implemented
