import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl"></div>
            </div>

            <div className="relative w-full max-w-md">
                {/* Logo/Header */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-block">
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
                            EventHub
                        </h1>
                    </Link>
                </div>

                {/* Card */}
                <div className="bg-gradient-to-br from-red-900/20 to-black border border-red-600/20 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-sm">
                    <div className="px-8 py-10">
                        {children}
                    </div>
                </div>

                {/* Footer Link */}
                <div className="mt-6 text-center">
                    <Link
                        href="/"
                        className="text-sm text-gray-400 hover:text-red-500 transition duration-200"
                    >
                        ← Ana Sayfaya Dön
                    </Link>
                </div>
            </div>
        </div>
    );
}
