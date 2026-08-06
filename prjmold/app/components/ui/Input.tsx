interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

export function Input({ label, id, error, className, ...props }: InputProps) {
    return <div className="text-left">
        <label
            htmlFor={id}
            className="
                my-2
                block
                text-[10px]
                uppercase
                tracking-[2px]
                text-[#FFCD92]
            "
        >
            {label}
        </label>

        <input
            id={id}
            className={
                `rounded
                border border-white/10
                bg-white/5
                px-3.75
                py-3
                text-white
                outline-none
                transition-all duration-300
                placeholder:text-white/30
                focus:border-[#FFCD92]
                focus:bg-white/10
                block
                text-[10px]
                tracking-[2px]
                ${className || ""}`
            }
            {...props}
        />
        {error && (
            <p className="mt-1 text-xs text-red-400">
                {error}
            </p>
        )}
    </div>
}