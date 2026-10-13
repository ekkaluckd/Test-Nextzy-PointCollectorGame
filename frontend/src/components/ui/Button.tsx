import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "danger" | "reset";

const variantClasses: Record<Variant, string> = {
  primary: "h-12 w-full rounded-full bg-accent text-xl font-bold text-white",
  danger: "h-[38px] rounded-[12.5px] bg-brand px-4 text-xl font-bold text-white disabled:bg-brand-faded",
  reset: "h-8 rounded-full bg-reset px-6 text-lg font-extrabold tracking-wide text-white",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export function Button({ variant = "primary", className = "", type = "button", ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center transition-opacity active:opacity-80 disabled:cursor-not-allowed ${variantClasses[variant]} ${className}`}
      {...props}
    />
  );
}
