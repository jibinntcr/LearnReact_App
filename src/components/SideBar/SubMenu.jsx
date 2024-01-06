import React, { useState } from "react"
import { motion } from "framer-motion"
import { IoIosArrowDown } from "react-icons/io"
import { Link, useLocation } from "react-router-dom"
import { VscCircleFilled } from "react-icons/vsc"

const SubMenu = ({ data }) => {
  const { pathname } = useLocation()
  const [subMenuOpen, setSubMenuOpen] = useState(false)
  return (
    <>
      <li
        key={"1"}
        className={`link ${
          pathname.toLowerCase().includes((data?.highlight).toLowerCase()) &&
          "text-green-600"
        }`}
        // need to fix
        onClick={() => setSubMenuOpen(!subMenuOpen)}
      >
        <data.icon size={23} className="min-w-max" />
        <p
          className={`flex-1 uppercase  ${
            pathname.toLowerCase().includes((data?.highlight).toLowerCase()) &&
            "text-green-600"
          }`}
        >
          {data.name}
        </p>
        <IoIosArrowDown
          className={` ${subMenuOpen && "rotate-180"} duration-200 `}
        />
      </li>
      <motion.ul
        animate={
          subMenuOpen
            ? {
                height: "fit-content",
              }
            : {
                height: 0,
              }
        }
        className="flex h-0 flex-col pl-5 text-[0.8rem] font-normal overflow-hidden"
      >
        {data.menus?.map((menu, index) => (
          <li key={index} className="flex justify-start">
            {/* className="hover:text-blue-600 hover:font-medium" */}
            <Link
              // to={`/${data.name}/${menu}`}
              to={menu.link}
              className="link !bg-transparent text-black capitalize"
            >
              <VscCircleFilled /> {menu.name}
            </Link>
          </li>
        ))}
      </motion.ul>
    </>
  )
}

export default SubMenu
