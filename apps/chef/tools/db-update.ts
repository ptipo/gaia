import { PrismaClient } from '@prisma/client';
import fs from 'fs';
const prisma = new PrismaClient();
async function main() {
    await updatePtCodeMode();
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

async function updatePtCodeMode() {
    // Read the content of the file
    const fileContent = fs.readFileSync('res/pt-code-mode.js', 'utf-8');

    try {
        await prisma.app.updateMany({
            where: {
                name: 'SupaForm',
            },
            data: {
                ptCodeMode: fileContent,
            },
        });

        console.log('successfully updated ptCodeMode for SupaForm');
    } catch (e) {
        console.error('Error updating field:', e);
    }
}
