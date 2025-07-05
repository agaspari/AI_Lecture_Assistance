'use client';
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useState } from 'react';
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react';
import Link from 'next/link';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { data: session } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (session) {
            router.push("/dashboard");
        }
    }, [session, router]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const res = await signIn('credentials', {
            redirect: false,
            email,
            password
        });

        if (res?.ok) router.push('/dashboard');
        else alert('Login failed');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100" onSubmit={handleSubmit}>

            <form>
                <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md space-y-4">
                    <h2 className="text-2xl font-bold text-center">
                        Login to Your Account
                    </h2>

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

                    <button
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                        onClick={handleSubmit}
                    >
                        Login
                    </button>

                    <p className="text-center text-sm">
                        Need an account?{' '}
                        <Link href="/register" className="text-blue-600 hover:underline">Register</Link>
                    </p>
                </div>
                <style jsx>{`
                    .input {
                        width: 100%;
                        padding: 10px;
                        border: 1px solid #ccc;
                        border-radius: 5px;
                    }
                `}</style>
            </form >
        </div >
    );
}
