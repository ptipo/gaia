import type { Asset, App } from '@prisma/client';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { z } from 'zod';
import pageTemplate from '../../res/page-template.html';

export default eventHandler(async (event) => {
    const data = await readBody(event);
    const schema = z.object({
        id: z.string(),
    });

    const parsed = schema.safeParse(data);
    if (!parsed.success) {
        throw createError({
            message: 'Invalid publish input',
            statusCode: 400,
        });
    }

    const { id } = parsed.data;
    const asset = await event.context.db.asset.findUnique({ where: { id }, include: { app: true } });
    if (!asset) {
        throw createError({
            message: 'Asset not found',
            statusCode: 404,
        });
    }

    const pageContent = makePageContent(asset);
    const { publishPageBucket, publishPagePath, publishConfigPath, public: publicConfig } = useRuntimeConfig();
    console.log('Publishing to:', publishPageBucket, publishPagePath, publicConfig.publishPageAccessPoint);

    const s3 = new S3Client();
    const htmlParams = {
        Bucket: publishPageBucket,
        Key: `${publishPagePath}/${asset.id}/index.html`,
        Body: pageContent,
        ContentType: 'text/html',
    };
    const command = new PutObjectCommand(htmlParams);

    let result = await s3.send(command);
    console.log('html uploaded:', result);

    const configParams = {
        Bucket: publishPageBucket,
        Key: `${publishConfigPath}/${asset.id}/${asset.appVersion}/config.json`,
        Body: JSON.stringify(asset.config),
        ContentType: 'application/json',
    };

    result = await s3.send(new PutObjectCommand(configParams));
    console.log('config uploaded:', result);

    const publishUrl = `${publicConfig.publishPageAccessPoint}/${asset.id}`;
    await event.context.db.asset.update({ where: { id }, data: { publishUrl } });

    return { success: true, data: { url: publishUrl } };
});

function makePageContent(asset: Asset & { app: App }) {
    const result = pageTemplate
        .replaceAll('{{title}}', asset.name)
        .replaceAll('{{bundle}}', getAppBundle(asset.app.bundle))
        .replaceAll('{{tagName}}', asset.app.htmlTagName)
        .replaceAll('{{config}}', escapeHtml(JSON.stringify(asset.config)));
    return result;
}

function getAppBundle(bundle: string) {
    if (URL.canParse(bundle)) {
        return bundle;
    } else {
        return `https://unpkg.com/${bundle}@latest/dist/index.js`;
    }
}

function escapeHtml(unsafe: string): string {
    const escapeMap: { [key: string]: string } = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
    };

    return unsafe.replace(/[&<>"']/g, (match) => escapeMap[match]);
}
