-- Course Vendor Database Schema
-- PostgreSQL (Neon)

-- Courses Table
CREATE TABLE IF NOT EXISTS courses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    image_url TEXT NOT NULL,
    full_price DECIMAL(10, 2) NOT NULL,
    discount_percentage DECIMAL(5, 2) DEFAULT 0,
    final_price DECIMAL(10, 2) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Customers Table
CREATE TABLE IF NOT EXISTS customers (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Purchases Table
CREATE TABLE IF NOT EXISTS purchases (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL REFERENCES customers(id),
    course_id INTEGER NOT NULL REFERENCES courses(id),
    purchase_code VARCHAR(50) NOT NULL UNIQUE,
    amount_paid DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    paypal_transaction_id VARCHAR(255),
    payment_status VARCHAR(50) NOT NULL,
    purchased_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    email_sent BOOLEAN DEFAULT false
);

-- Indexes for performance
CREATE INDEX idx_purchases_customer ON purchases(customer_id);
CREATE INDEX idx_purchases_course ON purchases(course_id);
CREATE INDEX idx_purchases_code ON purchases(purchase_code);
CREATE INDEX idx_customers_email ON customers(email);

-- Sample course data
INSERT INTO courses (name, title, description, image_url, full_price, discount_percentage, final_price) VALUES
('Web Development Masterclass', 'Complete Web Development Bootcamp 2024', 'Learn HTML, CSS, JavaScript, React, Node.js, and more. Build 15+ real-world projects and become a full-stack developer.', 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800', 199.99, 50, 99.99),
('Python for Data Science', 'Master Python for Data Science & Machine Learning', 'Complete Python course covering NumPy, Pandas, Matplotlib, Scikit-Learn, and TensorFlow. Perfect for beginners.', 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800', 149.99, 30, 104.99),
('Digital Marketing Pro', 'Digital Marketing Complete Course', 'Master SEO, Social Media Marketing, Email Marketing, and Analytics. Grow your business online.', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800', 129.99, 40, 77.99),
('UI/UX Design Fundamentals', 'Complete UI/UX Design Course', 'Learn user research, wireframing, prototyping, and design tools like Figma. Create stunning user experiences.', 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800', 179.99, 45, 98.99);
