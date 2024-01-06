import React, { useEffect } from "react"
import RootLayout from "../../../components/SideBar/RootLayout"
import Background from "./Background.svg"

function AdminHome() {
  useEffect(() => {
    window.scroll(0, 0)
  }, [])
  return (
    <RootLayout>
      <div
        className=" min-h-screen flex justify-center items-center"
        style={{ backgroundImage: `url(${Background})` }}
      >
        <div className="mt-2">
          <h1 className="text-4xl font-bold text-green-400 mb-6">
            Welcome to Admin Dashboard
          </h1>
          <p className="text-gray-800 font-semibold text-2xl mb-4">
            Hello, Admin!
          </p>
          <p className="text-gray-600 text-xl">
            You have access to powerful tools and features.
          </p>
        </div>
      </div>
    </RootLayout>
  )
}

export default AdminHome
