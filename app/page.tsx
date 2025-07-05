import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white text-gray-800 px-4">
            <div className="flex flex-col items-center space-y-4 max-w-md w-full">
                <Image
                    src="/logo.png" // Replace with your own logo at /public/logo.png
                    alt="Understandly Logo"
                    width={240}
                    height={240}
                />
                <h1 className="text-3xl font-bold">Welcome to Understandly</h1>
                <p className="text-center text-gray-600">
                    An AI-powered learning platform for students and teachers.
                </p>
                <Link href="/login">
                    <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
                        Login
                    </button>
                </Link>
            </div>
        </div>
    );
}

