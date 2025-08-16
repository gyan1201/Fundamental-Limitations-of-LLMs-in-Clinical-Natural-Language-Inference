import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { name: 'Technology' },
      update: {},
      create: { name: 'Technology' },
    }),
    prisma.category.upsert({
      where: { name: 'Programming' },
      update: {},
      create: { name: 'Programming' },
    }),
    prisma.category.upsert({
      where: { name: 'Web Development' },
      update: {},
      create: { name: 'Web Development' },
    }),
    prisma.category.upsert({
      where: { name: 'Design' },
      update: {},
      create: { name: 'Design' },
    }),
  ])

  console.log('✅ Categories created:', categories.length)

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12)
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
    },
  })

  console.log('✅ Admin user created:', adminUser.email)

  // Create regular user
  const userPassword = await bcrypt.hash('user123', 12)
  const regularUser = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      name: 'Regular User',
      password: userPassword,
      role: 'USER',
    },
  })

  console.log('✅ Regular user created:', regularUser.email)

  // Create sample posts
  const posts = await Promise.all([
    prisma.post.create({
      data: {
        title: 'Welcome to Our Blog Platform',
        content: `This is our first blog post! We're excited to share our journey in building this platform.

Our platform is built with modern technologies including:
- Next.js 13 with App Router
- TypeScript for type safety
- Tailwind CSS for styling
- Prisma for database management
- NextAuth.js for authentication

We hope you enjoy using this platform as much as we enjoyed building it!`,
        published: true,
        authorId: adminUser.id,
        categoryId: categories[0].id, // Technology
      },
    }),
    prisma.post.create({
      data: {
        title: 'Getting Started with Next.js 13',
        content: `Next.js 13 introduces the new App Router, which provides a more intuitive way to build applications.

Key features include:
- File-based routing with the app directory
- Server Components by default
- Improved performance with React 18
- Better developer experience

In this post, we'll explore how to get started with Next.js 13 and build modern web applications.`,
        published: true,
        authorId: regularUser.id,
        categoryId: categories[1].id, // Programming
      },
    }),
    prisma.post.create({
      data: {
        title: 'The Power of TypeScript in Modern Development',
        content: `TypeScript has revolutionized how we write JavaScript applications. It provides:

- Static type checking
- Better IDE support
- Early error detection
- Improved code documentation
- Enhanced refactoring capabilities

Let's dive deep into how TypeScript can improve your development workflow and code quality.`,
        published: true,
        authorId: adminUser.id,
        categoryId: categories[2].id, // Web Development
      },
    }),
  ])

  console.log('✅ Sample posts created:', posts.length)

  // Create sample comments
  const comments = await Promise.all([
    prisma.comment.create({
      data: {
        content: 'Great introduction! Looking forward to more content.',
        authorId: regularUser.id,
        postId: posts[0].id,
      },
    }),
    prisma.comment.create({
      data: {
        content: 'This platform looks amazing! The UI is so clean and modern.',
        authorId: adminUser.id,
        postId: posts[0].id,
      },
    }),
    prisma.comment.create({
      data: {
        content: 'Next.js 13 is indeed a game-changer. The App Router is much more intuitive.',
        authorId: adminUser.id,
        postId: posts[1].id,
      },
    }),
  ])

  console.log('✅ Sample comments created:', comments.length)

  console.log('🎉 Database seeding completed successfully!')
  console.log('\n📝 Sample Data Created:')
  console.log(`- ${categories.length} categories`)
  console.log(`- ${posts.length} posts`)
  console.log(`- ${comments.length} comments`)
  console.log('\n🔑 Test Accounts:')
  console.log('Admin: admin@example.com / admin123')
  console.log('User: user@example.com / user123')
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })