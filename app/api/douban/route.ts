import * as cheerio from 'cheerio';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    const response = await fetch(url);
    const html = await response.text();

    const $ = cheerio.load(html);

    const title = $('meta[property="og:title"]').attr('content') || '';
    const description =
      $('meta[property="og:description"]').attr('content') || '';
    const imageUrl = $('meta[property="og:image"]').attr('content') || '';
    const pageUrl = $('meta[property="og:url"]').attr('content') || '';

    return NextResponse.json({
      title,
      description,
      url: pageUrl,
      image: imageUrl,
    });
  } catch (error) {
    console.error('Error fetching book data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch book data' },
      { status: 500 },
    );
  }
}
