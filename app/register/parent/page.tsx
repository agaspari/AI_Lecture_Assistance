'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';

export default function ParentRegister() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            const res = await axios.post('/api/register', {
                name,
                email,
                password,
                role: 'parent',
            });

            console.log("Registration successful:", res.data);
            router.push('/login');
        } catch (err: any) {
            console.error("Registration failed:", err);
            if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError("Something went wrong. Please try again.");
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md space-y-4">
                <Link href="/register" className="text-blue-600 hover:underline text-sm">← Back</Link>
                <h2 className="text-2xl font-bold text-center">Parent Registration</h2>

                <input
                    type="text"
                    placeholder="Full Name"
                    className="input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <input
                    type="email"
                    placeholder="Email"
                    className="input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                {error && (
                    <div className="text-red-600 text-sm text-center">
                        {error}
                    </div>
                )}
                <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
                    Register
                </button>

                <p className="text-center text-sm">
                    Already have an account?{' '}
                    <Link href="/" className="text-blue-600 hover:underline">Login</Link>
                </p>

                <style jsx>{`
                    .input {
                        width: 100%;
                        padding: 10px;
                        border: 1px solid #ccc;
                        border-radius: 5px;
                    }
                `}</style>
            </form>
        </div>
    );
}