/**
 * components/ui/Tag.jsx
 * Small pill badge. Pass a hex/CSS color string for custom colors.
 */
const Tag = ({ children, color = "#3b82f6", className = "" }) => (
  <span
    className={`tag ${className}`}
    style={{
      color,
      background: `${color}1A`,
      borderColor: `${color}44`,
    }}
  >
    {children}
  </span>
);

export default Tag;