# 🎓 Course Vendor - Complete E-Learning Platform

A modern, full-stack e-commerce system for selling online courses with integrated PayPal payments, automated email notifications, and a powerful admin panel for course management.

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![.NET](https://img.shields.io/badge/.NET-8.0-512BD4)](https://dotnet.microsoft.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-336791)](https://neon.tech/)
[![PayPal](https://img.shields.io/badge/PayPal-REST_API-00457C)](https://developer.paypal.com/)

---

## 🌟 Key Features

### For Customers
- 🛍️ Browse courses with beautiful card layouts
- 💳 Secure PayPal checkout (PayPal account + Visa/Mastercard)
- 📧 Instant email confirmation with unique purchase code
- 📱 Fully responsive design (mobile, tablet, desktop)
- 🎨 Modern, minimalist UI with TailwindCSS

### For Business Owners
- 👤 **Admin Panel** - Create, edit, and delete courses
- 💰 Direct payments to your PayPal account (USD)
- 📬 Email notifications for every sale (forwarded to your inbox)
- 🏷️ **Promotion Management** - Set discount percentages per course
- 📊 **Sales Dashboard** - Real-time statistics and recent purchases
- 🔐 Secure purchase tracking with unique codes
- 🚀 Easy deployment to production

---

## 🏗️ System Architecture

```
┌─────────────────┐         ┌──────────────────┐         ┌─────────────────┐
│   Frontend      │         │    Backend       │         │   Database      │
│   (Next.js)     │ ◄─────► │  (.NET Core)     │ ◄─────► │  (PostgreSQL)   │
│   Port 3000     │  HTTP   │   Port 5000      │  SQL    │     Neon        │
│                 │         │                  │         │                 │
│ • Landing Page  │         │ • Course API     │         │ • courses       │
│ • Admin Panel   │         │ • Payment API    │         │ • customers     │
│ • Checkout      │         │ • Admin API      │         │ • purchases     │
└─────────────────┘         └──────────────────┘         └─────────────────┘
         │                           │
         │                           │
         ▼                           ▼
┌─────────────────┐         ┌──────────────────┐
│   PayPal        │         │   SMTP Email     │
│   REST API      │         │   (Gmail/Other)  │
└─────────────────┘         └──────────────────┘
```

### Technology Stack

**Frontend** 🎨
- **Framework**: Next.js 14 (React 18)
- **Styling**: TailwindCSS
- **Language**: TypeScript
- **API Client**: Axios
- **Payment UI**: @paypal/react-paypal-js

**Backend** ⚙️
- **Framework**: .NET 8.0 Web API
- **ORM**: Entity Framework Core
- **Database Driver**: Npgsql (PostgreSQL)
- **Email**: SMTP (Gmail, SendGrid, Mailgun, AWS SES)
- **API Docs**: Swagger/OpenAPI

**Database** 💾
- **Type**: PostgreSQL
- **Hosting**: Neon (serverless)
- **Tables**: Courses, Customers, Purchases

**External Services** 🔌
- **Payments**: PayPal REST API (sandbox + live)
- **Email**: SMTP (any provider)
- **Deployment**: Vercel + Render/Railway

---

## 🚀 Quick Start (25 minutes)

### Prerequisites
```bash
# Check versions
node --version    # Need 18+
dotnet --version  # Need 8.0+
```

### 1️⃣ Clone & Setup Database (5 min)
```bash
# Clone the repository
cd landing-course-vendor

# Create Neon database at https://neon.tech
# Run database/schema.sql in Neon SQL Editor
```

### 2️⃣ Backend Setup (10 min)
```bash
cd backend/CourseVendor.API

# Edit appsettings.json with your credentials:
# - Neon connection string
# - PayPal Client ID & Secret (from developer.paypal.com)
# - Gmail SMTP credentials (generate App Password)
# - Your personal email address
# - Admin username & password

dotnet restore
dotnet run
# Backend running at http://localhost:5000
```

### 3️⃣ Frontend Setup (5 min)
```bash
cd frontend

npm install

# Create .env.local
echo "NEXT_PUBLIC_API_URL=http://localhost:5000/api" > .env.local
echo "NEXT_PUBLIC_PAYPAL_CLIENT_ID=YOUR_PAYPAL_CLIENT_ID" >> .env.local

npm run dev
# Frontend running at http://localhost:3000
```

### 4️⃣ Test Purchase (3 min)
1. Open http://localhost:3000
2. Click "Buy Course"
3. Enter email
4. Complete PayPal sandbox payment
5. Receive confirmation email with purchase code!

📚 **Detailed Guide**: See [QUICKSTART.md](./QUICKSTART.md)

---

## 📁 Project Structure

```
landing-course-vendor/
│
├── 📄 README.md                 # This file
├── 📄 QUICKSTART.md             # Step-by-step setup guide
├── 📄 DEPLOYMENT.md             # Production deployment guide
├── 📄 TESTING.md                # Testing guide
│
├── 📂 frontend/                 # Next.js React App
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx      # Root layout
│   │   │   ├── page.tsx        # Homepage with courses
│   │   │   └── globals.css     # Global styles
│   │   ├── components/
│   │   │   ├── CourseCard.tsx  # Course display card
│   │   │   └── CheckoutModal.tsx # Payment modal
│   │   ├── lib/
│   │   │   └── api.ts          # API client functions
│   │   └── types/
│   │       └── index.ts        # TypeScript interfaces
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   └── next.config.js
│
├── 📂 backend/                  # .NET Web API
│   ├── CourseVendor.API/
│   │   ├── Controllers/
│   │   │   ├── CoursesController.cs    # Course endpoints
│   │   │   └── PaymentController.cs    # Payment endpoints
│   │   ├── Models/
│   │   │   ├── Course.cs               # Course entity
│   │   │   ├── Customer.cs             # Customer entity
│   │   │   ├── Purchase.cs             # Purchase entity
│   │   │   └── DTOs/                   # Data transfer objects
│   │   ├── Services/
│   │   │   ├── PayPalService.cs        # PayPal integration
│   │   │   ├── SendGridEmailService.cs # Email service
│   │   │   └── PurchaseService.cs      # Business logic
│   │   ├── Data/
│   │   │   └── AppDbContext.cs         # EF Core context
│   │   ├── Program.cs                  # App entry point
│   │   ├── appsettings.json            # Configuration
│   │   └── CourseVendor.API.csproj     # Project file
│   ├── CourseVendor.sln
│   └── README.md
│
└── 📂 database/
    └── schema.sql               # PostgreSQL schema + sample data
```

---

## 💡 How It Works

### Purchase Flow

```
1. Customer browses courses
   └─► Loads from backend API (/api/courses)

2. Clicks "Buy Course"
   └─► Opens checkout modal
   └─► Enters email & name

3. Clicks PayPal button
   └─► Frontend calls backend (/api/payment/create-order)
   └─► Backend creates PayPal order
   └─► Customer redirected to PayPal

4. Customer completes payment
   └─► PayPal redirects back
   └─► Frontend calls backend (/api/payment/capture-order)
   └─► Backend captures payment

5. Backend processes purchase
   └─► Saves to database
   └─► Generates unique code (CRS-XXXXXXXXXXXX)
   └─► Sends email to customer
   └─► Sends notification to owner

6. Success screen shown
   └─► Displays purchase code
   └─► Customer receives email confirmation
```

---

## 📧 Email Templates

### Customer Confirmation
- ✅ Thank you message
- ✅ Course name
- ✅ Unique purchase code (12 characters)
- ✅ Professional HTML design
- ✅ Company branding

### Owner Notification
- ✅ Customer email
- ✅ Course purchased
- ✅ Purchase code
- ✅ Timestamp
- ✅ Quick reference format

---

## 🔒 Security Features

- ✅ HTTPS everywhere (production)
- ✅ PayPal secure checkout
- ✅ CORS protection
- ✅ Environment variables for secrets
- ✅ SQL injection prevention (EF Core)
- ✅ Input validation
- ✅ Secure connection strings

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [QUICKSTART.md](./QUICKSTART.md) | Complete setup guide with screenshots |
| [backend/README.md](./backend/README.md) | Backend setup and API documentation |
| [frontend/README.md](./frontend/README.md) | Frontend setup and customization |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Production deployment (Vercel, Render, etc.) |
| [TESTING.md](./TESTING.md) | Testing guide and checklist |

---

## 🛠️ Configuration

### Required Credentials

1. **Neon Database** (Free tier available)
   - Create at [neon.tech](https://neon.tech)
   - Get connection string

2. **PayPal Developer** (Sandbox free)
   - Create app at [developer.paypal.com](https://developer.paypal.com)
   - Get Client ID & Secret

3. **SendGrid** (100 emails/day free)
   - Create account at [sendgrid.com](https://sendgrid.com)
   - Get API Key
   - Verify sender email

### Environment Variables

**Backend** (`appsettings.json`)
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "YOUR_NEON_CONNECTION_STRING"
  },
  "PayPal": {
    "ClientId": "YOUR_PAYPAL_CLIENT_ID",
    "ClientSecret": "YOUR_PAYPAL_SECRET"
  },
  "SendGrid": {
    "ApiKey": "YOUR_SENDGRID_KEY",
    "FromEmail": "verified@youremail.com"
  },
  "Owner": {
    "Email": "your@email.com"
  }
}
```

**Frontend** (`.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_PAYPAL_CLIENT_ID=YOUR_PAYPAL_CLIENT_ID
```

---

## 🚀 Deployment

### Option 1: Vercel + Render (Recommended)
- **Frontend**: Deploy to Vercel (free, automatic)
- **Backend**: Deploy to Render (free tier)
- **Total Cost**: $0/month (free tiers)

### Option 2: Netlify + Railway
- **Frontend**: Deploy to Netlify
- **Backend**: Deploy to Railway
- **Total Cost**: ~$5-10/month

### Option 3: Azure
- **Full Stack**: Azure App Service
- **Total Cost**: ~$20-50/month

📖 **Deployment Guide**: See [DEPLOYMENT.md](./DEPLOYMENT.md)

---

## 🎨 Customization

### Change Colors
Edit `frontend/tailwind.config.js`:
```javascript
theme: {
  extend: {
    colors: {
      primary: '#4f46e5',  // Change this
      secondary: '#059669', // And this
    },
  },
}
```

### Add Courses
Add directly to database or update `database/schema.sql`:
```sql
INSERT INTO courses (name, title, description, image_url, full_price, discount_percentage, final_price)
VALUES ('Your Course', 'Full Title', 'Description', 'https://...', 199.99, 25, 149.99);
```

### Modify Emails
Edit `backend/CourseVendor.API/Services/SendGridEmailService.cs`

---

## 🧪 Testing

### Run Tests
```bash
# Backend
cd backend/CourseVendor.API
dotnet test

# Frontend  
cd frontend
npm test
```

### Manual Testing
1. Start backend and frontend
2. Open http://localhost:3000
3. Complete test purchase with PayPal sandbox
4. Verify email received
5. Check database for purchase record

📋 **Testing Checklist**: See [TESTING.md](./TESTING.md)

---

## 🐛 Troubleshooting

### PayPal Button Not Showing
```bash
# Check environment variable
echo $NEXT_PUBLIC_PAYPAL_CLIENT_ID

# Verify backend is running
curl http://localhost:5000/api/courses
```

### Database Connection Failed
```bash
# Test connection string
psql "YOUR_CONNECTION_STRING"
```

### Emails Not Sending
- Check SendGrid API key is valid
- Verify sender email is verified in SendGrid
- Check spam folder
- Review SendGrid activity log

---

## 📊 Database Schema

```sql
courses
├── id (PK)
├── name
├── description
├── image_url
├── full_price
├── discount_percentage
└── final_price

customers
├── id (PK)
├── email (UNIQUE)
└── full_name

purchases
├── id (PK)
├── customer_id (FK)
├── course_id (FK)
├── purchase_code (UNIQUE)
├── amount_paid
├── payment_method
├── paypal_transaction_id
└── payment_status
```

---

## 🤝 Support

Need help? Check:
1. [QUICKSTART.md](./QUICKSTART.md) - Setup guide
2. [TESTING.md](./TESTING.md) - Common issues
3. [DEPLOYMENT.md](./DEPLOYMENT.md) - Deployment help

---

## 📄 License

This project is provided as-is for educational and commercial use.

---

## 🎯 Roadmap

Future enhancements:
- [ ] Admin panel for course management
- [ ] User accounts and login
- [ ] Course content delivery
- [ ] Subscription plans
- [ ] Affiliate system
- [ ] Reviews and ratings
- [ ] Course bundles
- [ ] Coupon codes

---

## 🙏 Credits

Built with:
- [Next.js](https://nextjs.org/)
- [.NET](https://dotnet.microsoft.com/)
- [TailwindCSS](https://tailwindcss.com/)
- [PayPal](https://developer.paypal.com/)
- [SendGrid](https://sendgrid.com/)
- [Neon](https://neon.tech/)

---

**Ready to get started?** 👉 Check out [QUICKSTART.md](./QUICKSTART.md)

Made with ❤️ for online course creators
