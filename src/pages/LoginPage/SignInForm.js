import React, { useEffect, useState } from "react"

//import GoogleButton from "react-google-button"
import { useUserAuth } from "../../context/UserAuthContext"
import { useNavigate, useLocation } from "react-router-dom"

function SignInForm() {
  const location = useLocation()
  const [path, setPath] = useState("")

  useEffect(() => {
    let name = location.pathname.split("/sign-in")
    setPath(name[1])
  }, [location.pathname])

  const navigate = useNavigate()
  const { googleSignIn } = useUserAuth()

  const handleGoogleSignIn = async (e) => {
    e.preventDefault()
    try {
      await googleSignIn()

      if (path !== "") {
        navigate(`${path}`)
      } else {
        navigate("/")
      }
    } catch (error) {
      // console.log(error.message)
    }
  }

  return (
    <>
      <h1 className=" text-green-600 font-sans text-3xl font-bold mt-8">
        Welcome
      </h1>
      <p className="text-center text-lg mt-2">
        You can login or sign up with academic email if you're a cusat student.
        For other members, use your Google account.
      </p>
      <hr className="w-5/6 text-black m-2 border-gray-400" />
      <div className="mt-2 flex w-full flex-col items-center">
        <button
          type="button"
          className="text-white bg-primary  focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2   focus:outline-none "
          onClick={handleGoogleSignIn}
        >
          CUSAT STUDENTS
        </button>

        <button
          type="button"
          className="text-white bg-primary  focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2   focus:outline-none "
          onClick={handleGoogleSignIn}
        >
          NON-CUSAT STUDENTS
        </button>

        <button
          type="button"
          className="text-white bg-primary focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2   focus:outline-none "
          onClick={handleGoogleSignIn}
        >
          OTHERS
        </button>

        <hr className="w-5/6 text-black m-2 border-gray-400" />
        <p>
          <ul className="text-xs mt-3 marker:text-green-400 list-disc">
            <li>
              Cusat students - Use your academic email to sign up also
              DigiLocker ID and ABC ID are mandatory
            </li>
            <li>Non Cusat Students - ABC ID mandatory</li>
            <li>
              Others - Those who wish to pursue the course with authorised
              certificates
            </li>
          </ul>
        </p>
      </div>
    </>
  )
}

export default SignInForm
