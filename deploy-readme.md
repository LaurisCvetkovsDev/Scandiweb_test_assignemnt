# Deployment Guide

## Prerequisites

Your code is now ready for deployment! Here's what has been prepared:

- Auto-detecting Database.php that works on both local and remote
- Frontend that automatically detects the correct GraphQL endpoint
- Clean codebase ready for upload

## Step-by-Step Deployment Process

### 1. Choose a Hosting Provider

**Recommended (Free):** 000webhost.com

- Supports PHP 7.4+
- Includes MySQL database
- Free SSL certificate

**Alternatives:**

- InfinityFree
- AwardSpace
- Heroku (with ClearDB addon)

### 2. Set Up Your Hosting Account

1. Sign up at your chosen provider
2. Create a new website/application
3. Note down your:
   - Domain name (e.g., yoursite.000webhostapp.com)
   - Database host, name, username, password
   - FTP/File Manager access

### 3. Upload Your Files

Upload these folders to your `public_html` directory:

```
public_html/
├── frontend/          (your React build)
├── NewBackend/        (your PHP GraphQL backend)
└── .htaccess         (if needed for routing)
```

### 4. Set Up Database

1. Create a new MySQL database in your hosting control panel
2. Import your database schema and data
3. Update the remote database credentials in `Database.php` (lines 16-20)

### 5. Build Frontend for Production

Run these commands in your local frontend directory:

```bash
cd frontend
npm run build
```

Upload the `dist` folder contents to your server.

### 6. Update Database Credentials

In `NewBackend/fullstack-test-starter/src/Database.php`, update lines 16-20:

```php
$host = 'your-database-host';
$db = 'your-database-name';
$user = 'your-database-username';
$pass = 'your-database-password';
```

### 7. Test Your Deployment

1. Visit your site: `https://yoursite.000webhostapp.com`
2. Test the GraphQL endpoint: `https://yoursite.000webhostapp.com/NewBackend/fullstack-test-starter/public/graphql`
3. Run the Auto QA test: http://165.227.98.170/

### 8. Submit to Scandiweb

Include in your email:

- Repository URL: https://github.com/LaurisCvetkovsDev/scandiFinal
- Live site URL: https://yoursite.000webhostapp.com
- Screenshot of passed Auto QA test

## Current Status

✅ Backend: Working GraphQL API with product listing
✅ Frontend: React app with product grid and cart
✅ Database: Working with 8 products
⚠️ Still needed: Polymorphic models, PDP, cart overlay, order mutations

## Need Help?

If you encounter issues, check:

1. PHP version (needs 7.4+)
2. Database connection credentials
3. File permissions (755 for directories, 644 for files)
4. Error logs in your hosting control panel
