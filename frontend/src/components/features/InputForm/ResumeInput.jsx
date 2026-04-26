export default function ResumeInput({ value, onChange }) {
  return (
    <label className="stack-sm">
      <span style={{ fontWeight: 700 }}>Resume text</span>
      <textarea
        rows="14"
        placeholder="Paste your current resume, LinkedIn summary, or a rough draft here."
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  )
}
