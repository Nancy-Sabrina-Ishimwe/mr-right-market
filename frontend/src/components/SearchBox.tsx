import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function SearchBox() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  const submitHandler = (e: React.SyntheticEvent) => {
    e.preventDefault()
    navigate(query ? `/search?query=${query}` : '/search')
  }

  return (
    <form onSubmit={submitHandler} className="flex-grow max-w-md mx-4">
      <div className="relative flex items-center">
        <input
          type="text"
          name="q"
          id="q"
          placeholder="Search products..."
          aria-label="Search products"
          className="w-full px-4 py-2 pr-12 border border-gray-300 dark:border-gray-600 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          type="submit"
          aria-label="Search"
          className="absolute right-0 top-0 h-full px-4 bg-gray-100 dark:bg-gray-600 border border-gray-300 dark:border-gray-600 border-l-0 rounded-r-md hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors"
        >
          <i className="fas fa-search text-gray-600 dark:text-gray-200"></i>
        </button>
      </div>
    </form>
  )
}