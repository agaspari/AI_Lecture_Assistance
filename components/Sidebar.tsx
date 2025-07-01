import { useState } from "react";
import Link from "next/link";
import { Menu, ChevronLeft } from "lucide-react";

interface SidebarProps {
    role: "teacher" | "student";
}

export function Sidebar({ role }: SidebarProps) {
    const [collapsed, setCollapsed] = useState(false);

    const menuItems = [
        { label: "Dashboard", href: "/dashboard" },
        { label: "Classes", href: "/classes" },
        { label: "Resources", href: "/resources" },
    ];

    return (
        <div className={`flex ${collapsed ? "w-[60px]" : "w-[220px]"} transition-all duration-300 h-screen bg-gray-900 text-white`}>
            <div className="flex flex-col w-full">
                <div className="flex items-center justify-between p-4 border-b border-gray-700">
                    <span className={`${collapsed ? "hidden" : "block"} font-bold text-lg`}>{role === "teacher" ? "Teacher" : "Student"}</span>
                    <button onClick={() => setCollapsed(!collapsed)}>
                        {collapsed ? <Menu size={24} /> : <ChevronLeft size={24} />}
                    </button>
                </div>
                <nav className="flex-1 p-2 space-y-2">
                    {menuItems.map((item) => (
                        <Link key={item.href} href={item.href}>
                            <div className="p-2 rounded hover:bg-gray-800 cursor-pointer text-sm">
                                {collapsed ? "" : item.label}
                            </div>
                        </Link>
                    ))}
                </nav>
            </div>
        </div>
    );
}