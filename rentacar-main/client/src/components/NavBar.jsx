import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../features/user/userSlice'
import HamburgerMenu from './HamburgerMenu'

const NavBar = () => {
  const dispatch = useDispatch()
  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const handleLogout = () => {
    dispatch(logout())
  }

  return (
    <nav
      className={
        userInfo?.isAdmin
          ? 'hidden'
          : 'navbar flex items-center justify-between px-10 bg-neutral h-20'
      }
    >
      {/* Make RentMyRide unclickable for unapproved users */}
      {userInfo && !userInfo.AcStatus ? (
        <span
          className="text-2xl cursor-not-allowed opacity-50"
          style={{
            wordSpacing: '10px',
            fontFamily: 'fantasy',
            color: 'blueviolet',
            textShadow: '2px 2px 4px purple',
          }}
        >
          RentMyRide
        </span>
      ) : (
        <Link
          to="/"
          className="text-2xl"
          style={{
            wordSpacing: '10px',
            fontFamily: 'fantasy',
            color: 'blueviolet',
            textShadow: '2px 2px 4px purple',
          }}
        >
          RentMyRide
        </Link>
      )}

      {/* If AcStatus is false, show only Logout button */}
      {userInfo && !userInfo.AcStatus ? (
        <button
          onClick={handleLogout}
          className="btn btn-sm btn-outline btn-error"
        >
          Logout
        </button>
      ) : (
        <div className="hidden space-x-14 items-center md:flex">
          <Link to="/">Home</Link>
          <Link to="/cars">Cars</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          {userInfo ? (
            <Link
              to="/my-account"
              className="btn btn-sm btn-outline btn-secondary"
            >
              My Account
            </Link>
          ) : (
            <Link to="/sign-in" className="btn btn-sm btn-outline btn-secondary">
              Login
            </Link>
          )}
        </div>
      )}

      <HamburgerMenu />
    </nav>
  )
}

export default NavBar
