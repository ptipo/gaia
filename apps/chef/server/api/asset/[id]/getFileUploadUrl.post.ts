import { ObjectCannedACL, PutObjectCommand, type PutObjectCommandInput, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { createId } from '@paralleldrive/cuid2';
import { z } from 'zod';

const SUPPORTED_MIME_TYPES = ['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp', 'image/gif'];

export default eventHandler(async (event) => {
    const data = await readBody(event);
    const schema = z.object({
        contentType: z.union(
            SUPPORTED_MIME_TYPES.map((type) => z.literal(type)) as unknown as readonly [
                z.ZodLiteral<string>,
                z.ZodLiteral<string>,
                ...z.ZodLiteral<string>[]
            ]
        ),
    });

    const parsed = schema.safeParse(data);
    if (!parsed.success) {
        throw createError({
            message: 'Invalid input',
            statusCode: 400,
        });
    }

    const { contentType } = parsed.data;

    const id = getRouterParam(event, 'id');
    const asset = await event.context.db.asset.findUnique({ where: { id }, include: { app: true } });
    if (!asset) {
        throw createError({
            message: 'Asset not found',
            statusCode: 404,
        });
    }

    const { publishBucket } = useRuntimeConfig();
    const filePath = `assets/${asset.id}/files/${createId()}`;

    const s3 = new S3Client();
    console.log('Calculating pre-signed upload url:', publishBucket, filePath, contentType);
    const params: PutObjectCommandInput = {
        Bucket: publishBucket,
        Key: filePath,
        ContentType: contentType,
    };

    const uploadUrl = await getSignedUrl(s3, new PutObjectCommand(params));
    return { success: true, data: { uploadUrl } };
});
