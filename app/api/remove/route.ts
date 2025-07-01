import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

export const runtime = 'nodejs'

export async function POST(request: Request) {
    try {
        const { filepath } = (await request.json()) as { filepath: string }

        const fullPath = path.join(process.cwd(), filepath)

        await fs.unlink(fullPath)

        return NextResponse.json({ removed: filepath })
    } catch (err: any) {
        console.error('Remove error:', err)
        return NextResponse.json(
            { error: err.message || 'Unknown error' },
            { status: 500 }
        )
    }
}

export async function GET() {
    return NextResponse.json({ ok: true, endpoint: '/api/remote' })
}
