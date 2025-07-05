'use client';

import Link from 'next/link';

export default function RegisterSelection() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-6xl">
                <h2 className="text-2xl font-bold text-center mb-6">Choose an Account Type</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Student Option */}
                    <div className="border p-6 rounded-lg flex flex-col justify-between text-center">
                        <div>
                            <h3 className="text-xl font-semibold mb-2">I&apos;m a Student</h3>
                            <p className="text-gray-600 mb-4">
                                Learn independently or join a class with a code.
                            </p>
                        </div>
                        <Link
                            href="/register/student"
                            className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                        >
                            Continue as Student
                        </Link>
                    </div>

                    {/* Parent Option */}
                    <div className="border p-6 rounded-lg flex flex-col justify-between text-center">
                        <div>
                            <h3 className="text-xl font-semibold mb-2">I&apos;m a Parent</h3>
                            <p className="text-gray-600 mb-4">
                                Manage learning and track progress for one or more children.
                            </p>
                        </div>
                        <Link
                            href="/register/parent"
                            className="bg-green-600 text-white py-2 rounded hover:bg-green-700"
                        >
                            Continue as Parent
                        </Link>
                    </div>

                    {/* Teacher/Admin Option */}
                    <div className="border p-6 rounded-lg flex flex-col justify-between text-center">
                        <div>
                            <h3 className="text-xl font-semibold mb-2">I&apos;m a Teacher or Administrator</h3>
                            <p className="text-gray-600 mb-4">
                                Set up classes and manage multiple students.
                            </p>
                        </div>
                        <Link
                            href="/register/administrator"
                            className="bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
                        >
                            Continue as Teacher/Admin
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