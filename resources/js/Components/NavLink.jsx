import { Link } from '@inertiajs/react';

export default function NavLink({
    active = false,
    className = '',
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={
                'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none ' +
                (active
                    ? 'border-red-500 text-white focus:border-red-600'
                    : 'border-transparent text-gray-400 hover:border-red-600/50 hover:text-white focus:border-red-600/50 focus:text-white') +
                className
            }
        >
            {children}
        </Link>
    );
}
