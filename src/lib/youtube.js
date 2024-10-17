const RAPIDAPI_KEY = import.meta.env.VITE_RAPIDAPI_KEY; // RapidAPI key
const GOOGLE_API_KEY = "AIzaSyAqKrmwsIarC3X8suP4H8060gFjRFbhlgA"; // Google API key
const RAPIDAPI_HOST = 'yt-api.p.rapidapi.com';
const GOOGLE_API_HOST = 'www.googleapis.com';

// Function to search videos using RapidAPI
export const searchYouTube = async (query, searchType, sort, uploadDate, duration, continuationToken, lang = 'en', country = 'IN') => {
  try {
    // Start building the URL
    const baseUrl = `https://${RAPIDAPI_HOST}/search?query=${encodeURIComponent(query)}&lang=${lang}&geo=${country}`;
    const params = new URLSearchParams();

    // Add parameters only if they are present and meaningful
    if (searchType && searchType !== "videos") params.append('type', searchType);
    if (sort && sort !== "relevance") params.append('sort', sort);
    if (uploadDate && uploadDate !== "anytime") params.append('upload_date', uploadDate);
    if (duration && duration !== "any") params.append('duration', duration);
    if (continuationToken) params.append('token', continuationToken);

    // Construct the full URL
    const searchUrl = `${baseUrl}&${params.toString()}`;
    console.log(searchUrl); // Log the constructed URL for debugging

    const searchResponse = await fetch(searchUrl, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': RAPIDAPI_HOST,
      },
    });

    if (!searchResponse.ok) {
      const errorData = await searchResponse.json();
      console.error('Search API Error:', errorData);
      throw new Error('Failed to fetch YouTube data: ' + errorData.message);
    }

    const searchData = await searchResponse.json();
    
    // Filter to include only video items
    const videoData = searchData.data.filter(video => video.type === 'video');

    return {
      continuation: searchData.continuation, // Return the continuation token
      estimatedResults: searchData.estimatedResults,
      data: videoData.map(video => ({
        type: video.type,
        videoId: video.videoId,
        title: video.title,
        channelTitle: video.channelTitle,
        channelId: video.channelId,
        channelThumbnail: video.channelThumbnail,
        description: video.description,
        viewCount: video.viewCount,
        publishedTimeText: video.publishedTimeText,
        lengthText: video.lengthText,
        thumbnail: video.thumbnail,
        richThumbnail: video.richThumbnail,
      })),
    };

  } catch (error) {
    console.error('Error in searchYouTube:', error);
    throw error; // Rethrow the error for further handling
  }
};

// Function to fetch video details and comments using Google YouTube API
export const fetchVideoDetails = async (videoId, nextPageToken = '') => {
  try {
    const response = await fetch(
      `https://${GOOGLE_API_HOST}/youtube/v3/videos?part=snippet,statistics&id=${videoId}&key=${GOOGLE_API_KEY}`,
      {
        method: 'GET',
      }
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Failed to fetch video details:', errorData);
      throw new Error('Error: ' + errorData.error.message);
    }

    const videoData = await response.json();
    // Fetch comments for the video
    const commentsResponse = await fetch(
      `https://${GOOGLE_API_HOST}/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&pageToken=${nextPageToken}&key=${GOOGLE_API_KEY}`,
      {
        method: 'GET',
      }
    );

    if (!commentsResponse.ok) {
      const errorData = await commentsResponse.json();
      throw new Error('Failed to fetch comments: ' + errorData.error.message);
    }

    const commentsData = await commentsResponse.json();

    return {
      video: videoData.items[0], // Return video details
      comments: commentsData.items, // Return comments
      nextPageToken: commentsData.nextPageToken, // Return next page token
    };
  } catch (error) {
    console.error('Error fetching video details:', error);
    throw error; // Rethrow the error for further handling
  }
};
