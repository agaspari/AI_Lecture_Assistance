'use client';

import { Sidebar } from "@/components/Sidebar";
import { ReactNode } from "react";
import { useSession } from "next-auth/react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
    const { data: session } = useSession();

    if (!session) return null;

    const role = session.user.role === 'teacher' ? 'teacher' : 'student';
    return (
        <div className="flex h-screen">
            <Sidebar role={role} />
            <main className="flex-1 overflow-auto">{children}</main>
        </div>
    )
}