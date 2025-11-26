# Course Vendor - Production Deployment Guide

## Overview
This guide will help you deploy the Course Vendor platform to production using:
- **Railway** for backend (.NET API + PostgreSQL)
- **Vercel** for frontend (Next.js)

Both platforms offer permanent URLs and free tiers suitable for production use.

---

## Part 1: Backend Deployment (Railway)

### Step 1: Create Railway Account
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Create a new project

### Step 2: Deploy Backend
1. Click "New Project" → "Deploy from GitHub repo"
2. Select your `landing-course-vendor` repository
3. Railway will auto-detect the .NET project
4. Set the **Root Directory** to: `backend/CourseVendor.API`

### Step 3: Add PostgreSQL Database
1. In your Railway project, click "+ New"
2. Select "Database" → "PostgreSQL"
3. Railway will create a PostgreSQL database
4. Copy the connection string (looks like: `postgresql://...`)

### Step 4: Configure Environment Variables
In Railway, go to your backend service → Variables tab and add:

```
ConnectionStrings__DefaultConnection=<Your Railway PostgreSQL connection string>
Admin__Username=jhcastellanos
Admin__Password=Ruudvan123*
Owner__Email=<YOUR_REAL_EMAIL>
Owner__Name=Jorge Castellanos
PayPal__ClientId=AX9_EzMXALdKr90F7oBRJceW3og3-xZaJkwkRYYMFtDoT7wkjhOmoaJeAdRzOUC_a_gDOsLdp2KVrhmm
PayPal__ClientSecret=ELoExNEgqX-YoVrUeqvRa-4_2HD2au4r3dAOIb5sjVGy0wEQZd51GLXSpwjhnRWY_fZXVyZxAaWH7PBA
PayPal__Mode=sandbox
Email__SmtpHost=smtp.gmail.com
Email__SmtpPort=587
Email__SmtpUser=<YOUR_GMAIL>
Email__SmtpPassword=<YOUR_GMAIL_APP_PASSWORD>
Email__FromEmail=<YOUR_GMAIL>
Email__FromName=Course Vendor
```

**Important Notes:**
- Replace `<YOUR_REAL_EMAIL>` with your actual email
- For Gmail SMTP, create an App Password: https://support.google.com/accounts/answer/185833
- For production PayPal, change to `PayPal__Mode=live` and update credentials

### Step 5: Add StartDate Column
Railway console or connect to your PostgreSQL database and run:
```sql
ALTER TABLE courses ADD COLUMN start_date TIMESTAMP WITH TIME ZONE NULL;
```

### Step 6: Get Your Backend URL
- Railway will assign a permanent URL like: `https://your-app.railway.app`
- This URL won't change
- Copy this URL for frontend configuration

---

## Part 2: Frontend Deployment (Vercel)

### Step 1: Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Import your repository

### Step 2: Configure Project
1. Click "Add New" → "Project"
2. Import `landing-course-vendor` from GitHub
3. **Root Directory**: `frontend`
4. **Framework Preset**: Next.js
5. **Build Command**: `npm run build`
6. **Output Directory**: `.next`

### Step 3: Environment Variables
Add these environment variables in Vercel:

```
NEXT_PUBLIC_API_URL=<Your Railway backend URL>/api
NEXT_PUBLIC_PAYPAL_CLIENT_ID=AX9_EzMXALdKr90F7oBRJceW3og3-xZaJkwkRYYMFtDoT7wkjhOmoaJeAdRzOUC_a_gDOsLdp2KVrhmm
```

Example:
```
NEXT_PUBLIC_API_URL=https://course-vendor-api.railway.app/api
```

### Step 4: Custom Domain (Optional but Recommended)
1. In Vercel project settings → "Domains"
2. Add a custom domain (e.g., `courses.yourdomain.com`)
3. Or use Vercel's free subdomain: `your-project.vercel.app`
4. This URL is permanent and won't change

### Step 5: Deploy
1. Click "Deploy"
2. Vercel will build and deploy automatically
3. Every push to `main` branch will auto-deploy

---

## Part 3: Backend CORS Configuration

Update your backend `Program.cs` to allow your Vercel URL:

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        builder =>
        {
            builder.WithOrigins(
                "http://localhost:3000",
                "https://your-project.vercel.app",  // Add your Vercel URL
                "https://courses.yourdomain.com"     // Add custom domain if you have one
            )
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
        });
});
```

Redeploy backend after this change.

---

## Part 4: Production PayPal Setup (When Ready)

### Switch to Live PayPal
1. Go to [PayPal Developer Dashboard](https://developer.paypal.com/)
2. Create a **Live** app (not Sandbox)
3. Get Live Client ID and Secret
4. Update Railway environment variables:
   ```
   PayPal__ClientId=<LIVE_CLIENT_ID>
   PayPal__ClientSecret=<LIVE_CLIENT_SECRET>
   PayPal__Mode=live
   ```
5. Update Vercel frontend:
   ```
   NEXT_PUBLIC_PAYPAL_CLIENT_ID=<LIVE_CLIENT_ID>
   ```

---

## Part 5: Email Configuration

### Gmail Setup (Recommended for Testing)
1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Google Account → Security → 2-Step Verification → App passwords
   - Create password for "Mail"
3. Use this App Password in Railway environment variables

### Alternative: SendGrid (Production Grade)
1. Sign up at [sendgrid.com](https://sendgrid.com)
2. Get API key
3. Update backend to use SendGrid service (already implemented in code)
4. Set `SendGrid__ApiKey` environment variable

---

## Testing Checklist

After deployment, test:

- [ ] ✅ Frontend loads at Vercel URL
- [ ] ✅ Backend health check: `https://your-railway-app.railway.app/api/courses`
- [ ] ✅ Admin login works: `https://your-vercel-url/admin`
- [ ] ✅ Course creation/editing works
- [ ] ✅ Purchase flow with PayPal works
- [ ] ✅ Email notifications sent (customer + owner)
- [ ] ✅ Purchases list visible in admin panel
- [ ] ✅ "Customers" button shows course purchasers
- [ ] ✅ Start Date field saves correctly

---

## Your Production URLs (Fill in)

### Backend (Railway)
```
https://_____________________.railway.app
```

### Frontend (Vercel)
```
https://_____________________.vercel.app
```

### Admin Panel
```
https://_____________________.vercel.app/admin
Username: jhcastellanos
Password: Ruudvan123*
```

---

## Important Security Notes

1. **Change Admin Password**: Update in Railway environment variables after first login
2. **Use HTTPS Only**: Both Railway and Vercel provide SSL automatically
3. **Protect API Keys**: Never commit secrets to Git
4. **PayPal Sandbox**: Test thoroughly before switching to Live mode
5. **Database Backups**: Railway provides automatic backups

---

## Cost Estimate

### Free Tier Usage:
- **Railway**: $5/month credit (enough for low-traffic sites)
- **Vercel**: Unlimited hobby projects, 100GB bandwidth/month
- **Total**: ~$0-5/month for moderate traffic

### Scaling:
- Both platforms scale automatically
- Pay only for what you use
- Railway: ~$0.000463/minute for compute
- Vercel: $20/month for Pro (unlimited)

---

## Support & Monitoring

### Railway
- View logs: Project → Service → Logs
- Monitor metrics: CPU, Memory, Network
- Database backups automatic

### Vercel
- View deployments: Project → Deployments
- Analytics: Project → Analytics
- Preview branches before merging

---

## Maintenance

### Regular Tasks:
1. Monitor email delivery (check spam folders)
2. Review purchases in admin panel weekly
3. Update PayPal credentials when needed
4. Backup database monthly (Railway does this automatically)

### Updates:
- Push to GitHub main branch = auto-deploy
- Railway and Vercel rebuild automatically
- Zero downtime deployments

---

## Troubleshooting

### Frontend can't reach backend
- Check CORS configuration
- Verify `NEXT_PUBLIC_API_URL` is correct
- Check Railway backend logs

### PayPal not working
- Verify client ID matches environment
- Check PayPal mode (sandbox vs live)
- Review browser console for errors

### Emails not sending
- Verify SMTP credentials
- Check spam folders
- Review backend logs for errors
- Test with SendGrid instead

---

## Next Steps

1. ✅ Complete deployment following this guide
2. ✅ Test all features in production
3. ✅ Configure real email SMTP
4. ✅ Add your first course
5. ✅ Test purchase with PayPal sandbox
6. 📅 When ready: Switch to PayPal Live mode
7. 📧 Update owner email to your real email
8. 🔒 Change admin password

---

## Contact & Support

For issues:
- Railway: [docs.railway.app](https://docs.railway.app)
- Vercel: [vercel.com/docs](https://vercel.com/docs)
- PayPal: [developer.paypal.com](https://developer.paypal.com)
