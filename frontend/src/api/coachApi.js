const jsonHeaders = (apiKey) => ({
  'Content-Type': 'application/json',
  ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
})

const safeJson = async (response) => {
  const text = await response.text()

  try {
    return JSON.parse(text)
  } catch {
    return { text }
  }
}

export async function callClaude(payload) {
  const apiUrl = import.meta.env.VITE_CLAUDE_API_URL
  const apiKey = import.meta.env.VITE_CLAUDE_API_KEY

  if (!apiUrl) {
    throw new Error('Missing VITE_CLAUDE_API_URL')
  }

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: jsonHeaders(apiKey),
    body: JSON.stringify(payload),
  })

  const body = await safeJson(response)

  if (!response.ok) {
    throw new Error(body.error || body.message || 'Claude request failed')
  }

  return body
}

export async function fetchJobPage(url) {
  const endpoint = import.meta.env.VITE_JOB_FETCH_URL

  if (!endpoint) {
    return { url, content: '', fetched: false }
  }

  const response = await fetch(`${endpoint}?url=${encodeURIComponent(url)}`)
  const body = await safeJson(response)

  if (!response.ok) {
    throw new Error(body.error || body.message || 'Job fetch failed')
  }

  return {
    url,
    content: body.content || body.text || '',
    fetched: true,
  }
}

export async function callN8nWebhook(payload) {
  const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL

  if (!webhookUrl) {
    throw new Error('Missing VITE_N8N_WEBHOOK_URL')
  }

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: jsonHeaders(),
    body: JSON.stringify(payload),
  })

  const body = await safeJson(response)

  if (!response.ok) {
    throw new Error(body.error || body.message || 'Webhook request failed')
  }

  return body
}
