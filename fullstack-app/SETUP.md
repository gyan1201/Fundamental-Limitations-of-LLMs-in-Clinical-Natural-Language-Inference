# Setup Guide

This guide will help you get the FullStack Blog Application up and running on your local machine.

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database (local or cloud)
- npm or yarn package manager

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Environment Configuration

1. Copy the `.env.example` file to `.env`:
```bash
cp .env.example .env
```

2. Update the `.env` file with your database credentials:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/fullstack_app"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

**Important Notes:**
- Replace `username`, `password`, and `localhost:5432` with your actual database details
- Generate a secure `NEXTAUTH_SECRET` (you can use `openssl rand -base64 32`)
- The `NEXTAUTH_URL` should match your local development URL

## Step 3: Database Setup

### Option A: Local PostgreSQL

1. Install PostgreSQL on your machine
2. Create a new database:
```sql
CREATE DATABASE fullstack_app;
```

### Option B: Cloud Database (Recommended for beginners)

Use a free cloud database service:

- **Supabase** (Free tier available)
- **PlanetScale** (Free tier available)
- **Neon** (Free tier available)

## Step 4: Database Migration

1. Generate Prisma client:
```bash
npm run db:generate
```

2. Run database migrations:
```bash
npm run db:migrate
```

3. (Optional) Seed the database with sample data:
```bash
npm run db:seed
```

## Step 5: Start the Application

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Step 6: Test the Application

### Test Accounts (if seeded)
- **Admin**: admin@example.com / admin123
- **User**: user@example.com / user123

### Features to Test
1. **User Registration**: Visit `/auth/signup`
2. **User Login**: Visit `/auth/signin`
3. **Create Posts**: After logging in, visit `/create-post`
4. **View Posts**: Visit `/posts`
5. **Add Comments**: View any post and add comments

## Troubleshooting

### Common Issues

#### 1. Database Connection Error
```
Error: P1001: Can't reach database server
```
**Solution**: Ensure your PostgreSQL server is running and the connection string is correct.

#### 2. Prisma Client Error
```
Error: PrismaClient is not generated
```
**Solution**: Run `npm run db:generate`

#### 3. Migration Errors
```
Error: Migration failed
```
**Solution**: Check your database connection and ensure you have the correct permissions.

#### 4. NextAuth Configuration Error
```
Error: Invalid NextAuth configuration
```
**Solution**: Verify your `.env` file has all required variables.

### Database Commands

```bash
# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Reset database (development only)
npm run db:reset

# Open Prisma Studio (database GUI)
npm run db:studio

# Seed database
npm run db:seed
```

### Development Tips

1. **Use Prisma Studio**: Run `npm run db:studio` to view and edit your database through a web interface.

2. **Check Logs**: Monitor the console for any error messages during development.

3. **Database Changes**: After modifying the Prisma schema, run `npm run db:migrate` to apply changes.

4. **Environment Variables**: Always restart your development server after changing environment variables.

## Next Steps

Once the application is running:

1. **Customize the UI**: Modify components in `src/components/`
2. **Add Features**: Create new API routes in `src/app/api/`
3. **Style Changes**: Update Tailwind classes or add custom CSS
4. **Database Schema**: Modify `prisma/schema.prisma` and run migrations

## Deployment

When ready to deploy:

1. **Build the application**: `npm run build`
2. **Set production environment variables**
3. **Deploy to your preferred platform** (Vercel, Netlify, etc.)
4. **Set up production database**

## Support

If you encounter issues:

1. Check the console for error messages
2. Verify your environment variables
3. Ensure your database is accessible
4. Check the [Next.js documentation](https://nextjs.org/docs)
5. Check the [Prisma documentation](https://www.prisma.io/docs)

---

Happy coding! 🚀