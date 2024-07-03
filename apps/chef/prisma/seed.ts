import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
    const admin = await prisma.user.upsert({
        where: { email: 'admin@ptmind.com' },
        create: {
            email: 'admin@ptmind.com',
            password:
                '$argon2id$v=19$m=19456,t=2,p=1$gS697qP+OZgDEgNXYy0H7g$uwg3os+EPmsfjpw2mZ2jw/YeALcBmYViefQ1CrNeGvI',
        },
        update: {},
    });

    const app = await prisma.app.upsert({
        where: { name: 'SupaForm' },
        create: {
            name: 'SupaForm',
            owner: { connect: { id: admin.id } },
            bundle: '@hayadev/supa-form',
            htmlTagName: 'pt-form',
        },
        update: {},
    });

    console.log(app);
}
main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
