export default function Checkbox({ className = '', ...props }) {
    return (
        <input
            {...props}
            type="checkbox"
            className={
                'rounded border-red-600/30 bg-black/50 text-red-600 shadow-sm focus:ring-red-500 focus:ring-2 focus:ring-offset-0 w-4 h-4 cursor-pointer ' +
                className
            }
        />
    );
}
