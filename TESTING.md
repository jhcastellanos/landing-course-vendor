# Testing Guide

## Overview

This guide covers how to test all features of the Course Vendor system.

---

## 🧪 Unit Testing Setup (Future Enhancement)

While the current implementation focuses on functionality, here's how to add tests:

### Backend Tests (.NET)
```bash
# Create test project
dotnet new xunit -n CourseVendor.Tests
dotnet add reference ../CourseVendor.API/CourseVendor.API.csproj

# Add packages
dotnet add package Microsoft.EntityFrameworkCore.InMemory
dotnet add package Moq
```

### Frontend Tests (React)
```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom jest
```

---

## 📋 Manual Testing Checklist

### 1. Database Testing

**Test: Schema Creation**
```sql
-- Verify tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- Should return: courses, customers, purchases
```

**Test: Sample Data**
```sql
-- Check courses
SELECT id, name, final_price FROM courses;
-- Should return 4 courses

-- Verify no purchases yet
SELECT COUNT(*) FROM purchases;
-- Should return 0
```

**Test: Constraints**
```sql
-- Test unique email constraint
INSERT INTO customers (email, full_name) VALUES ('test@example.com', 'Test User');
-- Should work first time

INSERT INTO customers (email, full_name) VALUES ('test@example.com', 'Another User');
-- Should fail with unique constraint error
```

---

### 2. Backend API Testing

#### Using Swagger UI

1. Open `http://localhost:5000/swagger`
2. Test each endpoint

**Test: Get All Courses**
```
GET /api/courses
Expected: 200 OK with array of 4 courses
```

**Test: Get Single Course**
```
GET /api/courses/1
Expected: 200 OK with course details
```

**Test: Invalid Course**
```
GET /api/courses/999
Expected: 404 Not Found
```

#### Using cURL

**Get Courses**
```bash
curl http://localhost:5000/api/courses
```

**Create Order**
```bash
curl -X POST http://localhost:5000/api/payment/create-order \
  -H "Content-Type: application/json" \
  -d '{
    "courseId": 1,
    "customerEmail": "test@example.com",
    "customerName": "Test User"
  }'
```

**Expected Response**:
```json
{
  "orderId": "7XX12345XX789012X",
  "approvalUrl": "https://www.sandbox.paypal.com/checkoutnow?token=..."
}
```

---

### 3. Frontend Testing

#### Visual Testing

**Test: Homepage Load**
- [ ] Page loads without errors
- [ ] Header displays "Course Vendor"
- [ ] Hero section shows tagline
- [ ] 4 courses displayed in grid
- [ ] Each course has image, title, description, price
- [ ] Discount badge shows on discounted courses
- [ ] Footer displays

**Test: Responsive Design**
```
- [ ] Desktop (1920px): 4 columns
- [ ] Laptop (1280px): 3 columns
- [ ] Tablet (768px): 2 columns
- [ ] Mobile (375px): 1 column
```

**Test: Course Card**
- [ ] Image loads correctly
- [ ] Discount percentage shown
- [ ] Original price struck through
- [ ] Final price bold and prominent
- [ ] "Buy Course" button visible
- [ ] Hover effects work

#### Checkout Modal Testing

**Test: Open Modal**
1. Click "Buy Course" on any course
2. Modal should open
3. Course name and price displayed
4. Email input field visible
5. Name input field visible (optional)

**Test: Form Validation**
- [ ] PayPal button disabled when email empty
- [ ] PayPal button disabled with invalid email
- [ ] PayPal button enabled with valid email
- [ ] Close button works

---

### 4. Payment Flow Testing

#### PayPal Sandbox Testing

**Setup:**
1. Go to https://developer.paypal.com
2. Login to dashboard
3. Go to Sandbox → Accounts
4. Note test buyer credentials

**Test: Complete Purchase Flow**

1. **Initiate Purchase**
   - Click "Buy Course"
   - Enter email: `buyer@test.com`
   - Enter name: `Test Buyer`
   - Click PayPal button

2. **PayPal Login**
   - Redirected to PayPal sandbox
   - Login with test buyer account
   - Review order details
   - Click "Pay Now"

3. **Return to Site**
   - Redirected back to your site
   - Processing spinner shows
   - Success message appears
   - Purchase code displayed (format: `CRS-XXXXXXXXXXXX`)

4. **Verify in Database**
   ```sql
   SELECT * FROM purchases ORDER BY id DESC LIMIT 1;
   -- Verify purchase record created
   
   SELECT * FROM customers WHERE email = 'buyer@test.com';
   -- Verify customer created
   ```

**Test: Cancel Payment**
1. Open checkout modal
2. Click PayPal button
3. Click "Cancel and return"
4. Should return to site
5. No purchase created

**Test: Payment Error**
1. Use invalid PayPal credentials
2. Should show error message
3. Can retry payment

---

### 5. Email Testing

**Test: Customer Confirmation Email**

After successful purchase, check customer's email:
- [ ] Email received within 1 minute
- [ ] Subject: "Course Purchase Confirmation"
- [ ] Contains course name
- [ ] Contains purchase code
- [ ] Purchase code format: `CRS-XXXXXXXXXXXX`
- [ ] Professional formatting
- [ ] No broken images

**Test: Owner Notification Email**

Check owner's email (configured in appsettings.json):
- [ ] Email received
- [ ] Subject: "New Course Purchase"
- [ ] Contains customer email
- [ ] Contains course name
- [ ] Contains purchase code
- [ ] Contains timestamp

**Test: Email Failure Handling**
1. Temporarily break SendGrid API key
2. Complete a purchase
3. Purchase should still complete
4. Check backend logs for email error
5. `email_sent` field should be `false` in database

---

### 6. Error Handling Testing

**Test: Backend Down**
1. Stop backend server
2. Try to load courses on frontend
3. Should show loading state indefinitely
4. Check browser console for API error

**Test: Database Connection Lost**
1. Use invalid connection string
2. Try to start backend
3. Should fail with connection error

**Test: Invalid Course ID**
```bash
curl http://localhost:5000/api/courses/999
# Should return 404
```

**Test: Malformed Request**
```bash
curl -X POST http://localhost:5000/api/payment/create-order \
  -H "Content-Type: application/json" \
  -d '{ "invalid": "data" }'
# Should return 400 Bad Request
```

---

### 7. Security Testing

**Test: CORS**
```bash
# From different origin
curl -H "Origin: http://malicious-site.com" \
  http://localhost:5000/api/courses
# Should be blocked by CORS
```

**Test: SQL Injection**
```
GET /api/courses/1; DROP TABLE courses;--
# Should not execute SQL
```

**Test: XSS Prevention**
Enter in email field:
```html
<script>alert('XSS')</script>
```
Should be sanitized, not executed

---

### 8. Performance Testing

**Test: Load Time**
- [ ] Homepage loads in < 2 seconds
- [ ] API responds in < 500ms
- [ ] Images load progressively
- [ ] No layout shift

**Test: Concurrent Purchases**
1. Open 5 browser tabs
2. Initiate purchase in each
3. All should complete successfully
4. Check database for 5 distinct purchases

---

### 9. Integration Testing

**Full End-to-End Test**

1. **Fresh Start**
   ```sql
   TRUNCATE TABLE purchases, customers RESTART IDENTITY CASCADE;
   ```

2. **Browse Courses**
   - Load homepage
   - Verify 4 courses shown
   - Check prices and discounts

3. **Purchase Course #1**
   - Click "Buy Course" on first course
   - Email: `customer1@test.com`
   - Name: `Customer One`
   - Complete PayPal payment
   - Note purchase code: `CODE1`

4. **Purchase Course #2 (Same Customer)**
   - Click "Buy Course" on second course
   - Email: `customer1@test.com` (same)
   - Name: `Customer One`
   - Complete payment
   - Note purchase code: `CODE2`

5. **Purchase Course #3 (Different Customer)**
   - Email: `customer2@test.com`
   - Name: `Customer Two`
   - Complete payment
   - Note purchase code: `CODE3`

6. **Verify Database**
   ```sql
   -- Should have 2 customers
   SELECT COUNT(*) FROM customers;
   
   -- Should have 3 purchases
   SELECT COUNT(*) FROM purchases;
   
   -- Customer 1 should have 2 purchases
   SELECT COUNT(*) FROM purchases p
   JOIN customers c ON p.customer_id = c.id
   WHERE c.email = 'customer1@test.com';
   
   -- All purchase codes should be unique
   SELECT COUNT(DISTINCT purchase_code) FROM purchases;
   ```

7. **Verify Emails**
   - Customer 1 receives 2 confirmation emails
   - Customer 2 receives 1 confirmation email
   - Owner receives 3 notification emails
   - All purchase codes match database

---

## 🔍 Debugging Tips

### Backend Debugging

**Enable Detailed Logging**
```json
// appsettings.Development.json
{
  "Logging": {
    "LogLevel": {
      "Default": "Debug",
      "Microsoft.EntityFrameworkCore": "Information"
    }
  }
}
```

**View SQL Queries**
The above logging will show all SQL queries in terminal.

### Frontend Debugging

**React Developer Tools**
1. Install React DevTools browser extension
2. Inspect component state
3. Track re-renders

**Network Tab**
1. Open DevTools (F12)
2. Go to Network tab
3. Watch API calls
4. Check request/response data

**Console Logging**
Add to components:
```typescript
console.log('State:', { courses, loading, selectedCourse });
```

### PayPal Debugging

**Check PayPal SDK**
```javascript
console.log('PayPal loaded:', window.paypal);
```

**View PayPal Network Calls**
In Network tab, filter for "paypal.com" requests

---

## 📊 Test Results Template

```
# Test Execution Report
Date: __________
Tester: __________

## Environment
- Backend: [ ] Local [ ] Staging [ ] Production
- Frontend: [ ] Local [ ] Staging [ ] Production
- Database: [ ] Local [ ] Neon

## Tests Executed
- Database: [ ] Pass [ ] Fail
- Backend API: [ ] Pass [ ] Fail
- Frontend UI: [ ] Pass [ ] Fail
- Payment Flow: [ ] Pass [ ] Fail
- Email Delivery: [ ] Pass [ ] Fail
- Error Handling: [ ] Pass [ ] Fail

## Issues Found
1. _______________
2. _______________

## Notes
_________________
```

---

## 🚀 Pre-Production Checklist

Before deploying to production:

- [ ] All manual tests pass
- [ ] Payment flow works with real PayPal sandbox
- [ ] Emails delivered successfully
- [ ] Database constraints working
- [ ] Error handling graceful
- [ ] No console errors in browser
- [ ] No backend exceptions in logs
- [ ] CORS configured correctly
- [ ] Environment variables set
- [ ] SSL/HTTPS enabled
- [ ] Performance acceptable
- [ ] Mobile responsive working
- [ ] Cross-browser tested (Chrome, Firefox, Safari)

---

## 📈 Ongoing Monitoring

After deployment:

**Daily Checks**
- [ ] Site loads correctly
- [ ] Can complete test purchase
- [ ] Emails being delivered

**Weekly Checks**
- [ ] Review purchase data
- [ ] Check for errors in logs
- [ ] Monitor email delivery rate
- [ ] Verify PayPal transactions

**Monthly Checks**
- [ ] Database backup
- [ ] Review security logs
- [ ] Update dependencies
- [ ] Performance audit

---

## 🛟 Common Test Failures

### "Cannot connect to database"
- Check connection string
- Verify Neon database is running
- Check firewall/network

### "PayPal button not showing"
- Verify NEXT_PUBLIC_PAYPAL_CLIENT_ID
- Check browser console
- Clear browser cache
- Verify backend is running

### "Email not received"
- Check spam folder
- Verify SendGrid API key
- Check sender email is verified
- Review SendGrid activity log

### "404 on API calls"
- Check backend is running on port 5000
- Verify NEXT_PUBLIC_API_URL is correct
- Check CORS configuration

---

Happy Testing! 🧪
