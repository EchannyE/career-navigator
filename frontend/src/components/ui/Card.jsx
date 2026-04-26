/**
 * components/ui/Card.jsx
 * Surface card with optional accent border color.
 */
const Card = ({ children, className = "", accentColor = null }) => (
  <div
    className={`card p-6 ${className}`}
    style={accentColor ? { borderColor: `${accentColor}33` } : undefined}
  >
    {children}
  </div>
);

export default Card;