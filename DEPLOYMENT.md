# Deployment Guide

This guide covers deploying the Course Vendor application to production.

## Architecture

- **Frontend**: Vercel (recommended) or Netlify
- **Backend**: Render, Railway, or Azure App Service
- **Database**: Neon PostgreSQL (already cloud-hosted)

---

## Frontend Deployment (Vercel)

### Prerequisites
- GitHub account
- Vercel account (free tier available)

### Steps

1. **Push Code to GitHub**
   ```bash
   cd frontend
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to [https://vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Configure:
     - **Framework Preset**: Next.js
     - **Root Directory**: `frontend`
     - **Build Command**: `npm run build`
     - **Output Directory**: `.next`

3. **Set Environment Variables**
   In Vercel project settings, add:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.com/api
   NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_client_id
   ```

4. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy your app
   - You'll get a URL like: `https://your-app.vercel.app`

### Alternative: Netlify

```bash
cd frontend
npm run build

# Deploy to Netlify
npx netlify-cli deploy --prod
```

---

## Backend Deployment (Render)

### Prerequisites
- Render account (free tier available)
- GitHub repository

### Steps

1. **Prepare Backend**
   
   Create `render.yaml` in backend directory:
   ```yaml
   services:
     - type: web
       name: course-vendor-api
       env: dotnet
       buildCommand: dotnet publish -c Release -o out
       startCommand: dotnet out/CourseVendor.API.dll
       envVars:
         - key: ASPNETCORE_ENVIRONMENT
           value: Production
         - key: ASPNETCORE_URLS
           value: http://0.0.0.0:5000
   ```

2. **Push to GitHub**
   ```bash
   cd backend
   git init
   git add .
   git commit -m "Backend deployment"
   git push
   ```

3. **Deploy to Render**
   - Go to [https://render.com](https://render.com)
   - Click "New +" → "Web Service"
   - Connect GitHub repository
   - Configure:
     - **Name**: course-vendor-api
     - **Environment**: .NET
     - **Build Command**: `dotnet publish -c Release -o out`
     - **Start Command**: `dotnet out/CourseVendor.API.dll`
     - **Root Directory**: `backend/CourseVendor.API`

4. **Set Environment Variables**
   Add these in Render dashboard:
   ```
   ConnectionStrings__DefaultConnection=Your_Neon_Connection_String
   PayPal__Mode=live
   PayPal__ClientId=Your_PayPal_Client_ID
   PayPal__ClientSecret=Your_PayPal_Secret
   SendGrid__ApiKey=Your_SendGrid_API_Key
   SendGrid__FromEmail=noreply@yourdomain.com
   SendGrid__FromName=Course Vendor
   Owner__Email=your-email@example.com
   Owner__Name=Your Name
   Frontend__Url=https://your-frontend.vercel.app
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Render will build and deploy
   - You'll get a URL like: `https://course-vendor-api.onrender.com`

### Alternative: Railway

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Deploy
cd backend/CourseVendor.API
railway init
railway up
```

### Alternative: Azure App Service

1. Install Azure CLI
2. Create App Service:
   ```bash
   az webapp up --name course-vendor-api --runtime "DOTNET|8.0"
   ```
3. Configure environment variables in Azure Portal

---

## Database Setup (Neon)

Your Neon database is already cloud-hosted, so no deployment needed.

### Production Checklist
- ✅ Database is accessible from backend server
- ✅ Connection string uses SSL
- ✅ Run production schema (`database/schema.sql`)
- ✅ Backup strategy in place

---

## PayPal Production Setup

### Important: Switch to Live Mode

1. **Get Live Credentials**
   - Go to PayPal Developer Dashboard
   - Switch to "Live" mode
   - Create production app credentials

2. **Update Backend Config**
   ```json
   "PayPal": {
     "Mode": "live",
     "ClientId": "LIVE_CLIENT_ID",
     "ClientSecret": "LIVE_CLIENT_SECRET"
   }
   ```

3. **App Review**
   - Some PayPal features require app review
   - Submit your app for approval if needed

---

## Final Configuration

### Update Frontend Environment
After backend is deployed, update Vercel environment variables:
```
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api
NEXT_PUBLIC_PAYPAL_CLIENT_ID=YOUR_LIVE_PAYPAL_CLIENT_ID
```

### Update Backend CORS
In backend `Program.cs`, ensure frontend URL is allowed:
```csharp
policy.WithOrigins("https://your-frontend.vercel.app")
```

Or use environment variable:
```
Frontend__Url=https://your-frontend.vercel.app
```

---

## SSL/HTTPS

- **Vercel**: Automatic HTTPS with free SSL certificate
- **Render**: Automatic HTTPS with free SSL certificate
- **Railway**: Automatic HTTPS
- **Custom Domain**: Configure DNS settings

---

## Monitoring & Maintenance

### Logs
- **Vercel**: Check deployment logs in dashboard
- **Render**: View logs in service dashboard
- **Neon**: Monitor database usage

### Health Checks
Create a health endpoint in backend:
```csharp
app.MapGet("/health", () => Results.Ok("Healthy"));
```

### Backups
- **Neon**: Automatic backups (check plan)
- **Manual**: Export database regularly

---

## Custom Domain (Optional)

### Frontend (Vercel)
1. Go to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records

### Backend (Render)
1. Go to Service Settings → Custom Domain
2. Add domain
3. Update DNS CNAME record

---

## Testing Production

1. **Test Course Listing**
   - Visit frontend URL
   - Verify courses load

2. **Test Payment Flow**
   - Select a course
   - Enter email
   - Complete PayPal payment (use real PayPal sandbox/live)

3. **Verify Emails**
   - Check customer receives confirmation
   - Check owner receives notification

4. **Check Database**
   - Verify purchase is recorded
   - Confirm purchase code is generated

---

## Troubleshooting

### Frontend Can't Reach Backend
- Check CORS settings
- Verify API URL is correct
- Check Render service is running

### PayPal Errors
- Verify live credentials
- Check webhook configuration
- Review PayPal dashboard logs

### Email Not Sending
- Verify SendGrid domain
- Check API key is valid
- Review SendGrid activity

### Database Connection Failed
- Check Neon connection string
- Verify SSL mode is required
- Check IP whitelist (if enabled)

---

## Cost Estimates

### Free Tier
- **Vercel**: Free for personal projects
- **Render**: Free tier (with limitations)
- **Neon**: Free tier (0.5 GB storage)
- **SendGrid**: Free tier (100 emails/day)

### Paid Plans (Approximate)
- **Vercel Pro**: $20/month
- **Render**: $7/month (starter)
- **Neon**: $19/month (scale plan)
- **SendGrid**: Starts at $15/month

---

## Security Best Practices

1. ✅ Use HTTPS everywhere
2. ✅ Keep secrets in environment variables
3. ✅ Enable CORS only for your domain
4. ✅ Use strong database passwords
5. ✅ Keep dependencies updated
6. ✅ Monitor logs for suspicious activity
7. ✅ Implement rate limiting (optional)
8. ✅ Use PayPal's fraud protection

---

## Scaling Considerations

As your business grows:

1. **Database**: Upgrade Neon plan
2. **Backend**: Scale Render instances
3. **Frontend**: Vercel scales automatically
4. **Email**: Upgrade SendGrid plan
5. **CDN**: Consider Cloudflare for static assets

---

## Support & Resources

- **Vercel Docs**: https://vercel.com/docs
- **Render Docs**: https://render.com/docs
- **Neon Docs**: https://neon.tech/docs
- **PayPal Docs**: https://developer.paypal.com/docs
- **SendGrid Docs**: https://docs.sendgrid.com

---

## Deployment Checklist

Before going live:

- [ ] Database schema deployed to Neon
- [ ] Backend deployed and accessible
- [ ] Frontend deployed and accessible
- [ ] Environment variables configured
- [ ] PayPal in live mode with production credentials
- [ ] SendGrid sender verified
- [ ] Owner email configured
- [ ] Test purchase completed successfully
- [ ] Confirmation emails working
- [ ] Custom domain configured (optional)
- [ ] SSL certificates active
- [ ] Monitoring/logging setup
- [ ] Backup strategy in place
