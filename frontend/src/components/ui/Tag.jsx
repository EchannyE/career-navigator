/**
 * components/ui/Tag.jsx
 * Small pill badge. Pass a hex/CSS color string for custom colors.
 */
const Tag = ({
  children,
  color = "#3b82f6",
  className = "",
}) => (
  <span
    className={`
      tag
      inline-flex
      items-center
      justify-center
      px-2.5 sm:px-3
      py-1
      text-[11px] sm:text-xs
      font-medium
      rounded-lg
      leading-none
      whitespace-nowrap
      max-w-full
      ${className}
    `}
    style={{
      color,
      background: `${color}1A`,
      borderColor: `${color}44`,
    }}
  >
    <span className="truncate">
      {children}
    </span>
  </span>
);

export default Tag;
