# ✅ Setup Checklist

Use this checklist to track your progress setting up the Course Vendor system.

---

## 📋 Prerequisites

- [ ] Node.js 18+ installed
  ```bash
  node --version
  ```

- [ ] .NET 8.0 SDK installed
  ```bash
  dotnet --version
  ```

- [ ] Git installed (optional, for version control)
  ```bash
  git --version
  ```

---

## 🗄️ Database Setup (Neon)

- [ ] Created Neon account at [neon.tech](https://neon.tech)
- [ ] Created new project named "course-vendor"
- [ ] Copied connection string
- [ ] Connection string format verified:
  ```
  postgresql://user:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require
  ```
- [ ] Ran `database/schema.sql` in Neon SQL Editor
- [ ] Verified 4 sample courses exist:
  ```sql
  SELECT COUNT(*) FROM courses; -- Should return 4
  ```

---

## 💳 PayPal Setup

- [ ] Created PayPal Developer account at [developer.paypal.com](https://developer.paypal.com)
- [ ] Logged into PayPal Dashboard
- [ ] Went to **Apps & Credentials**
- [ ] Created new app (or using existing)
- [ ] Copied **Client ID** (starts with "A")
- [ ] Copied **Secret** (starts with "E")
- [ ] Confirmed in **Sandbox** mode for testing
- [ ] Created test buyer account in Sandbox

---

## 📧 Email Setup (SendGrid)

- [ ] Created SendGrid account at [sendgrid.com](https://sendgrid.com)
- [ ] Verified account via email
- [ ] Went to **Settings** → **API Keys**
- [ ] Created new API key
- [ ] Copied API key (starts with "SG.")
- [ ] Went to **Settings** → **Sender Authentication**
- [ ] Verified sender email address
- [ ] Confirmed verification email received

---

## 🔧 Backend Configuration

- [ ] Navigated to `backend/CourseVendor.API`
- [ ] Opened `appsettings.json`
- [ ] Updated **ConnectionStrings:DefaultConnection** with Neon string
- [ ] Updated **PayPal:ClientId** with PayPal Client ID
- [ ] Updated **PayPal:ClientSecret** with PayPal Secret
- [ ] Updated **SendGrid:ApiKey** with SendGrid API key
- [ ] Updated **SendGrid:FromEmail** with verified email
- [ ] Updated **Owner:Email** with your email address
- [ ] Saved file

---

## ⚙️ Backend Execution

- [ ] Ran `dotnet restore`
- [ ] No errors during package restore
- [ ] Ran `dotnet run` or `dotnet watch run`
- [ ] Backend started successfully
- [ ] Saw message: "Now listening on: http://localhost:5000"
- [ ] Opened http://localhost:5000/swagger
- [ ] Swagger UI loaded successfully
- [ ] Tested `GET /api/courses` endpoint
- [ ] Received 4 courses in response

---

## 🎨 Frontend Configuration

- [ ] Navigated to `frontend` directory
- [ ] Ran `npm install`
- [ ] No errors during installation
- [ ] Copied `.env.local.example` to `.env.local`
- [ ] Opened `.env.local`
- [ ] Set **NEXT_PUBLIC_API_URL**=http://localhost:5000/api
- [ ] Set **NEXT_PUBLIC_PAYPAL_CLIENT_ID** with PayPal Client ID
- [ ] Saved file

---

## 🚀 Frontend Execution

- [ ] Ran `npm run dev`
- [ ] Frontend started successfully
- [ ] Saw message: "Ready on http://localhost:3000"
- [ ] Opened http://localhost:3000
- [ ] Homepage loaded without errors
- [ ] See 4 course cards displayed
- [ ] Images loaded correctly
- [ ] Prices showing correctly
- [ ] Discount badges visible on discounted courses
- [ ] No console errors in browser (F12)

---

## 🧪 Testing Payment Flow

### Test Purchase #1

- [ ] Clicked "Buy Course" on any course
- [ ] Checkout modal opened
- [ ] Course name and price displayed
- [ ] Entered test email: `test@example.com`
- [ ] Entered test name: `Test User`
- [ ] PayPal button appeared
- [ ] Clicked PayPal button
- [ ] Redirected to PayPal sandbox
- [ ] Logged in with test buyer account
- [ ] Saw correct course price
- [ ] Clicked "Pay Now"
- [ ] Redirected back to your site
- [ ] Saw "Processing..." state
- [ ] Success screen appeared
- [ ] Purchase code displayed (format: CRS-XXXXXXXXXXXX)
- [ ] Copied purchase code: `__________________`

### Test Purchase #2 (Different Course)

- [ ] Completed second test purchase
- [ ] Used different email
- [ ] Received different purchase code
- [ ] Purchase code: `__________________`

---

## 📧 Email Verification

### Customer Emails

- [ ] Checked email inbox for first test
- [ ] Received confirmation email
- [ ] Subject: "Course Purchase Confirmation"
- [ ] Email contains course name
- [ ] Email contains purchase code
- [ ] Purchase code matches success screen
- [ ] Email is HTML formatted
- [ ] No broken images

- [ ] Checked email for second test
- [ ] Received second confirmation
- [ ] Different purchase code in email

### Owner Emails

- [ ] Checked owner email inbox
- [ ] Received notification for first purchase
- [ ] Subject: "New Course Purchase"
- [ ] Contains customer email
- [ ] Contains course name
- [ ] Contains purchase code
- [ ] Contains timestamp

- [ ] Received notification for second purchase
- [ ] All details present

---

## 💾 Database Verification

- [ ] Opened Neon Console
- [ ] Ran query:
  ```sql
  SELECT * FROM purchases ORDER BY id DESC;
  ```
- [ ] See 2 purchase records
- [ ] Both have unique purchase codes
- [ ] Both have `payment_status = 'COMPLETED'`
- [ ] Both have `email_sent = true`

- [ ] Ran query:
  ```sql
  SELECT * FROM customers;
  ```
- [ ] See 2 customer records
- [ ] Emails match test data
- [ ] Created timestamps are recent

---

## 🔍 Error Handling Tests

- [ ] Test 1: Closed checkout without purchasing
  - [ ] No error occurred
  - [ ] No purchase created

- [ ] Test 2: Entered invalid email
  - [ ] PayPal button remained disabled
  - [ ] Form validation working

- [ ] Test 3: Stopped backend, tried to load courses
  - [ ] Loading spinner appeared
  - [ ] No crash occurred

- [ ] Test 4: Invalid PayPal credentials (optional)
  - [ ] Error message displayed
  - [ ] Can retry purchase

---

## 📱 Responsive Design Test

- [ ] Opened on desktop (1920px)
  - [ ] 4 columns of courses
  - [ ] Layout looks good

- [ ] Resized to tablet (768px)
  - [ ] 2 columns of courses
  - [ ] Modal still works

- [ ] Resized to mobile (375px)
  - [ ] 1 column of courses
  - [ ] All elements visible
  - [ ] Can complete purchase

---

## 🎨 Customization (Optional)

- [ ] Changed primary color in `tailwind.config.js`
- [ ] Modified hero section text
- [ ] Updated footer text
- [ ] Changed company name in emails
- [ ] Added/modified courses in database

---

## 📚 Documentation Review

- [ ] Read [README.md](./README.md)
- [ ] Read [QUICKSTART.md](./QUICKSTART.md)
- [ ] Read [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)
- [ ] Read [SYSTEM_FLOW.md](./SYSTEM_FLOW.md)
- [ ] Skimmed [DEPLOYMENT.md](./DEPLOYMENT.md)
- [ ] Bookmarked [TESTING.md](./TESTING.md) for reference

---

## 🚀 Production Readiness (When Ready)

### Pre-Deployment

- [ ] Read full [DEPLOYMENT.md](./DEPLOYMENT.md)
- [ ] Switched PayPal to "live" mode
- [ ] Using production PayPal credentials
- [ ] Updated CORS to production domain
- [ ] Verified SendGrid sender domain
- [ ] Created environment variable strategy
- [ ] Tested full purchase flow with real PayPal sandbox

### Frontend Deployment (Vercel)

- [ ] Pushed code to GitHub
- [ ] Created Vercel account
- [ ] Connected GitHub repository
- [ ] Set environment variables in Vercel
- [ ] Deployed successfully
- [ ] Frontend URL: `_______________________`
- [ ] Tested frontend loads

### Backend Deployment (Render/Railway)

- [ ] Created Render/Railway account
- [ ] Connected repository
- [ ] Set environment variables
- [ ] Deployed successfully
- [ ] Backend URL: `_______________________`
- [ ] Tested API endpoint

### Final Production Test

- [ ] Updated frontend env with production backend URL
- [ ] Redeployed frontend
- [ ] Completed test purchase in production
- [ ] Received emails
- [ ] Verified in production database
- [ ] Tested on mobile device
- [ ] Tested in different browsers

---

## ✅ Success Criteria

You've successfully set up the system when:

✓ **Backend running** on port 5000  
✓ **Frontend running** on port 3000  
✓ **Can see 4 courses** on homepage  
✓ **Can open checkout modal**  
✓ **PayPal button appears**  
✓ **Can complete test purchase**  
✓ **Receive purchase code**  
✓ **Customer email received**  
✓ **Owner email received**  
✓ **Purchase saved in database**  

---

## 🎉 Completion

Date completed: `_______________`

Notes:
```
_____________________________________________________

_____________________________________________________

_____________________________________________________
```

---

## 🆘 If You Got Stuck

Common issues and solutions:

**Backend won't start**
- Check .NET version: `dotnet --version`
- Run: `dotnet restore` then `dotnet build`

**Frontend won't start**
- Delete `node_modules` and run `npm install` again
- Check Node version: `node --version`

**PayPal button not showing**
- Verify `.env.local` has correct Client ID
- Check browser console for errors
- Ensure backend is running

**Emails not sending**
- Verify SendGrid API key
- Check sender email is verified
- Look in spam folder

**Database connection failed**
- Double-check connection string
- Ensure it includes `?sslmode=require`
- Test with `psql` command

---

Congratulations on setting up your Course Vendor system! 🎊
