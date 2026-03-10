# Multi-stage build for a FastAPI + Static Frontend application

# --- Stage 1: Build Frontend ---
FROM node:18-alpine AS build-frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# --- Stage 2: Serve Backend & Static Files ---
FROM python:3.9-slim
WORKDIR /app

# Install backend dependencies
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install gunicorn uvicorn

# Copy backend code
COPY backend/ ./

# Copy built frontend assets to a static folder (if serving via FastAPI)
# Or keep them separate if deploying to static hosting. 
# For this example, we assume backend only.
COPY --from=build-frontend /app/frontend/dist /app/static

# Environment defaults
ENV FINTRACK_SECRET_KEY=change-me-in-production
ENV FRONTEND_URL=http://localhost:8000
ENV PORT=8000

EXPOSE 8000

# Run migrations and start app
# In a real production setup, migrations are often run in a separate step or init container.
CMD python migrate_user_id.py && python migrate_security.py && gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app --bind 0.0.0.0:$PORT
