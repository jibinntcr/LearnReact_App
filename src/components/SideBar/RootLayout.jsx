import { useLocation } from "react-router-dom"

import Sidebar from "./SideBar"
import Footer from "../Footer/Footer"
import SideBarCusatech from "./SideBarCusatech"


function RootLayout({ children }) {
  const { pathname } = useLocation()
  return (
    <>
      <div className="flex">
        {(pathname.toLowerCase()).includes("cusatech") ? <SideBarCusatech /> : <Sidebar />}

        <main className="mt-10 flex-1 mx-auto ">{children}</main>
      </div>
      <Footer />
    </>
  )
}

export default RootLayout
