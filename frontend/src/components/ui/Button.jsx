/**
 * components/ui/Button.jsx
 * Reusable button — variants: "primary" | "ghost"
 */
const Button = ({
  children,
  onClick,
  variant = "primary",
  disabled = false,
  className = "",
  ...props
}) => {
  const base =
    variant === "primary"
      ? "btn-primary"
      : "btn-ghost";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${base}
        w-full sm:w-auto
        text-sm sm:text-base
        px-4 sm:px-5
        py-2.5 sm:py-3
        rounded-xl
        transition-all duration-200
        disabled:opacity-50
        disabled:cursor-not-allowed
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
