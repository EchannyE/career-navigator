/**
 * components/ui/SectionLabel.jsx
 * Uppercase eyebrow label used above content sections.
 */
const SectionLabel = ({ children, className = "" }) => (
  <p className={`label-xs mb-3 ${className}`}>{children}</p>
);

export default SectionLabel;