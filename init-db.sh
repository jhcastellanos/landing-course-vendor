#!/bin/bash

# Initialize database script
echo "Initializing Course Vendor Database..."

# Development database
DEV_DB="postgresql://neondb_owner:npg_J8VQp6MkdlDi@ep-fragrant-queen-ah5fq0bw-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require"

# Production database  
PROD_DB="postgresql://neondb_owner:npg_J8VQp6MkdlDi@ep-holy-rain-ahk105a2-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require"

# Function to execute SQL via curl using Neon's SQL over HTTP (if available)
# Or you can install psql: brew install postgresql

# For now, let's use dotnet ef migrations
cd /Users/jorgecastellanos/projects/course-vendor/landing-course-vendor/backend/CourseVendor.API

echo "Creating database migrations..."
dotnet ef migrations add InitialCreate --output-dir Data/Migrations

echo "Applying migrations to database..."
dotnet ef database update

echo "Database initialization complete!"
