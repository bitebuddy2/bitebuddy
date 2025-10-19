import { ImageResponse } from 'next/og';

// Route segment config
export const runtime = 'nodejs';
export const dynamic = 'force-static';

// Image metadata
export const size = {
  width: 180,
  height: 180,
};

export const contentType = 'image/png';

// Image generation
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#10b981', // emerald-600
        }}
      >
        <div
          style={{
            fontSize: 96,
            fontWeight: 'bold',
            color: 'white',
          }}
        >
          BB
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
