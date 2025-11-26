# 🚀 Quick Start Guide

This is a step-by-step guide to get your Course Vendor system up and running quickly.

## ⚡ Prerequisites Checklist

Before you begin, make sure you have:

- [ ] Node.js 18+ installed ([Download](https://nodejs.org/))
- [ ] .NET 8.0 SDK installed ([Download](https://dotnet.microsoft.com/download))
- [ ] Neon account ([Sign up](https://neon.tech))
- [ ] PayPal Developer account ([Sign up](https://developer.paypal.com))
- [ ] Gmail account for email forwarding (or SMTP provider of choice)

---

## 📊 Step 1: Database Setup (5 minutes)

### 1.1 Create Neon Database

1. Go to [https://neon.tech](https://neon.tech)
2. Click "Sign Up" (free tier available)
3. Create a new project: **course-vendor**
4. Copy your connection string (it looks like):
   ```
   postgresql://user:password@ep-xxx.region.aws.neon.tech/neondb?sslmode=require
   ```

### 1.2 Initialize Database

**Option A: Using psql (Command Line)**
```bash
# Navigate to project root
cd /path/to/landing-course-vendor

# Connect and run schema
psql "YOUR_NEON_CONNECTION_STRING" -f database/schema.sql
```

**Option B: Using Neon SQL Editor**
1. Open Neon Console
2. Go to "SQL Editor"
3. Copy contents of `database/schema.sql`
4. Paste and run

✅ **Verify**: You should see 4 sample courses in the database.

---

## 🔧 Step 2: Backend Setup (10 minutes)

### 2.1 Get PayPal Credentials

1. Go to [https://developer.paypal.com](https://developer.paypal.com)
2. Login and go to **Dashboard**
3. Click **Apps & Credentials**
4. Create a new app or use existing
5. Copy:
   - **Client ID**: `AYxxxxxxxxxxxxxx`
   - **Secret**: `EPxxxxxxxxxxxxxx`

### 2.2 Get SendGrid API Key

1. Go to [https://sendgrid.com](https://sendgrid.com)
2. Sign up (free tier: 100 emails/day)
3. Go to **Settings** → **API Keys**
4. Create new API key
5. Copy the key: `SG.xxxxxxxxxxxxxx`
6. Verify your sender email address

### 2.3 Configure Backend

```bash
# Navigate to backend
cd backend/CourseVendor.API

# Edit appsettings.json
# Replace the following values:
```

Edit `appsettings.json`:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "YOUR_NEON_CONNECTION_STRING"
  },
  "PayPal": {
    "Mode": "sandbox",
    "ClientId": "YOUR_PAYPAL_CLIENT_ID",
    "ClientSecret": "YOUR_PAYPAL_CLIENT_SECRET"
  },
  "Email": {
    "SmtpHost": "smtp.gmail.com",
    "SmtpPort": "587",
    "SmtpUser": "your-gmail@gmail.com",
    "SmtpPassword": "your-16-char-app-password",
    "FromEmail": "your-gmail@gmail.com",
    "FromName": "Your Course Store"
  },
  "Owner": {
    "Email": "your-personal-email@example.com"
  },
  "Admin": {
    "Username": "admin",
    "Password": "change-this-secure-password"
  },
  "Frontend": {
    "Url": "http://localhost:3000"
  }
}
```

**Email Setup** (see `EMAIL_SETUP.md` for detailed instructions):
1. Enable 2-Step Verification on Gmail
2. Generate App Password at https://myaccount.google.com/apppasswords
3. Use the 16-character password in `SmtpPassword`

### 2.4 Run Backend

```bash
# Restore packages
dotnet restore

# Run the API
dotnet run

# Or with hot reload
dotnet watch run
```

✅ **Verify**: Backend should be running at `http://localhost:5000`

Test: Open `http://localhost:5000/swagger` in your browser

---

## 🎨 Step 3: Frontend Setup (5 minutes)

### 3.1 Install Dependencies

```bash
# Navigate to frontend
cd frontend

# Install packages
npm install
```

### 3.2 Configure Environment

```bash
# Create environment file
cp .env.local.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_PAYPAL_CLIENT_ID=YOUR_PAYPAL_CLIENT_ID
```

**Important**: Use the same PayPal Client ID from Step 2.1

### 3.3 Run Frontend

```bash
npm run dev
```

✅ **Verify**: Frontend should be running at `http://localhost:3000`

---

## 👤 Step 4: Admin Panel Access (2 minutes)

### 4.1 Login to Admin Panel

1. Open `http://localhost:3000/admin/login`
2. Enter credentials from `appsettings.json`:
   - Username: `admin`
   - Password: (your configured password)
3. Click "Login"

### 4.2 Create Your First Course

1. Click **"+ New Course"**
2. Fill in the form:
   - **Name**: "Complete Web Development"
   - **Subtitle**: "Learn HTML, CSS, JavaScript, and React"
   - **Description**: "A comprehensive course for beginners..."
   - **Image URL**: `https://images.unsplash.com/photo-1498050108023-c5249f4df085`
   - **Full Price**: `99.00`
   - **Discount %**: `20`
3. Click **"Create"**
4. Course appears on storefront immediately

See `ADMIN_GUIDE.md` for complete admin panel documentation.

---

## 🧪 Step 5: Test the System (5 minutes)

### 5.1 View Courses
1. Open `http://localhost:3000`
2. You should see 5 courses (4 sample + 1 you created)
3. Each shows image, price, and discount

### 5.2 Test Purchase Flow

1. Click **"Buy Course"** on any course
2. Enter your email address
3. Click the PayPal button
4. Log in with PayPal Sandbox account:
   - Go to https://developer.paypal.com/dashboard
   - Click "Sandbox" → "Accounts"
   - Use a test buyer account
   - Or create a new one

5. Complete the payment
6. You should see success message with purchase code

### 5.3 Verify Emails

Check both:
- **Customer email**: Should receive confirmation with purchase code
- **Your personal email**: Should receive notification about the sale

### 5.4 Check Admin Dashboard

1. Go back to `http://localhost:3000/admin`
2. See updated stats:
   - Total Purchases: 1
   - Total Revenue: $XX.XX
3. View purchase in "Recent Purchases" section

---

## 🎯 Common Issues & Solutions

### Issue: Backend won't start

**Solution**: 
```bash
# Check .NET version
dotnet --version  # Should be 8.0+

# Restore packages again
dotnet restore
dotnet build
```

### Issue: Frontend won't start

**Solution**:
```bash
# Clear node_modules
rm -rf node_modules
npm install

# Or use yarn
yarn install
```

### Issue: PayPal button not showing

**Solution**:
- Check `.env.local` has correct PayPal Client ID
- Verify backend is running
- Check browser console for errors
- Clear browser cache

### Issue: Database connection failed

**Solution**:
- Verify Neon connection string is correct
- Check SSL mode is `require` or `prefer`
- Test connection with psql

### Issue: Emails not sending

**Solution**:
- Verify SendGrid API key is valid
- Check sender email is verified in SendGrid
- Review SendGrid activity logs
- Check spam folder

---

## 📱 What's Next?

### For Development
- Customize course data in database
- Modify frontend styles in Tailwind
- Add more features (user dashboard, etc.)

### For Production
- Read [DEPLOYMENT.md](DEPLOYMENT.md)
- Switch PayPal to live mode
- Deploy to Vercel (frontend) and Render (backend)
- Use custom domain

---

## 🛟 Need Help?

### Check Documentation
- [Backend Setup](backend/README.md) - Detailed backend guide
- [Frontend Setup](frontend/README.md) - Detailed frontend guide
- [Deployment](DEPLOYMENT.md) - Production deployment

### Debug Mode
Enable detailed logging in backend `appsettings.json`:
```json
"Logging": {
  "LogLevel": {
    "Default": "Debug"
  }
}
```

### API Testing
Use Swagger UI at `http://localhost:5000/swagger` to test endpoints

---

## ✅ System Check

Everything working? Verify:

- [ ] Backend running on port 5000
- [ ] Frontend running on port 3000
- [ ] Can see 4 courses on homepage
- [ ] PayPal button appears in checkout
- [ ] Can complete test purchase
- [ ] Receive confirmation email
- [ ] Purchase saved in database

🎉 **Congratulations!** Your Course Vendor system is ready!

---

## 🔐 Security Reminders

**Before deploying to production:**

1. ✅ Change PayPal mode to "live"
2. ✅ Use production PayPal credentials
3. ✅ Never commit `appsettings.json` or `.env.local`
4. ✅ Use environment variables in production
5. ✅ Enable HTTPS everywhere
6. ✅ Review CORS settings

---

## 📊 Monitoring

### Local Development
- Backend logs: Terminal where `dotnet run` is running
- Frontend logs: Browser console (F12)
- Database: Neon Console

### Production
- Backend: Check hosting platform logs (Render/Railway)
- Frontend: Vercel/Netlify deployment logs
- Emails: SendGrid activity log
- Payments: PayPal dashboard

---

## 💡 Tips

1. **Use Sandbox**: Always test with PayPal sandbox before going live
2. **Test Emails**: SendGrid free tier has 100 emails/day limit
3. **Database Backups**: Export your data regularly
4. **Version Control**: Commit your changes to Git
5. **Environment Variables**: Never hardcode secrets

---

Happy Coding! 🚀
