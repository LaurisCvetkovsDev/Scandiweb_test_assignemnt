# Scandinavian E-commerce Project

A modern e-commerce application built with React frontend and PHP GraphQL backend.

## Features

- 🛍️ Product browsing by category (All, Clothes, Tech)
- 🛒 Shopping cart with add/remove/quantity controls
- 📱 Responsive design with clean UI
- 🎯 Product details with attribute selection
- 💳 Order placement functionality
- ✅ Out of stock item handling
- 🧪 Test-compliant implementation

## Tech Stack

**Frontend:**

- React + TypeScript
- Vite (build tool)
- Zustand (state management)
- React Router (navigation)

**Backend:**

- PHP with GraphQL
- MySQL database
- WAMP server

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd scandiFinal
```

### 2. Backend Setup

#### Database Configuration

1. Copy the database template:

   ```bash
   cp Backend/Database.example.php Backend/Database.php
   ```

2. Update `Backend/Database.php` with your database credentials:

   ```php
   $host = 'localhost';        // Your database host
   $db = 'pruductdb';          // Your database name
   $user = 'root';             // Your database username
   $pass = 'your_password';    // Your database password
   ```

3. Create the database and import the schema (if available)

#### WAMP Server

1. Start your WAMP server
2. Place the project in your `www` directory
3. Access the GraphQL endpoint: `http://localhost/scandiFinal/NewBackend/working_graphql.php`

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`

## Project Structure

```
scandiFinal/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── store/          # Zustand store
│   │   └── types/          # TypeScript types
│   └── package.json
├── Backend/                 # PHP backend
│   ├── config/             # Configuration files (ignored)
│   ├── Database.example.php # Database config template
│   └── Database.php        # Database config (ignored)
├── NewBackend/             # GraphQL backend
└── .gitignore              # Git ignore rules
```

## Configuration Files

⚠️ **Important:** Configuration files containing sensitive data are ignored by git:

- `Backend/Database.php` - Database credentials
- `Backend/config/` - Configuration directory
- `*.env` files - Environment variables

Use the `.example` files as templates for your local configuration.

## Development

1. Start WAMP server
2. Run frontend: `npm run dev` (in frontend directory)
3. Backend runs on WAMP at: `http://localhost/scandiFinal/NewBackend/working_graphql.php`

## Testing

The application includes test-compliant features:

- Data-testid attributes for automated testing
- GraphQL mutations for order placement
- Proper state management
- Error handling

## Contributing

1. Copy configuration templates
2. Set up your local database
3. Follow the existing code style
4. Test your changes thoroughly
