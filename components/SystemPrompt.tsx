import React from 'react';

export function SystemPrompt({ prompt, onChange }: { prompt: string; onChange: (v: string) => void }) {
    return (
        <div className="p-4 border-l flex flex-col min-h-0">
            <h2 className="font-bold mb-2">System Prompt</h2>
            <textarea
                value={prompt}
                onChange={e => onChange(e.target.value)}
                className="w-full flex-1 p-2 border rounded overflow-auto"
                placeholder="Enter system prompt..."
            />
        </div>
    );
}