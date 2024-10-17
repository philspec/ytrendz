import SearchBar from './SearchBar'
import VideoList from './VideoList'
import useStore from '@/store'
import { Button } from "@/components/ui/button"
import { useState, useEffect } from 'react'; // Import useState and useEffect for state management
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import { searchYouTube } from '@/lib/youtube'; // Import the search function
import { logout } from '@/components/AuthForms/Logout'
import { Youtube } from 'lucide-react'
const Dashboard = () => {
  const user = useStore((state) => state.user)
  const [searchParams, setSearchParams] = useState({}); // State to hold search parameters
  const [allResults, setAllResults] = useState([]); // State to hold all results across pages
  const [continuationToken, setContinuationToken] = useState(null); // State for continuation token
  const [currentPage, setCurrentPage] = useState(1); // Current page number
  const resultsPerPage = 10; // Number of results per page
  const navigate = useNavigate();

  const handleVideoClick = (videoId) => {
    navigate(`/video/${videoId}`); // Navigate to the video details page
  };

  const fetchResults = async (pageToken = null) => {
    try {
      const results = await searchYouTube(
        searchParams.query, // Use stored query parameter
        null, // No search type
        searchParams.sort,
        searchParams.uploadDate,
        searchParams.duration,
        pageToken, // Pass the continuation token
        searchParams.lang,
        searchParams.country
      );

      // Update the results and continuation token
      setAllResults(prevResults => [...prevResults, ...results.data]); // Append new results
      setContinuationToken(results.continuation); // Update the continuation token
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  useEffect(() => {
    if (searchParams.query) {
      fetchResults(); // Fetch results on component mount if query is present
    }
  }, [searchParams]);

  const handleNextPage = () => {
    if (continuationToken) {
      fetchResults(continuationToken); // Fetch next page using continuation token
      setCurrentPage(prev => prev + 1); // Increment the current page
      window.scrollTo(0, 0); // Scroll to the top of the page
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1); // Decrement the current page
      window.scrollTo(0, 0); // Scroll to the top of the page
    }
  };

  // Calculate the current results to display based on the current page
  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;
  const currentResults = allResults.slice(indexOfFirstResult, indexOfLastResult);

  return (
    <div className="container flex flex-col items-center justify-between min-h-screen p-4 font-sans text-gray-100 bg-gray-900">
      <div className="flex flex-row items-center justify-between w-full">
  {/* First div with logo and icon */}
  <div className="flex items-center m-2">
    <Youtube className="w-8 h-8 mx-2 mt-2 text-purple-400" />
    <span className="text-2xl font-bold text-purple-400">ytrendz</span>
  </div>

  {/* Second div with logout button */}
  <div className="m-2">
    <Button className="bg-purple-600 hover:bg-purple-700" onClick={logout}>
      Logout
    </Button>
  </div>
</div>
      <SearchBar setSearchParams={setSearchParams} setAllResults={setAllResults} />
      <div>
      <VideoList videos={currentResults} onVideoClick={handleVideoClick} />
      </div>
      <div className="flex justify-between mt-4 mb-4">
      <div className="flex justify-between mt-4">
        <Button className="ml-auto bg-purple-600 hover:bg-purple-700" onClick={handlePrevPage} disabled={currentPage === 1}>
          Previous
        </Button>
        <p className='mx-2 mt-1'>Page {currentPage}</p>
        <Button className="ml-auto bg-purple-600 hover:bg-purple-700" onClick={handleNextPage} disabled={!continuationToken}>
          Next
        </Button>
      </div>
      </div>
    </div>
  )
}

export default Dashboard
