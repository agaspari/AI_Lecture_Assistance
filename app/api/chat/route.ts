import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import mammoth from 'mammoth'
import pdfParse from 'pdf-parse'
import { OpenAI } from 'openai'

export const runtime = 'nodejs'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! })

export async function POST(request: Request) {
    try {
        const { systemPrompt, documents, messages } = await request.json() as {
            systemPrompt: string
            documents: { filepath: string; originalFilename: string }[]
            messages: { role: string; content: string }[]
        }

        const fileMessages: { role: 'system'; content: string }[] = []

        for (const doc of documents) {
            const ext = path.extname(doc.filepath).toLowerCase()
            const fullPath = path.join(process.cwd(), doc.filepath)

            if (ext === '.pdf') {
                const dataBuffer = fs.readFileSync(fullPath)
                const snippets: string[] = []
                await pdfParse(dataBuffer, {
                    pagerender: pageData =>
                        pageData.getTextContent().then(tc => {
                            snippets.push(tc.items.map((i: any) => i.str).join(' '))
                            return ''
                        }),
                })
                snippets.forEach((text, i) =>
                    fileMessages.push({
                        role: 'system',
                        content: `--- ${doc.originalFilename}, page ${i + 1} ---\n${text.slice(0, 5000)}`,
                    })
                )
            } else if (ext === '.docx') {
                const { value: text } = await mammoth.extractRawText({ path: fullPath })
                fileMessages.push({
                    role: 'system',
                    content: `--- ${doc.originalFilename} (full) ---\n${text.slice(0, 5000)}`,
                })
            } else {
                const text = fs.readFileSync(fullPath, 'utf-8')
                fileMessages.push({
                    role: 'system',
                    content: `--- ${doc.originalFilename} ---\n${text.slice(0, 5000)}`,
                })
            }
        }

        const fullMessages = [
            { role: 'system', content: systemPrompt },
            ...fileMessages,
            ...messages,
        ]

        const chat = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: fullMessages,
        })

        return NextResponse.json(chat.choices[0].message)
    } catch (err: any) {
        console.error('Chat handler error:', err)
        return NextResponse.json({ error: err.message || 'Unknown error' }, { status: 500 })
    }
}

export async function GET() {
    return NextResponse.json({ ok: true, endpoint: '/api/chat' })
}
