import { Link } from '@inertiajs/react';

export default function ResponsiveNavLink({
    active = false,
    className = '',
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={`flex w-full items-start border-l-4 py-2 pe-4 ps-3 ${
                active
                    ? 'border-red-500 bg-red-600/20 text-white focus:border-red-600 focus:bg-red-600/30 focus:text-white'
                    : 'border-transparent text-gray-400 hover:border-red-600/50 hover:bg-red-600/10 hover:text-white focus:border-red-600/50 focus:bg-red-600/10 focus:text-white'
            } text-base font-medium transition duration-150 ease-in-out focus:outline-none ${className}`}
        >
            {children}
        </Link>
    );
}
