
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

export const runtime = 'nodejs'

const prisma = new PrismaClient()

export async function POST(request: Request) {
    try {
        const { name, email, password, role } = await request.json() as {
            name: string
            email: string
            password: string
            role: string
        }

        if (!name || !email || !password || !role) {
            return NextResponse.json(
                { message: 'Missing required fields' },
                { status: 400 }
            );
        }

        const existing = await prisma.user.findUnique({ where: { email } })
        if (existing) {
            return NextResponse.json(
                { message: 'Email already registered' },
                { status: 409 }
            );
        }

        const hashed = await bcrypt.hash(password, 10)
        await prisma.user.create({ data: { name, email, password: hashed, role } })

        return NextResponse.json(
            { message: 'User registered successfully' },
            { status: 201 }
        );
    } catch (err: any) {
        console.error('[REGISTER ERROR]', err)
        return NextResponse.json(
            { message: 'Something went wrong' },
            { status: 500 }
        )
    }
}

export async function GET() {
    return NextResponse.json({ ok: true, endpoint: '/api/register' })
}
