export const getTranscript = async (videoId) => {
    const url = 'https://youtube-scraper-2023.p.rapidapi.com/video_transcript';
    const options = {
      method: 'POST',
      headers: {
        'x-rapidapi-key': '4815994816msh8af569d2a2bd54ap1e8996jsn8965e8d111d3',
        'x-rapidapi-host': 'youtube-scraper-2023.p.rapidapi.com',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "videoId": videoId
      })
    };
  try {
    const response = await fetch(url, options);
    const result = await response.json();
    return result.transcript; // Return the transcript data
  } catch (error) {
    console.error("Error fetching transcript:", error);
    throw error; // Rethrow the error for further handling
  }
};