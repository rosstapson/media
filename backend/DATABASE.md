# Database Setup Guide

## Prerequisites
- PostgreSQL installed and running on your local machine
- Database created (default name: `media_player`)

## Configuration

1. Copy the `.env.example` file to `.env`:
   ```powershell
   copy .env.example .env
   ```

2. Update the `.env` file with your database credentials:
   ```
   DATABASE_URL=postgres://your_username:your_password@localhost:5432/your_database_name
   ```

## Database Schema

The application uses Drizzle ORM with the following schema:

### Users Table
- `id` - Serial primary key
- `email` - Unique email address (varchar 255)
- `password` - Hashed password (text)
- `username` - Unique username (varchar 100)
- `first_name` - First name (varchar 100)
- `last_name` - Last name (varchar 100)
- `is_active` - Account active status (boolean, default: true)
- `email_verified` - Email verification status (boolean, default: false)
- `created_at` - Timestamp of account creation
- `updated_at` - Timestamp of last update
- `last_login_at` - Timestamp of last login

## Database Commands

### Generate Migration Files
Creates SQL migration files based on your schema:
```powershell
yarn db:generate
```

### Push Schema to Database
Directly push schema changes to database (good for development):
```powershell
yarn db:push
```

### Run Migrations
Execute pending migrations:
```powershell
yarn db:migrate
```

### Open Drizzle Studio
Launch the visual database browser:
```powershell
yarn db:studio
```

### Seed Database
Create an admin user (idempotent - safe to run multiple times):
```powershell
yarn db:seed
```

This creates an admin user with the credentials from your `.env` file:
- Email: `ADMIN_EMAIL` (default: admin@media-player.com)
- Username: `ADMIN_USERNAME` (default: admin)
- Password: `ADMIN_PASSWORD` (default: admin123)

The seed script is idempotent - it will skip creation if the user already exists.

## Getting Started

1. Ensure PostgreSQL is running
2. Create a database (e.g., `media_player`)
3. Update your `.env` file with the correct connection string
4. Push the schema to your database:
   ```powershell
   yarn db:push
   ```

Or generate and run migrations:
```powershell
yarn db:generate
yarn db:migrate
```

## Using the Database in Your Code

Import the database connection and schema:

```javascript
const { db } = require('./db/connection');
const { users } = require('./db/schema');

// Example: Query all users
const allUsers = await db.select().from(users);

// Example: Insert a new user
const newUser = await db.insert(users).values({
  email: 'user@example.com',
  password: 'hashed_password_here',
  username: 'johndoe',
  firstName: 'John',
  lastName: 'Doe'
}).returning();
```

## Troubleshooting

### Connection Issues
- Ensure PostgreSQL is running
- Verify your connection string in `.env`
- Check that the database exists
- Verify username and password are correct

### Migration Issues
- Delete the `drizzle` folder and regenerate migrations
- Ensure your schema file has no syntax errors
- Check that `drizzle.config.js` points to the correct schema file
