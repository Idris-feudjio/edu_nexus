// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

// initialize Prisma Client
const prisma = new PrismaClient(); 
const main = async () => {
    // Create a new user
    const user = await prisma.user.upsert({
        where: {email: "jupitorobust1@gmail.com"}, 
            update: {},
        create: { 
            email: "jupitorobust1@gmail.com", 
            firstName: "Jupito2",
            lastName: "Robust2",
            role: "ADMIN",  
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    })
    console.log(user);

    // Create a new user
    const user2 = await prisma.user.upsert({
        where: {    
            email: "mondodaniel7@gmail.com"   ,
        },  
        update: {    
        },
        create: { 
            email: "mondodaniel7@gmail.com",
            firstName: "Mondo",
            lastName: "Daniel",
            role: "TEACHER",
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),

        },
    }
        )
    console.log(user2);
    const user3 = await prisma.user.upsert({
        where: {    
            email: "ndombichristele@gmail.com",
        },
        update: {},
        create: { 
            email: "ndombichristele@gmail.com",
            firstName: "Ndombi",
            lastName: "Christele",
            role: "STUDENT",
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    })
    console.log(user3);

        const user4 = await prisma.user.upsert({
        where: {    
            email: "idrisfeudjio8@gmail.com",
        },
        update: {},
        create: { 
            email: "idrisfeudjio8@gmail.com",
            firstName: "Idris",
            lastName: "Feudjio",
            role: "ADMIN",
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    })
    console.log(user4);
}

main()
.catch(e => {
    console.error(e);
    process.exit(1);
})
.finally(async () => {
    await prisma.$disconnect();
});

 export default main;
// This script seeds the database with initial data using Prisma Client.
// It creates or updates users with specific roles and attributes.
// Make sure to run this script with `npx prisma db seed` or similar command.
// Adjust the user data as needed for your application.
// Ensure that the Prisma Client is properly configured in your project.



