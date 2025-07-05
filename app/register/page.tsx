'use client';

import Link from 'next/link';

export default function RegisterSelection() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-4xl">
                <h2 className="text-2xl font-bold text-center mb-6">Choose an Account Type</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Learner Option */}
                    <div className="border p-6 rounded-lg flex flex-col justify-between text-center">
                        <div>
                            <h3 className="text-xl font-semibold mb-2">I'm an Independent Learner</h3>
                            <p className="text-gray-600 mb-4">
                                Ideal if you're signing up for your own self-paced learning journey.
                            </p>
                        </div>
                        <Link
                            href="/register/independent-learner"
                            className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                        >
                            Continue as Learner
                        </Link>
                    </div>

                    {/* Parent Option */}
                    <div className="border p-6 rounded-lg flex flex-col justify-between text-center">
                        <div>
                            <h3 className="text-xl font-semibold mb-2">I'm a Parent</h3>
                            <p className="text-gray-600 mb-4">
                                Perfect for parents who want to register and manage student accounts.
                            </p>
                        </div>
                        <Link
                            href="/register/parent"
                            className="bg-green-600 text-white py-2 rounded hover:bg-green-700"
                        >
                            Continue as Parent
                        </Link>
                    </div>
                </div>
                <div className="text-center mt-6 text-sm">
                    Already have an account?{' '}
                    <Link href="/login" className="text-blue-600 hover:underline">Login</Link>
                </div>
            </div>
        </div>
    );
}