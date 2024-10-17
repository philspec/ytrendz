import { create } from 'zustand'

const useStore = create((set) => ({
  user: null,
  selectedVideos: [],
  searchResults: [],
  setUser: (user) => set({ user }),
  setSelectedVideos: (videos) => set({ selectedVideos: videos }),
  setSearchResults: (results) => set({ searchResults: results }),
}))

export default useStore