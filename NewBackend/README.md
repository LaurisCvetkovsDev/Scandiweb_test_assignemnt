# GraphQL E-Shop Backend

This is a GraphQL-based backend for an e-commerce application that provides read-only access to product data.

## Setup

1. **Database**: Ensure your MySQL database `pruductdb` is running on localhost with the existing data
2. **Dependencies**: Dependencies are already installed via composer
3. **Web Server**: Ensure WAMP/XAMPP is running

## Testing the GraphQL API

### Base URL

```
http://localhost/scandiFinal/NewBackend/fullstack-test-starter/public/graphql
```

### Available Queries

#### 1. Get All Products

```graphql
{
  products {
    id
    name
    description
    inStock
    category {
      id
      name
    }
    prices {
      currencyLabel
      currencySymbol
      amount
    }
    gallery {
      url
    }
    attributes {
      name
      type
      items {
        id
        value
        displayValue
      }
    }
  }
}
```

#### 2. Get Single Product by ID

```graphql
{
  product(id: "your-product-id") {
    id
    name
    description
    inStock
    category {
      id
      name
    }
    prices {
      currencyLabel
      currencySymbol
      amount
    }
    gallery {
      url
    }
    attributes {
      name
      type
      items {
        id
        value
        displayValue
      }
    }
  }
}
```

#### 3. Get Products by Category

```graphql
{
  productsByCategory(category: "tech") {
    id
    name
    inStock
    category {
      name
    }
    prices {
      currencyLabel
      currencySymbol
      amount
    }
  }
}
```

Available categories: `"all"`, `"tech"`, `"clothes"`

## Testing Methods

### Method 1: Using cURL

```bash
curl -X POST http://localhost/scandiFinal/NewBackend/fullstack-test-starter/public/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "{ products { id name inStock category { name } } }"}'
```

### Method 2: Using Postman

1. Create a new POST request
2. URL: `http://localhost/scandiFinal/NewBackend/fullstack-test-starter/public/graphql`
3. Headers: `Content-Type: application/json`
4. Body (raw JSON):

```json
{
  "query": "{ products { id name inStock category { name } } }"
}
```

### Method 3: Using the Test Script

```bash
php NewBackend/fullstack-test-starter/test_graphql.php
```

## Frontend Integration

To connect your React frontend to this GraphQL backend, update your services to point to:

```
http://localhost/scandiFinal/NewBackend/fullstack-test-starter/public/graphql
```

Example fetch request:

```javascript
const response = await fetch(
  "http://localhost/scandiFinal/NewBackend/fullstack-test-starter/public/graphql",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `
      {
        productsByCategory(category: "tech") {
          id
          name
          inStock
          category {
            name
          }
          prices {
            currencyLabel
            currencySymbol
            amount
          }
          gallery {
            url
          }
        }
      }
    `,
    }),
  }
);

const data = await response.json();
```

## Troubleshooting

1. **404 Error**: Ensure your web server is running and the path is correct
2. **Database Connection Error**: Check that MySQL is running and the database `pruductdb` exists
3. **PHP Errors**: Check your PHP error logs in WAMP/XAMPP
4. **GraphQL Syntax Errors**: Validate your GraphQL queries using a GraphQL validator
