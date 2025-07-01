'use client';

import React, { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { FilePanel } from '../../../components/FilePanel';
import { ChatWindow } from '../../../components/ChatWindow';
import { SystemPrompt } from '../../../components/SystemPrompt';
import { Sidebar } from "@/components/Sidebar";

interface FileInfo {
    filepath: string;
    originalFilename: string;
}

export default function Dashboard() {
    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === 'unauthenticated') signIn();
    }, [status]);

    const [files, setFiles] = useState<FileInfo[]>([]);
    const [prompt, setPrompt] = useState<string>('');

    const handleRemoveFile = (filepath: string) => {
        setFiles(prev => prev.filter(f => f.filepath !== filepath));
    };

    const handleUpload = (newFiles: FileInfo[]) => {
        setFiles(prev => [
            ...prev,
            ...newFiles.filter(nf => !prev.some(f => f.filepath === nf.filepath))
        ]);
    };

    if (status === 'loading') return <p>Loading...</p>;
    if (!session) return null;

    const role = session.user.role === 'teacher' ? 'teacher' : 'student';

    return (
        <div className="flex flex-col flex-1 overflow-hidden">
            <div className="p-6 border-b">
                <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
                <p className="text-lg">
                    You are logged in as: <span className="font-semibold">{role}</span>
                </p>
            </div>

            <div className="flex flex-1 min-h-0">
                <FilePanel files={files} onUpload={handleUpload} onRemoveFile={handleRemoveFile} />
                <div className="flex-1 min-h-0 overflow-auto">
                    <ChatWindow systemPrompt={prompt} documents={files} />
                </div>
                <div className="w-1/4 min-w-[200px] flex flex-col min-h-0 border-l">
                    <SystemPrompt prompt={prompt} onChange={setPrompt} />
                </div>
            </div>
        </div>
    );
}