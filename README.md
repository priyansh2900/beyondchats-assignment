# BeyondChats Assignment

This repository contains my solution for the BeyondChats full‑stack assignment. It is organised as a single monolithic repository containing the Laravel backend, NodeJS LLM tooling, and ReactJS frontend. [file:1]

## Overview

The project implements the three phases described in the assignment: [file:1]
- Phase 1: Scrape the 5 oldest articles from the BeyondChats blogs page (`https://beyondchats.com/blogs/`), store them in a database, and expose CRUD APIs using a Laravel backend.  
- Phase 2: Use a NodeJS script to fetch the latest article from the Laravel API, search the article’s title on Google, scrape the first two external blog results, call an LLM API (OpenAI / Groq) to generate an updated version of the article, and publish the new article back to the Laravel APIs while citing the reference URLs.  
- Phase 3: Provide a ReactJS frontend that fetches articles from the Laravel APIs and displays both the original and updated versions in a responsive UI.  

## Tech stack

- Backend (Phase 1): Laravel, PHP, SQLlite/MariaDB  
- LLM / Automation (Phase 2): NodeJS, Axios / fetch, OpenAI & Groq LLM APIs  
- Frontend (Phase 3): ReactJS (bundled with a modern tooling setup such as Vite or CRA)  
- Other: REST APIs, environment variables via `.env` files, Git and GitHub for version control  

## Architecture / Data flow

1. **Scraper & API (Laravel)**  
   - A Laravel command or controller scrapes the last page of the BeyondChats blogs section and extracts the 5 oldest articles.  
   - These articles are stored in an `articles` table with fields such as `id`, `title`, `slug`, `content`, `source_url`, `is_updated`, and `references`.  
   - Laravel exposes REST endpoints for CRUD operations, for example:  
     - `GET /api/articles` – list all articles  
     - `GET /api/articles/{id}` – fetch a single article  
     - `POST /api/articles` – create an article  
     - `PUT /api/articles/{id}` – update an article  
     - `DELETE /api/articles/{id}` – delete an article  

2. **LLM optimiser (NodeJS)**  
   - A NodeJS script fetches the latest article from the Laravel API (the most recently created or last updated).  
   - It searches the article title on Google and reads the first two results that are blog or article pages from other websites.  
   - The main text content of these two external articles is scraped and combined with the original article.  
   - The script then calls an LLM API (OpenAI / Groq) to produce an updated article whose content and formatting are similar to the top‑ranking Google results while preserving the original topic.  
   - Finally, the script publishes the updated article back to the Laravel backend using the CRUD APIs, storing both the updated content and the reference URLs of the two external articles.  

3. **Frontend (ReactJS)**  
   - The React app calls the Laravel APIs to list all articles.  
   - It shows both the original scraped articles and their updated LLM‑generated versions in a clean, responsive UI.  
   - Users can click on an article to view full content, see whether it is original or updated, and view the list of reference links that were used when generating the updated article.  

## Local setup instructions

1. **Clone the repository**

