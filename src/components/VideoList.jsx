import PropTypes from 'prop-types';
import VideoItem from './VideoItem';

const VideoList = ({ videos, onVideoClick }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {videos.map((video) => (
        <VideoItem key={video.videoId} video={video} onClick={() => onVideoClick(video.videoId)} />
      ))}
    </div>
  );
};

VideoList.propTypes = {
  videos: PropTypes.arrayOf(PropTypes.shape({
    videoId: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    channelTitle: PropTypes.string.isRequired,
    channelId: PropTypes.string.isRequired,
    channelThumbnail: PropTypes.arrayOf(PropTypes.shape({
      url: PropTypes.string.isRequired,
      width: PropTypes.number.isRequired,
      height: PropTypes.number.isRequired,
    })).isRequired,
    description: PropTypes.string.isRequired,
    viewCount: PropTypes.string.isRequired,
    publishedTimeText: PropTypes.string.isRequired,
    lengthText: PropTypes.string.isRequired,
    thumbnail: PropTypes.arrayOf(PropTypes.shape({
      url: PropTypes.string.isRequired,
      width: PropTypes.number.isRequired,
      height: PropTypes.number.isRequired,
    })).isRequired,
    richThumbnail: PropTypes.arrayOf(PropTypes.shape({
      url: PropTypes.string.isRequired,
      width: PropTypes.number.isRequired,
      height: PropTypes.number.isRequired,
    })).isRequired,
  })).isRequired,
  onVideoClick: PropTypes.func.isRequired, // New prop for handling video clicks
};

export default VideoList;
