/**
 * components/ui/SectionLabel.jsx
 * Uppercase eyebrow label used above content sections.
 */
const SectionLabel = ({
  children,
  className = "",
}) => (
  <p
    className={`
      label-xs
      text-[11px] sm:text-xs
      tracking-widest
      uppercase
      mb-2 sm:mb-3
      leading-relaxed
      break-words
      ${className}
    `}
  >
    {children}
  </p>
);

export default SectionLabel;
