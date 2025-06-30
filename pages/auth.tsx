import { useState } from 'react';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/react';
import axios from 'axios';

function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [role, setRole] = useState('student');

    const router = useRouter();

    const handleSubmit = async () => {
        if (isLogin) {
            const res = await signIn('credentials', {
                redirect: false,
                email,
                password
            });

            if (res?.ok) router.push('/dashboard');
            else alert('Login failed');
        } else {
            await axios.post('/api/register', { name, email, password, role });
            setIsLogin(true); // Switch to login mode
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md space-y-4">
                <h2 className="text-2xl font-bold text-center">
                    {isLogin ? 'Login to Your Account' : 'Create a New Account'}
                </h2>

                {!isLogin && (
                    <input
                        type="text"
                        placeholder="Full Name"
                        className="input"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                )}

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

                {!isLogin && (
                    <select className="input" value={role} onChange={(e) => setRole(e.target.value)}>
                        <option value="student">Student</option>
                        <option value="teacher">Teacher</option>
                    </select>
                )}

                <button
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                    onClick={handleSubmit}
                >
                    {isLogin ? 'Login' : 'Register'}
                </button>

                <p className="text-center text-sm">
                    {isLogin ? 'Need an account?' : 'Already have an account?'}{' '}
                    <button className="text-blue-500 underline" onClick={() => setIsLogin(!isLogin)}>
                        {isLogin ? 'Register' : 'Login'}
                    </button>
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
        </div>
    );
}

AuthPage.auth = true;
export default AuthPage;