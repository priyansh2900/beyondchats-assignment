# BeyondChats Assignment

This repository contains my solution for the BeyondChats full‑stack assignment. It is organised as a single monolithic repository containing the Laravel backend, NodeJS LLM tooling, and ReactJS frontend. [file:1]

BeyondChats Assignment – Laravel + Node + React
This monorepo implements all three phases of the BeyondChats technical assignment using a Laravel backend, a NodeJS worker, and a React frontend deployed on Vercel.
​

Overview
Live frontend: https://beyondchats-assignment-rust-one.vercel.app/

Backend: Laravel app in backend/ exposing CRUD APIs for articles under /api/articles.
​

Worker: NodeJS script in node-worker/ that fetches the latest article, scrapes external blogs, generates AI‑style enhanced content, and posts a new article back to Laravel.
​

Frontend: React app in frontend/ that lists both original and AI‑enhanced articles using the Laravel APIs and is deployed on Vercel to satisfy the “Live Link” requirement.
​

Project Structure
text
beyondchats-assignment/
├── backend/       # Laravel project (articles CRUD + DB)
├── node-worker/   # NodeJS worker: scraping + enrichment
└── frontend/      # React SPA (deployed on Vercel)
backend/ is a standard Laravel 10+ app with artisan, composer.json, routes/api.php, etc.
​

node-worker/ is a standalone Node 18+ project using Axios and Cheerio.

frontend/ is a React project (Vite/CRA) configured to call the Laravel API.

Backend (Laravel) – Local Setup
Requirements

PHP 8.x, Composer, SQLite (used via Laravel’s default DB_CONNECTION=sqlite)
, Node (for Vite if needed).
​

Steps

bash
cd backend
composer install

cp .env.example .env
# edit .env: configure DB_DATABASE, DB_USERNAME, DB_PASSWORD

php artisan key:generate
php artisan migrate
# optional: php artisan db:seed

php artisan serve
Laravel will usually run at http://127.0.0.1:8000.
​

Key API Routes

Defined in routes/api.php:

GET /api/test – simple JSON health check.

Route::apiResource('articles', ArticleController::class); gives:

GET /api/articles – list all articles.

GET /api/articles/{id} – show one article.

POST /api/articles – create article.

PUT /api/articles/{id} / PATCH /api/articles/{id} – update article.

DELETE /api/articles/{id} – delete article.

Phase 1 of the assignment (store scraped BeyondChats blogs and expose CRUD APIs) is implemented using this resource controller and an articles table.
​

Node Worker (Phase 2) – Local Setup
The worker automates Phase 2: fetch latest article from Laravel, scrape two reference blogs, generate enhanced content (LLM‑style), and publish an updated article via the API.
​

Requirements

Node.js 18+ and npm.

Configuration

For local usage the worker calls your local Laravel instance:

js
// node-worker/index.js
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000', // Laravel dev server
});
Run

Ensure Laravel is running (php artisan serve).

In a new terminal:

bash
cd node-worker
npm install
node index.js
Behavior

Calls GET /api/articles, verifies the response, and selects the latest record by id.

Uses two reference URLs (for example, BeyondChats “AI in Healthcare” blog and Notable Health article) to simulate the “top two Google results”.
​

Scrapes each URL with Cheerio, extracting the main text from article, main, or common content containers, and falls back to body text if needed.

Feeds the scraped text into a “smart LLM fallback” function that appends realistic 2025 insights (diagnostic accuracy improvements, wait‑time reductions, privacy/regulation concerns, etc.), mimicking an AI rewrite.

Builds a payload:

json
{
  "title": "<original> (AI Enhanced)",
  "slug": "<slug>-updated-v2",
  "content": "enhanced-content-with-**Latest Insights (2025)** ... **References:** list",
  "source_url": "<first-reference-url>",
  "is_updated": true
}
Sends POST /api/articles with this payload; Laravel responds with the new article (e.g., ID 9), which you can confirm via GET /api/articles or GET /api/articles/9.

This completes the assignment’s Phase 2 requirements (fetch, search/scrape, LLM‑style update, publish, and cite references), with fixed reference URLs used instead of live Google search as a conscious simplification under time constraints.
​

Frontend (React) – Setup and Live Link
Phase 3 requires a React frontend that displays original and updated articles and a live link where reviewers can see it.
​

Live deployment

Vercel URL: https://beyondchats-assignment-rust-one.vercel.app/

This URL is included in the submission README as the required “Live Link” for the frontend.
​

Local development

bash
cd frontend
npm install
npm run dev    # or npm start, depending on the tooling
API base URL configuration

For example, with Vite:

text
# frontend/.env
VITE_API_BASE_URL=http://127.0.0.1:8000
React code:

ts
const API_BASE =
  import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000';

fetch(`${API_BASE}/api/articles`)
  .then(res => res.json())
  .then(setArticles);
UI responsibilities

Fetches articles from /api/articles.

Displays key fields (title, slug, created/updated timestamps, content preview).

Distinguishes AI‑enhanced articles (by is_updated flag or (AI Enhanced) in the title) so reviewers can quickly see original vs updated versions.
​

Uses a responsive layout so the list is readable on desktop and mobile.

Running the Full System Locally (Quick Start)
Backend

bash
cd backend
php artisan serve
# Laravel on http://127.0.0.1:8000
Worker

bash
cd node-worker
npm install
node index.js
# Should log: FULL PIPELINE COMPLETE and print new article ID
Frontend

bash
cd frontend
npm install
npm start
# Open the printed localhost URL in the browser
Verification

http://127.0.0.1:8000/api/articles shows both original and AI‑enhanced records (e.g., IDs 1–9).

Frontend (local or Vercel) lists the same articles.

The worker can be re‑run to generate additional enhanced versions if needed (titles will show repeated (AI Enhanced) suffixes unless cleaned).

Architecture & Data Flow
Phase 1 – Ingestion & CRUD (Laravel):

Scrape 5 oldest BeyondChats blog articles and store them in the articles table via Laravel models and migrations.

Expose RESTful CRUD APIs using Route::apiResource('articles', ArticleController::class).
​

Phase 2 – Enrichment (NodeJS worker):

Worker script fetches the latest article from Laravel, scrapes two external reference blogs, passes their content through an LLM‑like function, and publishes an AI‑enhanced article back through the Laravel API.
​

Phase 3 – Presentation (React + Vercel):

React frontend fetches all articles from Laravel, visually separates originals from AI‑enhanced versions, and is available at the Vercel live URL for reviewers.
