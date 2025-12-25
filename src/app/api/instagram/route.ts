import { NextResponse } from 'next/server';

// Instagram Basic Display API integration
// Docs: https://developers.facebook.com/docs/instagram-basic-display-api

interface InstagramMedia {
  id: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  media_url: string;
  thumbnail_url?: string;
  permalink: string;
  caption?: string;
  timestamp: string;
}

interface InstagramResponse {
  data: InstagramMedia[];
  paging?: {
    cursors: { before: string; after: string };
    next?: string;
  };
}

// Cache the response for 1 hour
let cachedData: { media: InstagramMedia[]; timestamp: number } | null = null;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

export async function GET() {
  try {
    const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Instagram access token not configured' },
        { status: 500 }
      );
    }

    // Check cache
    if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
      return NextResponse.json({ media: cachedData.media, cached: true });
    }

    // Fetch from Instagram API
    const response = await fetch(
      `https://graph.instagram.com/me/media?fields=id,media_type,media_url,thumbnail_url,permalink,caption,timestamp&access_token=${accessToken}&limit=12`
    );

    if (!response.ok) {
      const error = await response.json();
      console.error('Instagram API error:', error);

      // If token expired, return cached data if available
      if (cachedData) {
        return NextResponse.json({
          media: cachedData.media,
          cached: true,
          warning: 'Token may be expired, showing cached data'
        });
      }

      return NextResponse.json(
        { error: 'Failed to fetch Instagram media' },
        { status: 500 }
      );
    }

    const data: InstagramResponse = await response.json();

    // Filter to only images (skip videos and carousels for now)
    const images = data.data.filter(
      (item) => item.media_type === 'IMAGE' || item.media_type === 'CAROUSEL_ALBUM'
    );

    // Update cache
    cachedData = { media: images, timestamp: Date.now() };

    return NextResponse.json({ media: images, cached: false });
  } catch (error) {
    console.error('Instagram fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
