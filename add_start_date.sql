-- Add StartDate column to courses table
ALTER TABLE courses ADD COLUMN start_date TIMESTAMP WITH TIME ZONE NULL;
