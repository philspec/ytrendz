import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { searchYouTube } from '@/lib/youtube'

const SearchBar = ({ setSearchParams, setAllResults }) => {
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState('relevance'); // New state for sort
  const [uploadDate, setUploadDate] = useState('anytime'); // New state for upload date
  const [duration, setDuration] = useState('any'); // New state for duration
  const [lang, setLang] = useState('en'); // New state for language
  const [country, setCountry] = useState('IN'); // New state for country

  const handleSearch = async (e) => {
    e.preventDefault()
    try {
      const results = await searchYouTube(query, null, sort, uploadDate, duration, null, lang, country);
      setSearchParams({ query, sort, uploadDate, duration, lang, country }); // Store search parameters
      setAllResults(results.data); // Set all results for pagination
      console.log(results.data)
    } catch (error) {
      console.error('Error searching YouTube:', error)
      alert('Failed to search YouTube. Please try again.')
    }
  }

  return (
    <form onSubmit={handleSearch} className='flex flex-col items-center justify-center'>
      <div className="flex flex-row justify-between flex-grow w-full my-2">
      <Input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search YouTube"
        className="flex-grow mr-2"
      />
      <Button className="flex-grow ml-auto bg-purple-600 hover:bg-purple-700" type="submit">Search</Button>
      </div>
      <div className="flex mb-4 space-x-2">
      <select
        value={sort}
        onChange={(e) => setSort(e.target.value)}
        className="p-2 bg-gray-900 border rounded-md"
      >
        <option value="relevance">Sort by Relevance</option>
        <option value="views">Sort by View Count</option>
        <option value="date">Sort by Date</option>
      </select>
      <select
        value={uploadDate}
        onChange={(e) => setUploadDate(e.target.value)}
        className="p-2 bg-gray-900 border rounded-md"
      >
        <option value="anytime">Anytime</option>
        <option value="hour">Last Hour</option>
        <option value="today">Today</option>
        <option value="week">This Week</option>
        <option value="month">This Month</option>
        <option value="year">This Year</option>
      </select>
      <select
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
        className="p-2 bg-gray-900 border rounded-md"
      >
        <option value="any">Any Duration</option>
        <option value="short">Short (less than 4 min)</option>
        <option value="medium">Medium (4 to 20 min)</option>
        <option value="long">Long (more than 20 min)</option>
      </select>
      <select
        value={lang}
        onChange={(e) => setLang(e.target.value)}
        className="p-2 bg-gray-900 border rounded-md"
      >
        <option value="en">English</option>
        <option value="hi">Hindi</option>
        <option value="es">Spanish</option>
        <option value="fr">French</option>
        {/* Add more languages as needed */}
      </select>
      <select
        value={country}
        onChange={(e) => setCountry(e.target.value)}
        className="p-2 bg-gray-900 border rounded-md"
      >
        <option value="IN">India</option>
        <option value="US">United States</option>
        <option value="GB">United Kingdom</option>
        {/* Add more countries as needed */}
      </select>
      
      </div>
    </form>
  )
}

export default SearchBar
