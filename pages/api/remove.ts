import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const { filepath } = req.body as { filepath: string };
    // Resolve against the project root
    const fullPath = path.join(process.cwd(), filepath);

    fs.unlink(fullPath, (err) => {
        if (err) {
            console.error('Remove error:', err);
            return res.status(500).json({ error: err.message });
        }
        return res.status(200).json({ removed: filepath });
    });
}