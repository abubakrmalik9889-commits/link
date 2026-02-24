import { NextResponse, type NextRequest } from 'next/server'
import type { Resume } from '@/types'

type AiAction = 'summary' | 'skills'

function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status })
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) return jsonError('Missing OPENAI_API_KEY', 500)

  const model = process.env.OPENAI_MODEL || 'gpt-4o-mini'

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return jsonError('Invalid JSON body')
  }

  const parsed = (body && typeof body === 'object') ? body as { action?: AiAction; resume?: Resume; jobDescription?: string } : {}
  const action: AiAction | undefined = parsed.action
  const resume = parsed.resume
  const jobDescription: string = parsed.jobDescription || ''

  if (!action) return jsonError('Missing action')
  if (!resume) return jsonError('Missing resume')
  if (action !== 'summary' && action !== 'skills') return jsonError('Unsupported action')

  const system = [
    'You are an assistant that writes ATS-friendly resume content.',
    'Keep output concise and professional.',
    'Do not invent employers, degrees, or certifications.',
    'If there is insufficient data, ask for the missing inputs instead of hallucinating.',
  ].join(' ')

  const user =
    action === 'summary'
      ? [
        'Write a 3-5 sentence professional summary for the resume below.',
        'Use strong action language, focus on outcomes, and keep it ATS-friendly.',
        'Return ONLY the summary text (no quotes, no headings).',
        jobDescription.trim() ? `Target job description:\n${jobDescription}` : '',
        `Resume JSON:\n${JSON.stringify(resume)}`,
      ]
        .filter(Boolean)
        .join('\n\n')
      : [
        'Suggest 12-18 ATS-friendly skills (comma-separated) for the resume below.',
        'Prefer concrete skills over buzzwords. Mix technical + domain + leadership if applicable.',
        'Return ONLY a comma-separated list.',
        jobDescription.trim() ? `Target job description:\n${jobDescription}` : '',
        `Resume JSON:\n${JSON.stringify(resume)}`,
      ]
        .filter(Boolean)
        .join('\n\n')

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 30_000)

  try {
    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: user },
        ],
        temperature: action === 'skills' ? 0.3 : 0.5,
      }),
      signal: controller.signal,
    })

    if (!resp.ok) {
      const text = await resp.text().catch(() => '')
      return jsonError(`AI request failed (${resp.status}). ${text ? text.slice(0, 200) : ''}`.trim(), 502)
    }

    const data: unknown = await resp.json()
    const content = (data as { choices?: Array<{ message?: { content?: string } }> })?.choices?.[0]?.message?.content
    if (typeof content !== 'string' || !content.trim()) return jsonError('AI returned empty response', 502)

    return NextResponse.json({ content: content.trim() })
  } catch (e: unknown) {
    const name = (e as { name?: string })?.name
    const msg = name === 'AbortError' ? 'AI request timed out' : 'AI request failed'
    return jsonError(msg, 502)
  } finally {
    clearTimeout(timeout)
  }
}
