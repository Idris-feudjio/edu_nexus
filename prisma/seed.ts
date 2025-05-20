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
            id: 8, 
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
             id: 5,
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
              id:34,
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
}

main()
.catch(e => {
    console.error(e);
    process.exit(1);
})
.finally(async () => {
    await prisma.$disconnect();
});

 
    main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
 


