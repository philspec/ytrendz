import PropTypes from 'prop-types'; // Add this import

const AnalysisResults = ({ comments }) => {
  return (
    <div>
      <h2>Analysis Results</h2>
      {comments ? (
        <pre>{JSON.stringify(comments, null, 2)}</pre>
      ) : (
        <div>No analysis results available.</div>
      )}
    </div>
  );
};

// Add PropTypes validation
AnalysisResults.propTypes = {
  comments: PropTypes.array.isRequired, // Validate 'comments' as an array and required
};

export default AnalysisResults;