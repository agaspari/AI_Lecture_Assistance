import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import mammoth from 'mammoth';
import pdfParse from 'pdf-parse';
import { OpenAI } from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const { systemPrompt, documents, messages } = req.body as {
            systemPrompt: string;
            documents: { filepath: string; originalFilename: string }[];
            messages: { role: string; content: string }[];
        };

        const fileMessages: { role: 'system'; content: string }[] = [];

        for (const doc of documents) {
            const ext = path.extname(doc.filepath).toLowerCase();
            const fullPath = path.join(process.cwd(), doc.filepath);

            try {
                if (ext === '.pdf') {
                    // --- PDF via pdf-parse ---
                    const dataBuffer = fs.readFileSync(fullPath);
                    const pdfData = await pdfParse(dataBuffer);
                    // Split on form-feed to get pages
                    const pages = pdfData.text.split(/\f/);
                    pages.forEach((text, idx) => {
                        const snippet = text.slice(0, 2000); // tune as needed
                        fileMessages.push({
                            role: 'system',
                            content: `--- ${doc.originalFilename}, page ${idx + 1} ---\n${snippet}`,
                        });
                    });

                } else if (ext === '.docx') {
                    // --- DOCX via Mammoth ---
                    const { value: text } = await mammoth.extractRawText({
                        path: fullPath,
                    });
                    const snippet = text.slice(0, 5000);
                    fileMessages.push({
                        role: 'system',
                        content: `--- ${doc.originalFilename} (full text) ---\n${snippet}`,
                    });

                } else {
                    // --- Fallback: plain text ---
                    const text = fs.readFileSync(fullPath, 'utf-8');
                    const snippet = text.slice(0, 5000);
                    fileMessages.push({
                        role: 'system',
                        content: `--- ${doc.originalFilename} ---\n${snippet}`,
                    });
                }

            } catch (fileErr: any) {
                console.error(`Error parsing ${doc.filepath}:`, fileErr);
                fileMessages.push({
                    role: 'system',
                    content: `--- Could not load ${doc.originalFilename} ---`,
                });
            }
        }

        // Build the full message list
        const fullMessages = [
            { role: 'system', content: systemPrompt },
            ...fileMessages,
            ...messages,
        ];

        // Call the Chat API
        const chat = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: fullMessages,
        });

        res.status(200).json(chat.choices[0].message);

    } catch (err: any) {
        console.error('Chat handler error:', err);
        res.status(500).json({ error: err.message || 'Unknown error' });
    }
}