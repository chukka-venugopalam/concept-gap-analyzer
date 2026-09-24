import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'CIP Diagnostic Result'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const COLORS = {
  bg: '#0A0A0F',
  surface: '#13131A',
  border: '#1E1E2E',
  primary: '#F0F0F5',
  secondary: '#7A7A9A',
  muted: '#4A4A6A',
  known: '#1DB887',
  weak: '#E8A838',
  missing: '#E85555',
  misconception: '#C44FD4',
}

// Public, unauthenticated endpoint — same data already shown on the
// public /share/[sessionId] page. No new data exposure introduced here.
async function getPublicSession(sessionId: string) {
  const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
  const res = await fetch(`${base}/api/v1/session/${sessionId}/public`, {
    cache: 'no-store',
  })
  if (!res.ok) return null
  return res.json()
}

export default async function Image({ params }: { params: { sessionId: string } }) {
  const data = await getPublicSession(params.sessionId)

  const known = data?.concepts_known?.length ?? 0
  const weak = data?.concepts_weak?.length ?? 0
  const missing = data?.concepts_missing?.length ?? 0
  const misconceptions = data?.misconceptions?.length ?? 0
  const topicName = data?.topic_name ?? 'DSA Concept'

  // The purple-cow hook: lead with misconceptions specifically, not an
  // equal-weighted four-way split. A clean run (0 misconceptions) still
  // gets its own distinct, positive framing rather than just "N/A".
  const hasMisconceptions = misconceptions > 0

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: COLORS.bg,
          padding: '64px',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', fontSize: 22, fontWeight: 700, color: COLORS.primary }}>
            CIP
          </div>
          <div style={{ display: 'flex', fontSize: 18, color: COLORS.secondary }}>
            {topicName}
          </div>
        </div>

        {/* Hero claim */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            justifyContent: 'center',
            alignItems: 'flex-start',
          }}
        >
          {hasMisconceptions ? (
            <>
              <div style={{ display: 'flex', fontSize: 120, fontWeight: 700, color: COLORS.misconception, lineHeight: 1 }}>
                {misconceptions}
              </div>
              <div style={{ display: 'flex', fontSize: 40, fontWeight: 600, color: COLORS.primary, marginTop: 12 }}>
                {misconceptions === 1 ? 'thing I was confidently wrong about' : 'things I was confidently wrong about'}
              </div>
            </>
          ) : (
            <>
              <div style={{ display: 'flex', fontSize: 90, fontWeight: 700, color: COLORS.known, lineHeight: 1 }}>
                Zero
              </div>
              <div style={{ display: 'flex', fontSize: 40, fontWeight: 600, color: COLORS.primary, marginTop: 12 }}>
                confident misconceptions this time
              </div>
            </>
          )}
        </div>

        {/* State breakdown row */}
        <div style={{ display: 'flex', gap: 32 }}>
          {[
            { label: 'Known', value: known, color: COLORS.known },
            { label: 'Weak', value: weak, color: COLORS.weak },
            { label: 'Missing', value: missing, color: COLORS.missing },
          ].map((s) => (
            <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ display: 'flex', width: 10, height: 10, borderRadius: 5, backgroundColor: s.color }} />
              <div style={{ display: 'flex', fontSize: 20, color: COLORS.secondary }}>
                {s.value} {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            marginTop: 40,
            paddingTop: 24,
            borderTop: `1px solid ${COLORS.border}`,
            fontSize: 16,
            color: COLORS.muted,
          }}
        >
          Diagnosed with CIP — find out what you're confidently wrong about
        </div>
      </div>
    ),
    { ...size }
  )
}
