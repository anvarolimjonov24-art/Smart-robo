import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    console.log('Starting seed...')

    // Create default admin user
    const user = await prisma.user.upsert({
        where: { email: 'admin@smart-robo.uz' },
        update: {},
        create: {
            email: 'admin@smart-robo.uz',
            password: 'admin_password_123', // In production, this would be hashed
            name: 'Admin',
        },
    })

    // Create default store
    const store = await prisma.store.upsert({
        where: { slug: 'smart-robo' },
        update: {},
        create: {
            name: 'Smart Robo Store',
            slug: 'smart-robo',
            ownerId: user.id,
            botToken: process.env.TELEGRAM_BOT_TOKEN || '8578256137:AAHZ89cc4wiMLnsZKMuU99BgusoQYCm0AG0',
        },
    })

    // Create default category
    const category = await prisma.category.create({
        data: {
            name: 'Smart Gadgetlar',
            storeId: store.id,
        },
    })

    // Create products
    await prisma.product.createMany({
        data: [
            {
                name: 'Smart Robot Cleaner',
                description: 'Eng aqlli va tezkor tozalagich',
                price: 3500000,
                storeId: store.id,
                categoryId: category.id,
                isActive: true,
                image: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=300'
            },
            {
                name: 'Robot Arm Pro',
                description: 'Professional robot qo\'li',
                price: 7200000,
                storeId: store.id,
                categoryId: category.id,
                isActive: true,
                image: 'https://images.unsplash.com/photo-1546776310-eef45dd6d63c?w=300'
            }
        ]
    })

    console.log('Seed completed successfully!')
}

main()
    .catch((e) => {
        console.error('Seed error:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
