import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { fetchVideoDetails } from '@/lib/youtube';
import { getTranscript } from '@/lib/transcript';
import { getGroqChatCompletion } from '@/lib/groq';
import VideoStream from './VideoStream';
import { logout } from '@/components/AuthForms/Logout';
import { Button } from "@/components/ui/button";

const VideoDetails = () => {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [state, setState] = useState({
    video: null,
    comments: [],
    transcript: '',
    summary: '',
    commentAnalysis: '',
    showFullDescription: false,
    showStream: false,
    errors: {}
  });
  const [transcriptPrompt, setTranscriptPrompt] = useState('');
  const [commentPrompt, setCommentPrompt] = useState('');

  useEffect(() => {
    fetchVideoDetails(videoId)
      .then(({ video, comments }) => setState(prev => ({ ...prev, video, comments })))
      .catch(error => setState(prev => ({ ...prev, errors: { ...prev.errors, fetch: error.message } })));
  }, [videoId]);

  const handleSummarizeTranscript = async () => {
    try {
      const transcriptData = await getTranscript(videoId);
      const fullTranscript = transcriptData.map(item => item.snippet).join(' ');
      const summaryResponse = await getGroqChatCompletion(fullTranscript, transcriptPrompt, "summarize");
      setState(prev => ({ ...prev, transcript: fullTranscript, summary: summaryResponse }));
    } catch (error) {
      setState(prev => ({ ...prev, errors: { ...prev.errors, transcript: error.message } }));
    }
  };

  const handleAnalyzeComments = async () => {
    try {
      const commentData = state.comments.map(comment => comment.snippet.topLevelComment.snippet.textDisplay).join(' ');
      const analysisResponse = await getGroqChatCompletion(commentData, commentPrompt, "analyze");
      setState(prev => ({ ...prev, commentAnalysis: analysisResponse }));
    } catch (error) {
      setState(prev => ({ ...prev, errors: { ...prev.errors, commentAnalysis: error.message } }));
    }
  };

  const toggleDescription = () => setState(prev => ({ ...prev, showFullDescription: !prev.showFullDescription }));
  const toggleStream = () => setState(prev => ({ ...prev, showStream: !prev.showStream }));

  const handleBack = () => {
    navigate('/', { state: location.state });
  };

  if (!state.video) return <div>Loading...</div>;

  return (
    <div className="container p-4 font-sans text-gray-100 bg-gray-900">
      <Button onClick={handleBack} className="mb-4 bg-purple-600 hover:bg-purple-700">Back to Search</Button>
      <Button onClick={logout} className="mb-4 ml-2 bg-purple-600 hover:bg-purple-700">Logout</Button>
      
      <h1 className="mb-4 text-2xl font-bold">{state.video.snippet.title}</h1>
      
      <img 
        src={state.video.snippet.thumbnails.default.url} 
        alt={state.video.snippet.title} 
        onClick={toggleStream}
        style={{ cursor: 'pointer' }} 
        className="mb-4"
      />
      
      {state.showStream && <VideoStream videoId={videoId} />}

      <p className="mb-4">
        {state.video.snippet.description.split('. ').slice(0, 3).join('. ')}.
        {state.showFullDescription ? ` ${state.video.snippet.description}` : '...'}
        <Button onClick={toggleDescription} className="ml-2 bg-purple-600 hover:bg-purple-700">
          {state.showFullDescription ? 'Show Less' : 'Read More'}
        </Button>
      </p>

      <p className="mb-2">Views: {state.video.statistics.viewCount}</p>
      <p className="mb-4">Published: {state.video.snippet.publishedAt}</p>
      
      <div className="mb-4">
        <input
          type="text"
          value={transcriptPrompt}
          onChange={(e) => setTranscriptPrompt(e.target.value)}
          placeholder="Enter custom prompt for transcript analysis (if any)"
          className="w-full p-2 mb-2 text-black border rounded"
        />
        <Button onClick={handleSummarizeTranscript} className="bg-green-500 hover:bg-green-600">
          Summarize Transcript
        </Button>
        {state.errors.transcript && <p className="mt-2 text-red-500">{state.errors.transcript}</p>}
      </div>

      <div className="mb-4">
        <input
          type="text"
          value={commentPrompt}
          onChange={(e) => setCommentPrompt(e.target.value)}
          placeholder="Enter custom prompt for comment analysis (if any)"
          className="w-full p-2 mb-2 text-black border rounded"
        />
        <Button onClick={handleAnalyzeComments} className="bg-blue-500 hover:bg-blue-600">
          Analyze Comments
        </Button>
        {state.errors.commentAnalysis && <p className="mt-2 text-red-500">{state.errors.commentAnalysis}</p>}
      </div>

      {state.summary && (
        <div className="mt-4">
          <h3 className="mb-2 text-xl font-bold">Summarized Transcript:</h3>
          <pre className="whitespace-pre-wrap">{state.summary}</pre>
        </div>
      )}

      {state.commentAnalysis && (
        <div className="mt-4">
          <h3 className="mb-2 text-xl font-bold">Comment Analysis:</h3>
          <pre className="whitespace-pre-wrap">{state.commentAnalysis}</pre>
        </div>
      )}

      <h2 className="mt-6 mb-2 text-xl font-bold">Comments</h2>
      {state.errors.fetch && <p className="mb-2 text-red-500">{state.errors.fetch}</p>}
      {state.comments.length > 0 ? (
        <ul>
          {state.comments.map(comment => (
            <li key={comment.id} className="mb-2">
              <p><strong>{comment.snippet.topLevelComment.snippet.authorDisplayName}</strong>: {comment.snippet.topLevelComment.snippet.textDisplay}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No comments available.</p>
      )}
    </div>
  );
};

export default VideoDetails;