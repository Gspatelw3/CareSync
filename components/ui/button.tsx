import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg" | "link";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

const baseClasses =
  "inline-flex items-center justify-center rounded-md font-semibold transition focus:outline-none disabled:pointer-events-none disabled:opacity-60 cursor-pointer";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "care-brand-gradient text-white hover:brightness-95 focus:ring-4 focus:ring-[var(--care-accent)]/35",
  secondary:
    "border border-[var(--care-border)] bg-white text-[var(--care-primary)] hover:bg-[var(--care-surface)] focus:ring-4 focus:ring-[var(--care-accent)]/25",
  ghost:
    "bg-transparent text-[var(--care-primary)] hover:bg-[var(--care-surface)] focus:ring-4 focus:ring-[var(--care-accent)]/20",
  danger:
    "bg-red-600 text-white hover:bg-red-700 focus:ring-4 focus:ring-red-200",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-4 text-sm",
  lg: "h-12 px-5 text-base",
  link: "h-auto p-0 text-sm",
};

export function Button({
  className,
  size = "md",
  type = "button",
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      className={[
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      type={type}
      {...props}
    />
  );
}
