import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "xs" | "sm" | "md" | "lg" | "link";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  isLoading?: boolean;
};

const baseClasses =
  "inline-flex items-center justify-center gap-2 rounded-md font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--care-primary)] focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50 cursor-pointer";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "care-brand-gradient text-white hover:brightness-110 hover:shadow-md",
  secondary:
    "border border-[var(--border-default)] bg-[var(--card-bg)] text-[var(--care-primary)] hover:bg-[var(--care-surface)] hover:border-[var(--care-primary)]",
  ghost:
    "bg-transparent text-[var(--care-primary)] hover:bg-[var(--care-surface)]",
  danger:
    "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-400",
};

const sizeClasses: Record<ButtonSize, string> = {
  xs: "h-8 px-2.5 text-xs",
  sm: "h-9 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-5 text-base",
  link: "h-auto p-0 text-sm",
};

export function Button({
  className,
  size = "md",
  type = "button",
  variant = "primary",
  icon,
  isLoading = false,
  children,
  disabled,
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
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {!isLoading && icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </button>
  );
}
