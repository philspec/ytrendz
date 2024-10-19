import { useEffect, useState } from 'react';

const VideoStream = ({ videoId }) => {
  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideoStream = async () => {
      const url = `https://yt-api.p.rapidapi.com/dl?id=${videoId}&cgeo=IN`;
      const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': '4815994816msh8af569d2a2bd54ap1e8996jsn8965e8d111d3',
            'x-rapidapi-host': 'yt-api.p.rapidapi.com'
          }
      };

      try {
        const response = await fetch(url, options);
        const result = await response.json();
        setVideoUrl(result.formats[result.formats.length - 1].url); // Access the last item in formats
      } catch (error) {
        setError('Error fetching video stream.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideoStream();
  }, [videoId]);

  if (loading) return <div>Loading video stream...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <video controls width="600">
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoStream;