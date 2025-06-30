import React, { useState } from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';


interface Message {
    role: string;
    content: string;
}

interface Doc {
    filepath: string;
    originalFilename: string;
}

export function ChatWindow({
    systemPrompt,
    documents,
}: {
    systemPrompt: string;
    documents: Doc[];
}) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');

    const send = async () => {
        setInput('');

        const userMsg = { role: 'user', content: input };
        const history = [...messages, userMsg];
        setMessages(history);
        const res = await axios.post('/api/chat', {
            systemPrompt,
            documents,
            messages: history,
        });
        setMessages([...history, res.data]);
    };

    const reset = () => {
        setMessages([]);
    }

    return (
        <div className="flex-1 flex flex-col p-4">
            <h2 className="font-bold mb-2">ChatGPT API</h2>
            <div className="flex-1 overflow-y-auto space-y-2 border p-2">
                {messages.map((m, i) => (
                    <div key={i} className={m.role === 'user' ? 'text-right' : 'text-left'}>
                        <div
                            className={`inline-block p-2 rounded ${m.role === 'user' ? 'bg-blue-100' : 'bg-gray-100'
                                }`}
                        >
                            {/* 👇 render Markdown here */}
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {m.content}
                            </ReactMarkdown>
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-2 flex">
                <input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            send();
                        }
                    }}
                    className="flex-1 border p-2 rounded-l"
                    placeholder="Type a message..."
                />
                <button onClick={send} className="bg-gray-200 px-4">Send</button>
                <button onClick={reset} className="bg-red-400 px-4 rounded-r">Reset</button>
            </div>
        </div>
    );
}
