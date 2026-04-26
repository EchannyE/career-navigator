export default function JobInput({ jobUrl, jobDescription, onChange }) {
  return (
    <div className="stack-md">
      <label className="stack-sm">
        <span style={{ fontWeight: 700 }}>Job posting URL</span>
        <input
          type="url"
          placeholder="https://company.com/jobs/senior-product-manager"
          value={jobUrl}
          onChange={(event) => onChange('jobUrl', event.target.value)}
        />
      </label>
      <label className="stack-sm">
        <span style={{ fontWeight: 700 }}>Job description</span>
        <textarea
          rows="12"
          placeholder="Paste the job description if you have it. If the fetch endpoint is configured, the app can also pull details from the URL."
          value={jobDescription}
          onChange={(event) => onChange('jobDescription', event.target.value)}
        />
      </label>
    </div>
  )
}
