import React from "react"
//context
import { useUserAuth } from "../../context/UserAuthContext"

import { useNavigate } from "react-router-dom"

function Signup() {
  const navigate = useNavigate()

  const { user, logOut } = useUserAuth()

  const { cusatFlag, email, displayName, photoURL } = user

  const handleLogout = async () => {
    try {
      await logOut()

      navigate("/")
    } catch (error) {
      // console.log(error.message)
    }
  }

  return (
    <>
      <div className="mt-16 h-screen pt-12 bg-gray-100">
        <div className="bg-white shadow rounded-lg md:mx-8   mx-2 mb-5   p-10">
          <div className="flex flex-col gap-1 text-center items-center">
            <p className="text-sm md:text-xl text-green-400 font-semibold mb-3 md:mb-1">
              Welcome , You successfully created an account{" "}
            </p>
            {user && user.photoURL.length > 0 ? (
              <img
                className="h-20 w-20 md:h-32 md:w-32 bg-gray-100 p-2 rounded-full shadow mb-4"
                src={photoURL}
                alt={displayName}
              />
            ) : (
              <div className="h-32 w-32 bg-gray-100 p-2 flex items-center justify-center rounded-full shadow mb-4">
                {displayName}
              </div>
            )}

            {cusatFlag && (
              <span className="p-1.5 text-xs font-medium uppercase tracking-wider text-green-800 bg-green-200 rounded-lg bg-opacity-50">
                Cusat Student
              </span>
            )}

            <ul className="flex flex-col pl-0 mb-0 rounded-lg">
              <li className="relative block px-4 py-2 pt-0 pl-0 leading-normal bg-white border-0 rounded-t-lg text-size-sm text-inherit">
                <strong className="text-slate-700">Full Name:</strong> &nbsp;{" "}
                {displayName}
              </li>

              <li className="relative block px-4 py-2 pl-0 leading-normal bg-white border-0 border-t-0 text-size-sm text-inherit">
                <strong className="text-slate-700">Email:</strong> &nbsp;{" "}
                {email}
              </li>
            </ul>
          </div>
          <div className="flex justify-center items-center gap-2 mt-4">
            <button
              onClick={handleLogout}
              type="button"
              class="text-gray-900 bg-gradient-to-r from-red-200 via-red-300 to-yellow-200 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-red-100 dark:focus:ring-red-400 font-bold rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
            >
              {" "}
              Login now{" "}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Signup
