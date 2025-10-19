import { ImageResponse } from 'next/og';
import { readFileSync } from 'fs';
import { join } from 'path';

// Route segment config
export const runtime = 'nodejs';
export const dynamic = 'force-static';

// Image metadata
export const size = {
  width: 512,
  height: 512,
};

export const contentType = 'image/png';

// Image generation
export default function Icon() {
  // For now, we'll return the PWA.jpg from public folder
  // This will be served as the app icon
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
        {/* Placeholder: In production, you should use the actual PWA image */}
        <div
          style={{
            fontSize: 256,
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
