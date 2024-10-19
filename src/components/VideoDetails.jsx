import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { fetchVideoDetails } from '@/lib/youtube';
import { getTranscript } from '@/lib/transcript';
import { getGroqChatCompletion } from '@/lib/groq';
import VideoStream from './VideoStream';
import { logout } from '@/components/AuthForms/Logout';
import { Button } from "@/components/ui/button";
import Header from './Header'

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
  const [loadingTranscript, setLoadingTranscript] = useState(false);
  const [loadingCommentAnalysis, setLoadingCommentAnalysis] = useState(false);

  useEffect(() => {
    fetchVideoDetails(videoId)
      .then(({ video, comments }) => setState(prev => ({ ...prev, video, comments })))
      .catch(error => setState(prev => ({ ...prev, errors: { ...prev.errors, fetch: error.message } })));
  }, [videoId]);

  const handleSummarizeTranscript = async () => {
    setLoadingTranscript(true);
    try {
      const transcriptData = await getTranscript(videoId);
      const fullTranscript = transcriptData.map(item => item.snippet).join(' ');
      const summaryResponse = await getGroqChatCompletion(fullTranscript, transcriptPrompt, "summarize");
      setState(prev => ({ ...prev, transcript: fullTranscript, summary: summaryResponse }));
      setLoadingTranscript(false);
    } catch (error) {
      setLoadingTranscript(false);
      setState(prev => ({ ...prev, errors: { ...prev.errors, transcript: error.message } }));
    }
  };

  const handleAnalyzeComments = async () => {
    setLoadingCommentAnalysis(true);
    try {
      const commentData = state.comments.map(comment => comment.snippet.topLevelComment.snippet.textDisplay).join(' ');
      const analysisResponse = await getGroqChatCompletion(commentData, commentPrompt, "analyze");
      setState(prev => ({ ...prev, commentAnalysis: analysisResponse }));
      setLoadingCommentAnalysis(false);
    } catch (error) {
      setLoadingCommentAnalysis(false);
      setState(prev => ({ ...prev, errors: { ...prev.errors, commentAnalysis: error.message } }));
    }
  };

  const toggleDescription = () => setState(prev => ({ ...prev, showFullDescription: !prev.showFullDescription }));
  const toggleStream = () => setState(prev => ({ ...prev, showStream: !prev.showStream }));

  const handleBack = () => {
    navigate('/', { state: location.state });
  };

  if (!state.video) return <div>Loading video details...</div>;

  return (
    <div className="container flex flex-col items-center justify-between min-h-screen p-4 font-sans text-gray-100 bg-gray-900">
      <Header/>
      
      <h1 className="mb-4 text-2xl font-bold text-center">{state.video.snippet.title}</h1>
      <div className="relative" style={{ cursor: 'pointer' }} onClick={toggleStream}> {/* Added container div */}

      <img 
        src={state.video.snippet.thumbnails.default.url} 
        alt={state.video.snippet.title} 
        onClick={toggleStream}
        style={{ cursor: 'pointer' }} 
        className="m-auto mb-4 h-[20vh] rounded-md"
      />
      <div className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="48px" height="48px" style={{ opacity: 3 }}> {/* White play icon with opacity */}
            <path d="M8 5v14l11-7z" />
        </svg>
    </div>
    </div>
      
      {state.showStream && <VideoStream className="w-full m-auto mb-4 rounded-md" videoId={videoId} />}

      <p className="mb-4">
        {state.video.snippet.description.split(' ').slice(0, 30).join(' ')}.
        {state.showFullDescription ? ` ${state.video.snippet.description}` : '  ...'}
        <Button onClick={toggleDescription} className="ml-2 bg-purple-600 hover:bg-purple-700">
          {state.showFullDescription ? 'Show Less' : 'Read More'}
        </Button>
      </p>
      <div className="flex flex-row items-center justify-between mb-2 w-fit">
      <p className='mr-3'>Views: {state.video.statistics.viewCount}</p>
      <p>Published: {state.video.snippet.publishedAt}</p>
      </div>
      
      <div className="w-full mb-4">
        <div className="flex flex-row items-center justify-between w-full">
        <input
          type="text"
          value={transcriptPrompt}
          onChange={(e) => setTranscriptPrompt(e.target.value)}
          placeholder="Enter custom prompt for transcript analysis (if any)"
          className="h-10 p-3 mr-3 text-white bg-gray-900 hover:border-purple-500 border rounded w-[95%]"
        />
        <Button onClick={handleSummarizeTranscript} className="h-10 bg-purple-600 hover:bg-purple-700">
          Summarize Transcript
        </Button>
        
        {state.errors.transcript && <p className="mt-2 text-red-500">No Transcript available for this video.</p>}
      </div>
      </div>
      

      <div className="w-full mb-4">
      <div className="flex flex-row items-center justify-between w-full">
        <input
          type="text"
          value={commentPrompt}
          onChange={(e) => setCommentPrompt(e.target.value)}
          placeholder="Enter custom prompt for comment analysis (if any)"
          className="h-10 p-3 mr-3 text-white bg-gray-900 hover:border-purple-500 border rounded w-[95%]"
        />
        <Button onClick={handleAnalyzeComments} className="h-10 bg-purple-600 hover:bg-purple-700">
          Analyze Comments
        </Button>
        {state.errors.commentAnalysis && <p className="mt-2 text-red-500">{state.errors.commentAnalysis}</p>}
      </div>
      </div>
      {loadingTranscript && <p className="text-purple-500">Loading transcript...</p>}
      {loadingCommentAnalysis && <p className="mt-2 text-purple-500">Loading comment analysis...</p>}
      {state.summary && (
        <div className="mt-4">
          <h3 className="mb-2 text-xl font-bold text-purple-500">Summarized Transcript:</h3>
          <p className="font-sans whitespace-pre-wrap">{state.summary}</p>
        </div>
      )}

      {state.commentAnalysis && (
        <div className="mt-4">
          <h3 className="mb-2 font-sans text-xl font-bold text-purple-500">Comment Analysis:</h3>
          <p className="font-sans whitespace-pre-wrap">{state.commentAnalysis}</p>
        </div>
      )}

      {state.errors.fetch && <p className="mb-2 text-red-500">{state.errors.fetch}</p>}
      <div className="mt-6 mr-auto">
        <h2 className="mb-2 mr-4 mr-6 text-xl font-bold ">Comments</h2>
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
    </div>
  );
};

export default VideoDetails;