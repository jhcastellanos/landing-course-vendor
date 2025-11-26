# Frontend Setup Guide

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

## Installation Steps

### 1. Navigate to Frontend Directory

```bash
cd frontend
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the frontend directory:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your values:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_PAYPAL_CLIENT_ID=YOUR_PAYPAL_CLIENT_ID
```

**Important**: Use the same PayPal Client ID from your backend configuration.

### 4. Run Development Server

```bash
npm run dev
# or
yarn dev
```

The application will be available at: **http://localhost:3000**

## Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home page
│   │   └── globals.css        # Global styles
│   ├── components/            # React components
│   │   ├── CourseCard.tsx    # Course display card
│   │   └── CheckoutModal.tsx # Payment checkout modal
│   ├── lib/                   # Utilities
│   │   └── api.ts            # API client
│   └── types/                 # TypeScript types
│       └── index.ts
├── public/                    # Static files
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── next.config.js
```

## Features

### Landing Page
- Displays all available courses
- Shows course images, descriptions, prices
- Highlights discounts
- Responsive design

### Checkout Modal
- Customer information form
- PayPal integration
- Credit card support via PayPal
- Purchase confirmation
- Displays unique purchase code

## PayPal Integration

The app uses `@paypal/react-paypal-js` for payment processing:

1. Customer enters email
2. PayPal button appears
3. Customer can pay with:
   - PayPal account
   - Credit/Debit card (Visa, Mastercard)
4. Payment processed securely
5. Confirmation shown with purchase code

## Building for Production

```bash
npm run build
npm start
```

## Troubleshooting

### PayPal Button Not Showing
- Verify `NEXT_PUBLIC_PAYPAL_CLIENT_ID` is set
- Check browser console for errors
- Ensure backend API is running

### API Connection Issues
- Check `NEXT_PUBLIC_API_URL` points to backend
- Verify CORS settings in backend
- Check network tab in browser dev tools

### Image Loading Issues
- Verify `next.config.js` includes image domains
- Check image URLs are accessible

## Deployment

See [DEPLOYMENT.md](../DEPLOYMENT.md) for deployment instructions to Vercel.

## Customization

### Styling
- Edit `tailwind.config.js` for theme colors
- Modify `globals.css` for global styles
- Component styles use Tailwind classes

### Course Images
- Default images from Unsplash
- Update in database or use your own URLs
- Ensure domains are added to `next.config.js`

### Branding
- Update header text in `app/page.tsx`
- Change colors in `tailwind.config.js`
- Modify footer content
