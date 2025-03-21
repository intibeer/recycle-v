import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('query') || '';
  const latitude = searchParams.get('latitude');
  const longitude = searchParams.get('longitude');
  const radius = searchParams.get('radius') || '10000'; // Default 10km in meters
  
  // API key should be stored in environment variables
  const apiKey = process.env.TRASH_NOTHING_API_KEY;
  
  if (!apiKey) {
    console.log('API key not configured');
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
  }
  
  try {
    // Using the direct posts/search endpoint as shown in your example
    const url = new URL('https://trashnothing.com/api/v1.4/posts/search');
    
    // Add API key as a query parameter (as shown in your curl example)
    url.searchParams.append('api_key', apiKey);
    
    // Add required parameters
    url.searchParams.append('search', query || ' '); // Ensure we have a search term, even if empty
    url.searchParams.append('types', 'offer');
    
    // Remove 'groups' from sources to avoid needing group_ids
    url.searchParams.append('sources', 'trashnothing,open_archive_groups');
    url.searchParams.append('per_page', '50');
    
    // Add location parameters if available
    if (latitude && longitude) {
      url.searchParams.append('latitude', latitude);
      url.searchParams.append('longitude', longitude);
      url.searchParams.append('radius', radius);
      url.searchParams.append('sort_by', 'distance');
    } else {
      url.searchParams.append('sort_by', 'active');
    }
    
    // Log the full request URL for debugging (but mask the API key)
    const logUrl = url.toString().replace(apiKey, 'API_KEY_MASKED');
    console.log('Trash Nothing API request URL:', logUrl);
    
    // Make the request with the API key in the Authorization header as well
    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': apiKey,
        'Accept': 'application/json'
      }
    });
    
    console.log('Response status:', response.status);
    
    // Get the raw text first to see what's being returned
    const rawText = await response.text();
    
    // Only log a portion of the response for debugging
    if (response.status !== 200) {
      console.log('Raw response text (first 500 chars):', rawText.substring(0, 500));
    } else {
      console.log('Response successful');
    }
    
    // Try to parse as JSON only if it looks like JSON
    let data;
    if (rawText.trim().startsWith('{') || rawText.trim().startsWith('[')) {
      try {
        data = JSON.parse(rawText);
      } catch (parseError) {
        console.error('Error parsing JSON:', parseError);
        return NextResponse.json({ 
          error: 'Invalid JSON response from API',
          rawResponse: rawText.substring(0, 1000) // Include part of the raw response
        }, { status: 500 });
      }
    } else {
      console.error('Response is not JSON:', rawText.substring(0, 500));
      return NextResponse.json({ 
        error: 'Non-JSON response from API',
        rawResponse: rawText.substring(0, 1000)
      }, { status: 500 });
    }
    
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Error fetching from Trash Nothing API:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch data',
      message: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 