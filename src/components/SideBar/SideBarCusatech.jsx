import React, { useEffect, useState, useRef } from "react"
// * React router
import { Link, useLocation, useRoutes } from "react-router-dom"

import SubMenu from "./SubMenu"
import { motion } from "framer-motion"

// * React icons
import { IoIosArrowBack } from "react-icons/io"
import { CgTemplate } from "react-icons/cg"
import { HiOutlineBuildingOffice2 } from "react-icons/hi2"
import { VscHome } from "react-icons/vsc"
import { TfiWrite } from "react-icons/tfi"
import { AiFillSetting } from "react-icons/ai"
import { LiaChalkboardTeacherSolid } from "react-icons/lia"
import { BsViewList, BsCalendarEvent } from "react-icons/bs"
import { GoProjectSymlink } from "react-icons/go"
import { TbReport, TbHomeRibbon } from "react-icons/tb"
import { RiGalleryFill } from "react-icons/ri"
import { useMediaQuery } from "react-responsive"
import { MdMenu } from "react-icons/md"
import { GiToggles } from "react-icons/gi"
import { BiUser } from "react-icons/bi"
import { FaLink } from "react-icons/fa6"

const SideBarCusatech = ({ mainContent }) => {
  let isTabletMid = useMediaQuery({ query: "(max-width: 768px)" })
  const [open, setOpen] = useState(isTabletMid ? false : true)
  const sidebarRef = useRef()
  const { pathname } = useLocation()

  useEffect(() => {
    if (isTabletMid) {
      setOpen(false)
    } else {
      setOpen(true)
    }
  }, [isTabletMid])

  useEffect(() => {
    isTabletMid && setOpen(false)
  }, [pathname])

  const Nav_animation = isTabletMid
    ? {
        open: {
          x: 0,
          width: "16rem",
          transition: {
            damping: 40,
          },
        },
        closed: {
          x: -250,
          width: 0,
          transition: {
            damping: 40,
            delay: 0.15,
          },
        },
      }
    : {
        open: {
          width: "16rem",
          transition: {
            damping: 40,
          },
        },
        closed: {
          width: "4rem",
          transition: {
            damping: 40,
          },
        },
      }

  const subMenusList = [
    {
      name: "Home page",
      icon: TbHomeRibbon,
      highlight: "homepageEdit",
      menus: [
        {
          name: "Edit texts, images ",
          link: "homepageEdit/cusatech",
        },
        {
          name: "Select event To Display",
          link: "/cusatech/admin/homepageEdit/SelectEventCusatech",
        },
        {
          name: "Select Course To Display",
          link: "/cusatech/admin/homepageEdit/batchDisplayHomeSelect/cusatech",
        },
      ],
    },
    {
      name: "GALLERY",
      icon: RiGalleryFill,
      highlight: "Gallery",
      menus: [
        {
          name: "Add Image",
          link: "/cusatech/admin/Gallery/AddImage",
        },
        {
          name: "Delete Image ",
          link: "/cusatech/admin/Gallery/DeleteImage",
        },
      ],
    },
    {
      name: "EVENT",
      icon: BsCalendarEvent,
      highlight: "event",
      menus: [
        {
          name: "Create event ",
          link: "/cusatech/admin/event/addEvent",
        },
        {
          name: "Delete Event",
          link: "/cusatech/admin/event/DeleteEvent",
        },
      ],
    },
    {
      name: "Dept / School",
      icon: HiOutlineBuildingOffice2,
      highlight: "Departments",
      menus: [
        {
          name: "Create Department/School ",
          link: "/cusatech/admin/Departments/CreateDepartments",
        },
        {
          name: "Create Course",
          link: "/admin/Departments/SelectDepartments/cusatech",
        },
      ],
    },
    {
      name: "Faculty",
      icon: LiaChalkboardTeacherSolid,
      highlight: "Faculty",
      menus: [
        {
          name: "Create Faculty",
          link: "/cusatech/admin/Faculty/addFaculty",
        },
        {
          name: "View Faculties ",
          link: "/cusatech/admin/Faculty/viewFaculty",
        },
      ],
    },
    {
      name: "Users",
      icon: BiUser,
      highlight: "User",
      menus: [
        {
          name: "View User ",
          link: "/cusatech/admin/User/view",
        },
      ],
    },
    {
      name: "Batch",
      icon: BsViewList,
      highlight: "/batch/",
      menus: [
        {
          name: "Create Batch",
          link: "/cusatech/admin/batch/createBatch",
        },
        {
          name: "GST Value",
          link: "/cusatech/admin/batch/GstValue",
        },
        {
          name: "Change Batch",
          link: "/cusatech/admin/batch/changeBatch",
        },
      ],
    },
    {
      name: "COURSES",
      icon: CgTemplate,
      highlight: "Course",
      menus: [
        {
          name: "AllCourses",
          link: "/cusatech/admin/CUSATECH/Course/AllCourses",
        },
        {
          name: "Create Course",
          link: "/cusatech/admin/CUSATECH/Course/CreateCourse",
        },
        {
          name: "Update Course",
          link: "/cusatech/admin/Course/cusatech/Update",
        },
      ],
    },
    {
      name: "SCHEDULE",
      icon: GoProjectSymlink,
      highlight: "Schedule",
      menus: [
        {
          name: "Scheduled Courses list - (not done)",
          link: "/cusatech/admin/Schedule/List/cusatech",
        },
        {
          name: "Schedule new course",
          link: "/cusatech/admin/Schedule/cusatech",
        },
        {
          name: "Delete Schedule course (don't use)",
          link: "/admin/Delete/cdec",
        },
        {
          name: "Update Schedule Course ",
          link: "/cusatech/admin/Schedule/cusatech/Update",
        },
      ],
    },
    {
      name: "Update Status",
      icon: GiToggles,
      highlight: "UpdateState",
      menus: [
        {
          name: "Scheduled course status - (not updated)",
          link: "/cusatech/admin/UpdateState/cusatech",
        },
      ],
    },

    {
      name: "Grading",
      icon: TfiWrite,
      highlight: "Grading",
      menus: [
        {
          name: "Grading scheduled course ",
          link: "/cusatech/admin/Grading/cusatech",
        },
      ],
    },
    {
      name: "REPORT",
      icon: TbReport,
      highlight: "REPORT",
      menus: [
        {
          name: "Generate report",
          link: "/cusatech/admin/Report/cusatech",
        },
        {
          name: "Payment Report",
          link: "/cusatech/admin/Report/payment",
        },
      ],
    },
  ]

  return (
    <>
      <div className="  flex mt-10 ">
        <>
          <div
            onClick={() => setOpen(false)}
            className={`md:hidden fixed inset-0  z-10 bg-black/50 ${
              open ? "block" : "hidden"
            } `}
          ></div>
          <motion.div
            ref={sidebarRef}
            variants={Nav_animation}
            initial={{ x: isTabletMid ? -250 : 0 }}
            animate={open ? "open" : "closed"}
            className="  text-gray shadow-xl z-[999] max-w-[16rem]  w-[16rem] 
             md:relative fixed
             min-h-screen"
          >
            <div className="flex justify-center items-end  mt-5 gap-2.5 font-medium  py-3 border-slate-300  mx-3">
              <AiFillSetting className="" size={40} alt="" />
              <span className="text-xl flex-1 text-black font-semibold mt-5 overflow-x-hidden">
                Cusatech Settings{" "}
              </span>
            </div>

            <div className="flex flex-col  h-full">
              <ul className="whitespace-pre px-2.5 text-[0.9rem] py-5 flex flex-col gap-1  font-medium overflow-x-hidden scrollbar-thin scrollbar-track-white scrollbar-thumb-slate-100   md:h-[68%] h-[70%]">
                <li key={"Home"}>
                  <Link
                    to={"/cusatech/admin"}
                    className={`link text-black ${
                      pathname.toLowerCase() === "/cusatech/admin" &&
                      "text-green-600"
                    }`}
                  >
                    <VscHome size={23} className="min-w-max" />
                    Home
                  </Link>
                </li>
                <li key={"apps"}>
                  <Link to={"/admin"} className="link text-black">
                    <FaLink size={23} className="min-w-max" />
                    Cdec Settings
                  </Link>
                </li>

                {/* <li>
                  <NavLink to={"/"} className="link">
                    <AiOutlineAppstore size={23} className="min-w-max" />
                    All Apps
                  </NavLink>
                </li>
                <li>
                  <NavLink to={"/authentication"} className="link">
                    <BsPerson size={23} className="min-w-max" />
                    Authentication
                  </NavLink>
                </li>
                <li>
                  <NavLink to={"/stroage"} className="link">
                    <HiOutlineDatabase size={23} className="min-w-max" />
                    Stroage
                  </NavLink>
                </li> */}
                <li key={3}>
                  {(open || isTabletMid) && (
                    <div className="border-y py-5 border-slate-300 ">
                      {/* <small className="pl-3 text-slate-500 inline-block mb-2">
                      Product categories
                    </small> */}
                      {subMenusList?.map((menu) => (
                        <div key={menu.name} className="flex flex-col gap-1">
                          <SubMenu data={menu} />
                        </div>
                      ))}
                    </div>
                  )}
                </li>
                {/* <li>
                  <NavLink to={"/settings"} className="link">
                    <AiFillSetting size={23} className="min-w-max" />
                    Settings
                  </NavLink>
                </li> */}
              </ul>
              {/* {open && (
                <div className="flex-1 text-sm z-50  max-h-48 my-auto  whitespace-pre   w-full  font-medium  ">
                  <div className="flex border-y border-slate-300 p-4 items-center justify-between">
                    <div>
                      <p>Spark</p>
                      <small>No-cost $0/month</small>
                    </div>
                    <p className="text-teal-500 py-1.5 px-3 text-xs bg-teal-50 rounded-xl">
                      Upgrade
                    </p>
                  </div>
                </div>
              )} */}
            </div>
            <motion.div
              onClick={() => {
                setOpen(!open)
              }}
              animate={
                open
                  ? {
                      x: 0,
                      y: 0,
                      rotate: 0,
                    }
                  : {
                      x: -10,
                      y: -200,
                      rotate: 180,
                    }
              }
              transition={{ duration: 0 }}
              className="absolute w-fit h-fit md:block z-50 hidden right-2 bottom-3 cursor-pointer"
            >
              <IoIosArrowBack size={25} />
            </motion.div>
          </motion.div>
          <div className="m-3  md:hidden  " onClick={() => setOpen(true)}>
            <MdMenu size={25} />
          </div>
        </>
        <div className="container  mt-0">{mainContent}</div>
      </div>
    </>
  )
}

export default SideBarCusatech
