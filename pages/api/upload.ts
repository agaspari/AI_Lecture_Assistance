import type { NextApiRequest, NextApiResponse } from 'next';
import formidable, { File } from 'formidable';
import path from 'path';

export const config = { api: { bodyParser: false } };

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const uploadDir = path.join(process.cwd(), 'uploads');
    const form = formidable({
        uploadDir,
        keepExtensions: true,
        filename: (name, ext, part: File) => {
            // Use the original filename, sanitized for filesystem safety
            const original = part.originalFilename || name;
            return original.replace(/[^a-zA-Z0-9._-]/g, '_');
        },
    });

    form.parse(req, (err, fields, files) => {
        if (err) return res.status(500).json({ error: err.message });
        // Flatten files and return relative paths
        const fileArray = Object.values(files)
            .flat()
            .map((f: any) => ({
                filepath: path.relative(process.cwd(), f.filepath),
                originalFilename: f.originalFilename,
            }));
        res.status(200).json({ files: fileArray });
    });
}