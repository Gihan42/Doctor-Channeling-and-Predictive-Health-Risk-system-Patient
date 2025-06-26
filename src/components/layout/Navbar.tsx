import  { useState,useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
  MenuIcon,
  XIcon,
  HeartPulseIcon,
  LogOutIcon,
} from 'lucide-react'
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  // Mock authentication state - in a real app, use context or Redux
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])
  const handleLogout = () => {
    setIsLoggedIn(false)
    navigate('/')
  }
  return (
      <nav
          className={`bg-white border-b border-gray-100 fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'shadow-md py-1' : 'py-2'}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center group">
                <HeartPulseIcon className="h-8 w-8 text-teal-500 transition-transform duration-300 group-hover:scale-110" />
                <span className="ml-2 text-xl font-bold text-gray-800">
                MediCare
              </span>
              </Link>
            </div>
            {/* Desktop menu */}
            <div className="hidden md:flex md:items-center md:space-x-4">
              <Link
                  to="/"
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-300 ${location.pathname === '/' ? 'text-teal-600 bg-teal-50' : 'text-gray-600 hover:text-teal-500 hover:bg-teal-50'}`}
              >
                Home
              </Link>
              <Link
                  to="/chatbot"
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-300 ${location.pathname === '/chatbot' ? 'text-teal-600 bg-teal-50' : 'text-gray-600 hover:text-teal-500 hover:bg-teal-50'}`}
              >
                Health Assistant
              </Link>
              {isLoggedIn ? (
                  <>
                    <Link
                        to="/dashboard"
                        className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-300 ${location.pathname.includes('/dashboard') ? 'text-teal-600 bg-teal-50' : 'text-gray-600 hover:text-teal-500 hover:bg-teal-50'}`}
                    >
                      My Appointments
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-teal-500 hover:bg-teal-50 rounded-md transition-all duration-300"
                    >
                      <LogOutIcon className="h-4 w-4 mr-1" /> Logout
                    </button>
                  </>
              ) : (
                  <>
                    <Link
                        to="/login"
                        className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-300 ${location.pathname === '/login' ? 'text-teal-600 bg-teal-50' : 'text-gray-600 hover:text-teal-500 hover:bg-teal-50'}`}
                    >
                      Login
                    </Link>
                    <Link
                        to="/register"
                        className="px-3 py-2 text-sm font-medium text-white bg-gradient-to-r from-teal-400 to-teal-500 hover:from-teal-500 hover:to-teal-600 rounded-md shadow-sm transition-all duration-300 transform hover:scale-105"
                    >
                      Register
                    </Link>
                  </>
              )}
            </div>
            {/* Mobile menu button */}
            <div className="flex md:hidden">
              <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none transition-colors duration-300"
              >
                {isOpen ? (
                    <XIcon className="block h-6 w-6" />
                ) : (
                    <MenuIcon className="block h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
        {/* Mobile menu */}
        <div
            className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96' : 'max-h-0'}`}
        >
          <div className="pt-2 pb-3 space-y-1">
            <Link
                to="/"
                className={`block px-3 py-2 text-base font-medium rounded-md transition-all duration-300 ${location.pathname === '/' ? 'text-teal-600 bg-teal-50' : 'text-gray-600 hover:text-teal-500 hover:bg-teal-50'}`}
                onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
                to="/chatbot"
                className={`block px-3 py-2 text-base font-medium rounded-md transition-all duration-300 ${location.pathname === '/chatbot' ? 'text-teal-600 bg-teal-50' : 'text-gray-600 hover:text-teal-500 hover:bg-teal-50'}`}
                onClick={() => setIsOpen(false)}
            >
              Health Assistant
            </Link>
            {isLoggedIn ? (
                <>
                  <Link
                      to="/dashboard"
                      className={`block px-3 py-2 text-base font-medium rounded-md transition-all duration-300 ${location.pathname.includes('/dashboard') ? 'text-teal-600 bg-teal-50' : 'text-gray-600 hover:text-teal-500 hover:bg-teal-50'}`}
                      onClick={() => setIsOpen(false)}
                  >
                    My Appointments
                  </Link>
                  <button
                      onClick={() => {
                        handleLogout()
                        setIsOpen(false)
                      }}
                      className="w-full text-left flex items-center px-3 py-2 text-base font-medium text-gray-600 hover:text-teal-500 hover:bg-teal-50 transition-all duration-300"
                  >
                    <LogOutIcon className="h-5 w-5 mr-2" /> Logout
                  </button>
                </>
            ) : (
                <>
                  <Link
                      to="/login"
                      className={`block px-3 py-2 text-base font-medium rounded-md transition-all duration-300 ${location.pathname === '/login' ? 'text-teal-600 bg-teal-50' : 'text-gray-600 hover:text-teal-500 hover:bg-teal-50'}`}
                      onClick={() => setIsOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                      to="/register"
                      className="block px-3 py-2 mx-3 text-base font-medium text-white bg-gradient-to-r from-teal-400 to-teal-500 rounded-md transition-all duration-300 hover:from-teal-500 hover:to-teal-600"
                      onClick={() => setIsOpen(false)}
                  >
                    Register
                  </Link>
                </>
            )}
          </div>
        </div>
      </nav>
  )
}
export default Navbar
