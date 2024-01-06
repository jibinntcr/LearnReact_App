import React, { useEffect, useState } from "react"
// import { FaFacebook } from "react-icons/fa"
import { BiX, BiMenuAltRight } from "react-icons/bi"
import { RiLogoutCircleRLine } from "react-icons/ri"
import { BsPersonCircle } from "react-icons/bs"
import "./AppbarStyles.css"

import { useLocation, useNavigate } from "react-router-dom"

import { useUserAuth } from "../../context/UserAuthContext"

import { Link } from "react-router-dom"

function Appbar({ mapScroll }) {
  const [isMobileBar, setIsMobileBar] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [path, setPath] = useState(false)
  const [cusatechPath, setCusatechPath] = useState(false)
  const position = 250
  const location = useLocation()
  const { logOut, user } = useUserAuth()

  const toggleMobileBar = () => {
    setIsMobileBar((value) => !value)
  }

  useEffect(() => {
    let name = location.pathname.split("/")

    setPath(name[1].toLowerCase())
    if (name.length > 2) {
      setCusatechPath(name[2].toLowerCase())
    } else {
      setCusatechPath(false)
    }
    setIsMobileBar(false)
  }, [location.pathname])

  // set when user is logged in

  useEffect(() => {
    if (user) {
      setIsLoggedIn(true)
      if (user.admin === true) {
        setIsAdmin(true)
      }
    } else {
      setIsLoggedIn(false)
      setIsAdmin(false)
    }
  }, [user])

  const navigate = useNavigate()
  const handleLogout = async () => {
    try {
      await logOut()
      setIsLoggedIn(false)
      navigate("/")
    } catch (error) {
      // console.log(error.message)
    }
  }

  return (
    <div className=" relative bg-white text-black z-[2000] box-border ">
      <div
        className={`${
          position >= 150 &&
          !isMobileBar &&
          `fixed w-full top-0 left-0 right-0 bottom-auto bg-white text-black drop-shadow-xl`
        } flex justify-between items-center py-4 px-3 z-[2000] border-b ${
          path === "sign-in" && position < 150
            ? `border-black/40`
            : `border-white/40`
        }`}
      >
        <Link to={"/"} className="flex items-center gap-x-1">
          {/* <img src={logoImg} alt="cusat tech" className="w-8 h-auto" /> */}
          <h1
            className={` text-base md:text-2xl font-bold text-black  hover:text-green-500 ${
              path === "sign-in" && position < 150 && `text-black`
            }`}
          >
            Centre for the Development of e-Content (CDeC)
          </h1>
        </Link>

        <div
          className={`md:hidden ${
            !isMobileBar && `hidden`
          } z-[2000] fixed top-0 right-0 left-auto bg-white/60 text-black text-6xl`}
          onClick={toggleMobileBar}
        >
          <BiX />
        </div>
        <div
          className={`text-2xl menu-list duration-500 md:transform-none md:w-fit ${
            (path === "login" || path === "signup") &&
            position < 150 &&
            `text-black`
          } ${
            isMobileBar && `transform-none text-black`
          } gap-y-3 md:gap-y-0 md:gap-x-3 lg:gap-x-6 md:text-lg font-bold flex flex-col md:flex-row ${
            !isMobileBar
              ? path !== "login" || path !== "signup"
                ? position < 150
                  ? `text-white`
                  : `text-black`
                : `text-black`
              : `text-black`
          }z-[2000] overflow-y-visible fixed md:relative bg-white  w-full h-full justify-center md:justify-between items-center inset-0 md:inset-auto`}
        >
          <Link
            to={"/"}
            className={`hover:text-green-500 text-black  text-xl${
              path === "" && `text-green-500`
            }`}
          >
            Home
          </Link>

          <Link
            to="/about"
            className={`hover:text-green-500 text-black ${
              path === "about" && `text-green-500`
            }`}
          >
            About
          </Link>
          <Link
            to="/courses"
            className={`hover:text-green-500 text-black ${
              path === "courses" && `text-green-500`
            }`}
          >
            Courses
          </Link>

          <Link
            to="/events"
            className={`hover:text-green-500 text-black ${
              path === "events" && `text-green-500`
            }`}
          >
            Events
          </Link>
          <Link
            to="/gallery"
            className={`hover:text-green-500 text-black ${
              path === "gallery" && `text-green-500`
            }`}
          >
            Gallery
          </Link>

          {isLoggedIn && isAdmin && (
            <Link
              to="/admin"
              className={`hover:text-green-500 text-black ${
                path === "admin" && `text-green-500`
              }`}
            >
              Admin Settings
            </Link>
          )}

          {isLoggedIn ? (
            <>
              <Link
                to="/profile"
                className={` rounded-full border-green-500 text-black font-bold hover:bg-green-500 hover:!text-white ${
                  path === "profile" && `text-green-500`
                }`}
              >
                <div className="flex py-2 mx-1 items-center">
                  <BsPersonCircle
                    title="This is a mouseover text!"
                    className="font-bold mr-1 "
                  />{" "}
                  Profile
                </div>{" "}
              </Link>
              <button
                onClick={handleLogout}
                className={` rounded-full border-green-500 text-black  font-bold hover:bg-green-500 hover:!text-white ${
                  path === "profile" && `text-green-500`
                }`}
              >
                <div className="flex py-2 mx-1 items-center">
                  <RiLogoutCircleRLine className="font-bold mr-1  " /> Logout
                </div>
              </button>
            </>
          ) : (
            <>
              <Link
                to="/sign-in"
                state={{ from: location.pathname }}
                className={`hover:text-green-500 text-black ${
                  path === "sign-in" && `text-green-500`
                }`}
              >
                Sign in / Sign up
              </Link>
            </>
          )}
        </div>
        <div
          className={`md:hidden font-bold text-3xl text-black ${
            (path === "login" || path === "sign-up") &&
            position < 150 &&
            `text-black`
          }`}
        >
          <BiMenuAltRight onClick={toggleMobileBar} />
        </div>
      </div>
    </div>
  )
}

export default Appbar
