interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
}

export function Button({ children, className, ...props }: ButtonProps) {
    return (
        <button className={`rounded
                border-0
                bg-[#FFCD92]
                px-4
                py-3.75 
                tracking-[2px]
                text-black
                transition-all 
                duration-300
                outline-none
                focus:border-[#FFFFFF]
                hover:shadow-[0_10px_20px_rgba(255,205,146,0.2)]
                active:translate-y-0
                font-bold
                uppercase
                text-sm
                ${className || ''}`}
            {...props}>
            {children}
        </button>
    );
}