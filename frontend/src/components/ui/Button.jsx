/**
 * components/ui/Button.jsx
 * Reusable button — variants: "primary" | "ghost"
 */
const Button = ({ children, onClick, variant = "primary", disabled = false, className = "", ...props }) => {
  const base = variant === "primary" ? "btn-primary" : "btn-ghost";
  return (
    <button onClick={onClick} disabled={disabled} className={`${base} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;