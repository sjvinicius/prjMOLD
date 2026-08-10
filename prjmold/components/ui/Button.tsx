interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    isdisabled?: boolean;
}

export function Button({ children, className, isdisabled = false, ...props }: ButtonProps) {
    return (
        <button className={`rounded
                border-0
                bg-[#FFCD92]
                px-4
                py-3.75 
                tracking-[2px]
                text-black
                outline-none
                font-bold
                uppercase
                text-sm
                ${className || ''}
                ${isdisabled ? 'bg-white/10 text-white/40 disabled' : 'hover:shadow-[0_10px_20px_rgba(255,205,146,0.2)] transition-all duration-300 focus:border-[#FFFFFF] active:translate-y-0'}`}
            {...props}>
            {children}
        </button>
    );
}