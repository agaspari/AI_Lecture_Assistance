import React, { useState } from 'react';
import { FilePanel } from '../components/FilePanel';
import { ChatWindow } from '../components/ChatWindow';
import { SystemPrompt } from '../components/SystemPrompt';

interface FileInfo {
    filepath: string;
    originalFilename: string;
}

export default function Home() {
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

    return (
        <div className="flex h-screen">
            <FilePanel files={files} onUpload={handleUpload} onRemoveFile={handleRemoveFile} />
            <div className="flex-1 min-h-0">
                <ChatWindow systemPrompt={prompt} documents={files} />
            </div>
            <div className="w-1/4 flex flex-col min-h-0">
                <SystemPrompt prompt={prompt} onChange={setPrompt} />
            </div>
        </div>
    );
}
