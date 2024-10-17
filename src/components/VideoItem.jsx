import PropTypes from 'prop-types';

const VideoItem = ({ video, onClick }) => {
  return (
    <div className="p-4 rounded-lg cursor-pointer" onClick={onClick}>
      <img
        src={video.thumbnail[0].url}
        alt={video.title}
        className="object-cover w-full h-48 mb-2 rounded-md"
      />
      <div className="flex flex-row w-full gap-2 justify-items-start">
      <img src={video.channelThumbnail[0].url} alt={video.channelTitle} className="w-8 h-8 mt-2 rounded-full" />
      <div className='flex flex-col'>
        <h2 className="font-semibold">{video.title}</h2>
        <p className="text-lg text-gray-300">{video.channelTitle}</p>
        <div className="flex flex-row gap-2">
        <p className="text-base text-gray-500">{video.viewCount} Views</p>
        <p className="text-base text-gray-500"> | </p>
        <p className="text-base text-gray-500">Published {video.publishedTimeText}</p>
        </div>
      </div>
      </div>
      
    </div>
  );
};

VideoItem.propTypes = {
  video: PropTypes.shape({
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
    publishedTimeText: PropTypes.string.isRequired, // Ensure this prop is included
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
  }).isRequired,
  onClick: PropTypes.func.isRequired, // New prop for handling click events
};

export default VideoItem;
