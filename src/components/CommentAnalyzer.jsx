import { useEffect, useState } from 'react';
import { getGroqChatCompletion } from '@/lib/groq';

const CommentAnalyzer = ({ comments, customPrompt }) => {
  const [response, setResponse] = useState(null); // State to store the response
  const [loading, setLoading] = useState(true); // State to manage loading state

  useEffect(() => {
    const analyzeComments = async () => {
      if (comments.length > 0 && customPrompt) {
        setLoading(true); // Set loading to true before the request
        try {
          const apiResponse = await getGroqChatCompletion(comments, customPrompt);
          console.log("GROQ API Analysis Response:", apiResponse); // Fresh console log for analysis response
          setResponse(apiResponse); // Store the response
        } catch (error) {
          console.error("Error analyzing comments:", error);
          setResponse("Error analyzing comments."); // Handle error
        } finally {
          setLoading(false); // Set loading to false after the request
        }
      }
    };

    analyzeComments();
  }, [comments, customPrompt]);

  if (loading) return <div>Analyzing comments...</div>; // Show loading message

  return (
    <div>
      <h3>Extracted Comments:</h3>
      {comments.length > 0 ? (
        <ul>
          {comments.map((comment, index) => (
            <li key={index}>{comment.snippet.topLevelComment.snippet.textDisplay}</li> // Display only the textDisplay
          ))}
        </ul>
      ) : (
        <div>No comments available.</div>
      )}
      {response ? (
        <div>
          <h3>Analysis Results:</h3>
          <pre>{response.choices[0].message.content}</pre> {/* Display only the content */}
        </div>
      ) : (
        <div>No analysis results available.</div>
      )}
    </div>
  );
};

export default CommentAnalyzer;
