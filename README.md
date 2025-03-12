# E-Commerce Platform

This project is a full-stack e-commerce application with a modern React frontend and PHP backend. It uses GraphQL for efficient data fetching and Docker for containerization.

## Architecture Overview

The application is built with:

- **Frontend**: React 19, TypeScript, Apollo Client, TailwindCSS
- **Backend**: PHP 8.1, Custom MVC framework, GraphQL PHP
- **Database**: MySQL
- **Containerization**: Docker and Docker Compose
- **Web Server**: Nginx

## Features

### Frontend
- Responsive product catalog with category filtering
- Detailed product pages with image gallery and attribute selection
- Shopping cart with persistent storage (sessionStorage)
- Checkout process with order submission

### Backend
- Custom lightweight MVC PHP framework
- GraphQL API for efficient data fetching
- Data models with relationships (Products, Categories, Attributes, Orders)
- MySQL database integration

## Project Structure

```
├── backend/                  # PHP backend
│   ├── app/                  # Application code
│   │   ├── Models/           # Data models
│   │   ├── Graphql/          # GraphQL resolvers
│   │   ├── Relations/        # ORM relationship handlers
│   ├── config/               # Configuration files
│   ├── graphql/              # GraphQL schema definition
│   └── public/               # Public entry point
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/       # UI components
│   │   ├── context/          # React context providers
│   │   ├── graphql/          # GraphQL queries and mutations
│   │   ├── pages/            # Page components
│   │   └── types/            # TypeScript type definitions
├── php/                      # PHP Docker configuration
├── nginx/                    # Nginx Docker configuration
└── docker-compose.yml        # Docker Compose configuration
```

## Getting Started

### Prerequisites

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Installation

1. Create a directory and clone the repository inside it:
   ```bash
   mkdir scandiweb-test
   cd scandiweb-test
   git clone https://github.com/darkosakaliev/scandiweb-test.git .
   ```

2. Start the Docker containers:
   ```bash
   docker-compose up -d
   ```

3. The application will be available at:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8080/graphql
   - PHPMyAdmin: http://localhost:8081

## Development Workflow

One of the benefits of the Docker setup is that everything runs automatically:

- The frontend Node.js container installs dependencies and starts the development server
- The PHP container installs Composer dependencies automatically
- Code changes in both frontend and backend are detected automatically with mounted volumes

You can simply edit the code files, and the changes will be reflected immediately without any manual restart or build steps.

## Database

The database is automatically set up with sample data using the `ecommerce-data.sql` file when the containers start. You can access PHPMyAdmin at http://localhost:8081 to manage the database.

## GraphQL API

The GraphQL API is available at http://localhost:8080/graphql. The main queries and mutations are:

- `categories`: Get all product categories
- `category(id)`: Get a specific category with its products
- `products`: Get all products
- `product(id)`: Get a specific product with details
- `placeOrder`: Submit an order

## Key Features Implementation

### Shopping Cart

The shopping cart functionality is implemented using React Context API, allowing the cart state to be accessible throughout the application. The cart data is persisted in the browser's sessionStorage.

### Product Attributes

Products can have multiple attributes (like size, color) with different display types:
- Text attributes (displayed as buttons)
- Swatch attributes (displayed as color swatches)

### Order Processing

When a user places an order:
1. The cart items are formatted into the expected GraphQL mutation format
2. The order is submitted to the backend via the `placeOrder` mutation
3. Upon success, the cart is cleared and a confirmation is displayed
