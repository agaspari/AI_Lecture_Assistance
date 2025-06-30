import { SessionProvider, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import '../styles/globals.css';

export default function App({ Component, pageProps: { session, ...pageProps } }) {
    return (
        <SessionProvider session={session}>
            {Component.auth ? (
                <Component {...pageProps} />
            ) : (
                <AuthGuard>
                    <Component {...pageProps} />
                </AuthGuard>
            )}
        </SessionProvider>
    );
}

function AuthGuard({ children }) {
    const { data: session, status } = useSession();
    const router = useRouter();

    // Wait until session loads
    if (status === 'loading') return <div>Loading...</div>;

    // Redirect only if explicitly unauthenticated
    if (status === 'unauthenticated') {
        router.push('/auth');
        return null;
    }

    return <>{children}</>;
}