'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';

export function Header() {
    const { data: session } = useSession();

    if (!session) return null;

    return (
        <header className="w-full flex items-center justify-between p-4 border-b bg-white shadow-sm">
            <Link href="/">
                <h1 className="text-xl font-bold">Understandly</h1>
            </Link>
            <div className="flex items-center gap-4">
                <span>Welcome, {session.user?.name || session.user?.email}</span>
                <button
                    className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
                    onClick={() => signOut({ callbackUrl: '/login' })}
                >
                    Logout
                </button>
            </div>
        </header>
    );
}
