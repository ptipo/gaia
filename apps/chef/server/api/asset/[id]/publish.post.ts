import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import type { App, Asset } from '@prisma/client';
import pageTemplate from '~/res/page-template.html';

export default eventHandler(async (event) => {
    const id = getRouterParam(event, 'id');
    const asset = await event.context.db.asset.findUnique({ where: { id }, include: { app: true } });
    if (!asset) {
        throw createError({
            message: 'Asset not found',
            statusCode: 404,
        });
    }

    const pageContent = makePageContent(asset);
    const { publishBucket, publishPagePath, public: publicConfig } = useRuntimeConfig();
    console.log('Publishing to:', publishBucket, publishPagePath, publicConfig.publishAccessPoint);

    const assetBasePath = `assets/${asset.id}/latest`;

    const s3 = new S3Client();
    const assetPagePath = `${assetBasePath}/index.html`;

    const htmlParams = {
        Bucket: publishBucket,
        Key: assetPagePath,
        Body: pageContent,
        ContentType: 'text/html',
    };
    const command = new PutObjectCommand(htmlParams);

    let result = await s3.send(command);
    console.log('html uploaded:', result);

    const configParams = {
        Bucket: publishBucket,
        Key: `${assetBasePath}/config.json`,
        Body: JSON.stringify(asset.config),
        ContentType: 'application/json',
    };

    result = await s3.send(new PutObjectCommand(configParams));
    console.log('config uploaded:', result);

    const publishUrl = `${publicConfig.publishAccessPoint}/${assetPagePath}`;
    await event.context.db.asset.update({ where: { id }, data: { publishUrl } });

    return { success: true, data: { url: publishUrl } };
});

function makePageContent(asset: Asset & { app: App }) {
    const result = pageTemplate
        .replaceAll('{{title}}', asset.name)
        .replaceAll('{{bundle}}', getAppBundle(asset.app.bundle, asset.appVersion || 'latest'))
        .replaceAll('{{tagName}}', asset.app.htmlTagName)
        .replaceAll('{{config}}', escapeHtml(JSON.stringify(asset.config)));
    return result;
}

function getAppBundle(bundle: string, version: string) {
    if (URL.canParse(bundle)) {
        return bundle;
    } else {
        return `https://compnpmcache.ptengine.com/${bundle}@${version}/dist/index.js`;
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
