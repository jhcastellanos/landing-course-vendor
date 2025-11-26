# Admin Panel Guide

## Overview

The admin panel allows you to manage courses, view sales statistics, and monitor purchases. It's a modern, responsive interface accessible at `/admin`.

## Access

**URL:** `http://localhost:3000/admin/login` (local) or `https://yoursite.com/admin/login` (production)

### Default Credentials

Configure in `backend/CourseVendor.API/appsettings.json`:

```json
{
  "Admin": {
    "Username": "admin",
    "Password": "change-this-password"
  }
}
```

⚠️ **IMPORTANT:** Change the default password before deploying to production!

## Features

### 1. Dashboard Overview

When you log in, you'll see:

- **Total Courses** - Number of courses in your catalog
- **Active Courses** - Courses visible to customers
- **Total Purchases** - All-time purchase count
- **Total Revenue** - Total amount earned (USD)

### 2. Course Management

#### Create a New Course

1. Click **"+ New Course"** button
2. Fill in the form:
   - **Course Name*** - Main title (e.g., "Master React Development")
   - **Subtitle*** - Brief description (e.g., "Build modern web applications")
   - **Description*** - Detailed course information
   - **Image URL*** - Course thumbnail (use Unsplash: https://unsplash.com)
   - **Full Price (USD)*** - Original price before discount
   - **Discount %** - Percentage off (0-100)
3. Click **"Create"**

**Example Course:**
```
Name: Complete JavaScript Bootcamp
Subtitle: From zero to hero in JavaScript
Description: Master JavaScript with hands-on projects and real-world examples...
Image URL: https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a
Full Price: 99.00
Discount %: 30
```

#### Edit a Course

1. Find the course in the table
2. Click **"Edit"**
3. Update any fields
4. Toggle **"Active"** to show/hide from customers
5. Click **"Update"**

#### Delete a Course

1. Find the course in the table
2. Click **"Delete"**
3. Confirm the deletion

⚠️ **Warning:** Deleting a course is permanent and cannot be undone.

#### Toggle Course Visibility

- **Active** (green badge) - Visible to customers on the store
- **Inactive** (gray badge) - Hidden from customers, but not deleted

Use this to temporarily hide courses without deleting them.

### 3. Promotions & Discounts

Promotions are managed through the **Discount %** field:

- **0%** - No discount (full price)
- **10%** - 10% off
- **25%** - 25% off
- **50%** - 50% off
- **100%** - Free course

**How it works:**
- Frontend automatically calculates: `Final Price = Full Price × (1 - Discount / 100)`
- Customer sees crossed-out full price and discounted price
- PayPal charges the final price

**Example:**
```
Full Price: $99.00
Discount: 30%
Final Price: $69.30 (automatically calculated)
```

### 4. Sales Monitoring

#### View Recent Purchases

The dashboard shows the 5 most recent purchases with:
- Purchase code
- Customer email
- Course purchased
- Amount paid
- Purchase date/time

#### Advanced Purchase Tracking

Future feature: Click **"Purchases"** to see:
- Paginated purchase history
- Filter by date range
- Search by customer email
- Export to CSV

## Design Philosophy

The admin panel follows a **modern, minimalist** design:

- Clean white background
- Indigo accent color (#4f46e5)
- Card-based layout
- Responsive grid (1 column mobile, 4 columns desktop)
- Clear typography hierarchy
- Intuitive icons and badges

## Responsive Design

The panel adapts to all screen sizes:

- **Mobile** (< 768px): Single column layout, stacked cards
- **Tablet** (768px - 1024px): Two-column grid
- **Desktop** (> 1024px): Four-column stats grid, full-width table

## Security Features

### Current Implementation

1. **Simple Authentication**
   - Username/password login
   - Token stored in localStorage
   - Token sent with all admin API requests

2. **CORS Protection**
   - Only allows requests from configured frontend URL
   - Prevents unauthorized cross-origin requests

### Production Recommendations

For production deployment, enhance security with:

1. **JWT Tokens**
   ```csharp
   // Add to Program.cs
   builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
       .AddJwtBearer(options => { /* config */ });
   ```

2. **Password Hashing**
   ```csharp
   // Use BCrypt or PBKDF2
   var hashedPassword = BCrypt.Net.BCrypt.HashPassword(password);
   ```

3. **Rate Limiting**
   ```csharp
   builder.Services.AddRateLimiter(options => { /* config */ });
   ```

4. **HTTPS Only**
   - Enforce SSL/TLS in production
   - Set secure cookie flags

## Keyboard Shortcuts

- **Esc** - Close any open modal
- **Tab** - Navigate form fields
- **Enter** - Submit forms

## Browser Compatibility

Tested and working on:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Common Tasks

### Task 1: Launch a New Course

1. Log in to admin panel
2. Click "+ New Course"
3. Fill in all required fields
4. Set discount percentage (e.g., 20% for launch promo)
5. Click "Create"
6. Course appears immediately on storefront

### Task 2: Run a Flash Sale

1. Edit the course
2. Increase "Discount %" (e.g., from 10% to 50%)
3. Click "Update"
4. Customers see new price immediately

### Task 3: Hide Sold-Out Course

1. Edit the course
2. Uncheck "Active (visible to customers)"
3. Click "Update"
4. Course hidden from storefront but remains in admin

### Task 4: Monitor Daily Sales

1. Log in to admin panel
2. Check "Total Purchases" stat
3. Scroll to "Recent Purchases" section
4. Review latest transactions

## API Endpoints

The admin panel uses these backend endpoints:

```
POST   /api/admin/login          - Authenticate admin
GET    /api/admin/courses        - List all courses
POST   /api/admin/courses        - Create new course
PUT    /api/admin/courses/:id    - Update course
DELETE /api/admin/courses/:id    - Delete course
GET    /api/admin/stats          - Get dashboard statistics
GET    /api/admin/purchases      - List purchases (paginated)
```

## Troubleshooting

### Can't Log In
- ✅ Check username/password in `appsettings.json`
- ✅ Verify backend is running
- ✅ Check browser console for errors

### Changes Not Appearing
- ✅ Hard refresh browser (Cmd+Shift+R / Ctrl+Shift+F5)
- ✅ Check that course is marked "Active"
- ✅ Verify backend saved changes (check database)

### Image Not Loading
- ✅ Use HTTPS URLs (not HTTP)
- ✅ Test URL in browser first
- ✅ Ensure image is publicly accessible

## Future Enhancements

Potential features to add:

1. **Bulk Actions** - Edit multiple courses at once
2. **Analytics Dashboard** - Charts and graphs for sales trends
3. **Email Customization** - Edit email templates from admin panel
4. **Customer Management** - View customer list, purchase history
5. **Coupon Codes** - Create time-limited discount codes
6. **Course Categories** - Organize courses by topic
7. **Multi-Currency** - Support EUR, GBP, etc.
8. **File Uploads** - Upload course images directly

## Getting Help

If you encounter issues:

1. Check browser console (F12) for JavaScript errors
2. Check backend logs for API errors
3. Verify database connection
4. Review `TESTING.md` for debugging steps
