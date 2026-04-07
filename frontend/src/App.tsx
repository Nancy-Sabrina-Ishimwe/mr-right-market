import { useContext, useEffect, useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Store } from './Store'
import { useGetCategoriesQuery } from './hooks/productHooks'
import LoadingBox from './components/LoadingBox'
import MessageBox from './components/MessageBox'
import { getError } from './utils'
import { ApiError } from './types/ApiError'
import SearchBox from './components/SearchBox'

function App() {
  const {
    state: { mode, cart, userInfo },
    dispatch,
  } = useContext(Store)

  // Apply theme to document
  useEffect(() => {
    if (mode === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [mode])

  const switchModeHandler = () => {
    dispatch({ type: 'SWITCH_MODE' })
  }

  const signoutHandler = () => {
    dispatch({ type: 'USER_SIGNOUT' })
    localStorage.removeItem('userInfo')
    localStorage.removeItem('cartItems')
    localStorage.removeItem('shippingAddress')
    localStorage.removeItem('paymentMethod')
    window.location.href = '/signin'
  }

  const [sidebarIsOpen, setSidebarIsOpen] = useState(false)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)

  const { data: categories, isLoading, error } = useGetCategoriesQuery()

  return (
    <div className="flex flex-col h-screen">
      <ToastContainer position="bottom-center" limit={1} />

      {/* Header */}
      <header>
        <nav className="bg-gray-900 dark:bg-gray-950 text-white p-2 pb-0 mb-3 flex flex-col items-stretch">
          {/* Top row: logo, search, right icons */}
          <div className="flex justify-between items-center">
            <Link to="/" className="text-white text-xl font-bold no-underline">
              amazona
            </Link>

            <SearchBox />

            {/* Right side nav items */}
            <div className="flex items-center space-x-4">
              {/* Dark/Light toggle */}
              <button
                onClick={switchModeHandler}
                className="text-white hover:text-gray-300"
              >
                <i className={mode === 'light' ? 'fa fa-sun' : 'fa fa-moon'}></i>
                <span className="ml-1">{mode === 'light' ? 'Light' : 'Dark'}</span>
              </button>

              {/* User dropdown (custom) */}
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="text-white hover:text-gray-300 flex items-center"
                >
                  <i className="fas fa-user mr-1"></i>
                  {userInfo ? `Hello, ${userInfo.name}` : 'Hello, sign in'}
                  <i className="fas fa-chevron-down ml-1 text-xs"></i>
                </button>
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-20">
                    {userInfo ? (
                      <>
                        <Link
                          to="/profile"
                          className="block px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={() => setUserDropdownOpen(false)}
                        >
                          User Profile
                        </Link>
                        <Link
                          to="/orderhistory"
                          className="block px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={() => setUserDropdownOpen(false)}
                        >
                          Order History
                        </Link>
                        <hr className="my-1" />
                        <button
                          onClick={signoutHandler}
                          className="block w-full text-left px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          Sign Out
                        </button>
                      </>
                    ) : (
                      <Link
                        to="/signin"
                        className="block px-4 py-2 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        Sign In
                      </Link>
                    )}
                  </div>
                )}
              </div>

              {/* Orders link */}
              <Link to="/orderhistory" className="text-white hover:text-gray-300">
                Orders
              </Link>

              {/* Cart icon with badge */}
              <Link to="/cart" className="text-white hover:text-gray-300 relative flex items-center">
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-1 min-w-[1.25rem] text-center">
                  {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                </span>
                <svg
                  fill="currentColor"
                  viewBox="130 150 200 300"
                  width="32px"
                  height="32px"
                  className="mr-1"
                >
                  <path d="M 110.164 188.346 C 104.807 188.346 100.437 192.834 100.437 198.337 C 100.437 203.84 104.807 208.328 110.164 208.328 L 131.746 208.328 L 157.28 313.233 C 159.445 322.131 167.197 328.219 176.126 328.219 L 297.409 328.219 C 306.186 328.219 313.633 322.248 315.951 313.545 L 341.181 218.319 L 320.815 218.319 L 297.409 308.237 L 176.126 308.237 L 150.592 203.332 C 148.426 194.434 140.675 188.346 131.746 188.346 L 110.164 188.346 Z M 285.25 328.219 C 269.254 328.219 256.069 341.762 256.069 358.192 C 256.069 374.623 269.254 388.165 285.25 388.165 C 301.247 388.165 314.431 374.623 314.431 358.192 C 314.431 341.762 301.247 328.219 285.25 328.219 Z M 197.707 328.219 C 181.711 328.219 168.526 341.762 168.526 358.192 C 168.526 374.623 181.711 388.165 197.707 388.165 C 213.704 388.165 226.888 374.623 226.888 358.192 C 226.888 341.762 213.704 328.219 197.707 328.219 Z M 197.707 348.201 C 203.179 348.201 207.434 352.572 207.434 358.192 C 207.434 363.812 203.179 368.183 197.707 368.183 C 192.236 368.183 187.98 363.812 187.98 358.192 C 187.98 352.572 192.236 348.201 197.707 348.201 Z M 285.25 348.201 C 290.722 348.201 294.977 352.572 294.977 358.192 C 294.977 363.812 290.722 368.183 285.25 368.183 C 279.779 368.183 275.523 363.812 275.523 358.192 C 275.523 352.572 279.779 348.201 285.25 348.201 Z" />
                </svg>
                <span>Cart</span>
              </Link>
            </div>
          </div>

          {/* Sub-header: All categories + static links */}
          <div className="mt-2">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarIsOpen(!sidebarIsOpen)}
                className="text-white hover:text-gray-300 flex items-center"
              >
                <i className="fas fa-bars mr-1"></i> All
              </button>
              {['Todays Deal', 'Gifts', 'On Sale'].map((x) => (
                <Link
                  key={x}
                  to={`/search?tag=${x}`}
                  className="text-white hover:text-gray-300 px-3"
                >
                  {x}
                </Link>
              ))}
            </div>
          </div>
        </nav>
      </header>

      {/* Sidebar backdrop */}
      {sidebarIsOpen && (
        <div
          onClick={() => setSidebarIsOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
        ></div>
      )}

      {/* Sidebar navigation */}
      <div
        className={`fixed top-0 left-0 h-full bg-white dark:bg-gray-900 shadow-lg z-40 w-72 transform transition-transform duration-300 flex flex-col justify-between ${
          sidebarIsOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          <div className="p-4 border-b dark:border-gray-700 side-navbar-user">
            <Link
              to={userInfo ? '/profile' : '/signin'}
              onClick={() => setSidebarIsOpen(false)}
              className="block font-semibold"
            >
              {userInfo ? `Hello, ${userInfo.name}` : 'Hello, sign in'}
            </Link>
          </div>
          <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
            <strong>Categories</strong>
            <button
              onClick={() => setSidebarIsOpen(false)}
              className="text-gray-600 dark:text-gray-300"
            >
              <i className="fa fa-times"></i>
            </button>
          </div>
          <div className="overflow-y-auto">
            {isLoading ? (
              <LoadingBox />
            ) : error ? (
              <MessageBox variant="danger">
                {getError(error as ApiError)}
              </MessageBox>
            ) : (
              categories!.map((category) => (
                <Link
                  key={category}
                  to={{ pathname: '/search', search: `category=${category}` }}
                  onClick={() => setSidebarIsOpen(false)}
                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  {category}
                </Link>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1">
        <div className="container mx-auto px-4 mt-3">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-4 border-t dark:border-gray-700">
        All rights reserved
      </footer>
    </div>
  )
}

export default App