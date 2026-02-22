import { ImageResponse } from 'next/og'

// Route segment config
export const runtime = 'edge'

// Image metadata
export const alt = 'PhishX | AI-Powered Phishing Detector'
export const size = {
    width: 1200,
    height: 630,
}

export const contentType = 'image/png'

// Image generation
export default async function Image() {
    return new ImageResponse(
        (
            // ImageResponse JSX element
            <div
                style={{
                    fontSize: 128,
                    background: 'linear-gradient(to bottom right, #0B1C2D, #1E90FF)',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    padding: '40px',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ background: '#1E90FF', padding: '20px', borderRadius: '30px', display: 'flex' }}>
                        <span style={{ fontSize: '80px', fontWeight: 'bold' }}>🛡️</span>
                    </div>
                    <span style={{ fontWeight: 900, letterSpacing: '-0.05em' }}>PhishX</span>
                </div>
                <div style={{ fontSize: 32, marginTop: 40, opacity: 0.8, textAlign: 'center', maxWidth: '800px' }}>
                    AI-Powered Phishing Detection & Domain Intelligence
                </div>
            </div>
        ),
        // ImageResponse options
        {
            ...size,
        }
    )
}
