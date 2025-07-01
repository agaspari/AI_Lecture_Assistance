export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function POST(request: Request) {
    try {
        // Parse multipart form data from the Request
        const formData = await request.formData()
        const files = formData.getAll('file')

        // Ensure uploads directory exists
        const uploadDir = path.join(process.cwd(), 'uploads')
        await fs.promises.mkdir(uploadDir, { recursive: true })

        const uploaded: { filepath: string; originalFilename: string }[] = []

        for (const fileItem of files) {
            if (!(fileItem instanceof Blob)) continue
            const arrayBuffer = await fileItem.arrayBuffer()
            const buffer = Buffer.from(arrayBuffer)
            const originalFilename = (fileItem as any).name || 'file'
            const safeName = originalFilename.replace(/[^a-zA-Z0-9._-]/g, '_')
            const fullPath = path.join(uploadDir, safeName)
            await fs.promises.writeFile(fullPath, buffer)
            uploaded.push({
                filepath: path.relative(process.cwd(), fullPath),
                originalFilename,
            })
        }

        return NextResponse.json({ files: uploaded })
    } catch (err: any) {
        console.error('Upload handler error:', err)
        return NextResponse.json({ error: err.message || 'Unknown error' }, { status: 500 })
    }
}

export async function GET() {
    return NextResponse.json({ ok: true, endpoint: '/api/upload' })
}
