import React, { useEffect, useState } from "react"
import { BsArrowRight, BsFillBookmarkFill, BsPlus } from "react-icons/bs"
import { Link, useLocation } from "react-router-dom"
import Footer from "../../components/Footer/Footer"
import "./stye.css"

export default function Sidebar2({ mainContent }) {
  const [Route, setRoute] = useState()
  const location = useLocation()
  let name = location.pathname.split("/")
  useEffect(() => {
    window.scroll(0, 0)
    setRoute(name[1].toLowerCase())
    // console.log("location:" + name[1])
  }, [])

  return (
    <>
      <div className="flex mt-14">
        <aside className="w-full  p-6 sm:w-60 bg-green-900 text-gray-100 ">
          <nav className="space-y-8 mt-8 text-BASE ">
            <div className="space-y-2">
              <h2>
                {" "}
                <p className="mb-2 mt-4 font-bold text-xl text-gray-100 flex uppercase items-center ">
                  {" "}
                  <BsArrowRight className=" mr-1 " /> Galley
                </p>{" "}
              </h2>

              <ul className="flex flex-col ml-5 space-y-3 list-disc marker:text-sky-400">
                <li>
                  <Link
                    className="hover:text-sky-500"
                    to="/admin/Gallery/AddImage"
                  >
                    Add Image{" "}
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <h2>
                {" "}
                <p className="mb-2 mt-4 font-bold text-xl text-gray-100 flex uppercase items-center ">
                  {" "}
                  <BsFillBookmarkFill className=" mr-1 " /> Event
                </p>{" "}
              </h2>

              <ul className="flex flex-col ml-5 space-y-3 list-disc marker:text-sky-400 ">
                <li className="font-mono">
                  <Link
                    className="hover:text-sky-500"
                    to="/admin/event/addEvent"
                  >
                    Create event{" "}
                  </Link>
                </li>

                <li>
                  <Link
                    className="hover:text-sky-500"
                    to="/admin/event/DeleteEvent"
                  >
                    Delete Event{" "}
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <h2>
                {" "}
                <p className="mb-2 mt-4 font-bold text-xl text-gray-100 flex uppercase items-center ">
                  {" "}
                  <BsArrowRight className=" mr-1 " /> Faculty
                </p>{" "}
              </h2>

              <ul className="flex flex-col ml-5 space-y-3 list-disc marker:text-sky-400">
                <li>
                  <Link
                    className="hover:text-sky-500"
                    to="/admin/event/addFaculty"
                  >
                    Create Faculty{" "}
                  </Link>
                </li>
                <li>
                  <Link
                    className="hover:text-sky-500"
                    to="/admin/event/viewFaculty"
                  >
                    View Faculties{" "}
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <h2>
                {" "}
                <p className="mb-2 mt-4 font-bold text-xl text-gray-100 flex uppercase items-center ">
                  {" "}
                  <BsArrowRight className=" mr-1 " /> Departments
                </p>{" "}
              </h2>

              <ul className="flex flex-col ml-5 space-y-3 list-disc marker:text-sky-400">
                <li>
                  <Link
                    className="hover:text-sky-500"
                    to="/admin/Departments/CreateDepartments"
                  >
                    Create Departments{" "}
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <h2>
                {" "}
                <p className="mb-2 mt-4 font-bold text-xl text-gray-100 flex uppercase items-center ">
                  {" "}
                  <BsArrowRight className=" mr-1 " /> Batch
                </p>{" "}
              </h2>
              <ul className="flex flex-col ml-5 space-y-3 list-disc marker:text-sky-400">
                <li>
                  <Link
                    className="hover:text-sky-500"
                    to="/admin/batch/createBatch"
                  >
                    Create Batch
                  </Link>
                </li>
                <li>
                  <Link
                    className="hover:text-sky-500"
                    to="/admin/batch/changeBatch"
                  >
                    Change Batch
                  </Link>
                </li>
              </ul>
            </div>
            {/* {cdec sidebar details starts} */}

            <div className="space-y-2">
              <h2 className="text-3xl font-extrabold text-center  hover:text-white tracking-widest uppercase ">
                {" "}
                CDeC
                <br />
                <p className="my-2 font-bold text-xl text-gray-100 flex items-center ">
                  {" "}
                  <BsArrowRight className=" mr-1 " /> COURSES
                </p>{" "}
              </h2>
              <ul className="flex flex-col ml-5 space-y-3 list-disc marker:text-sky-400">
                <li>
                  <Link
                    className="hover:text-sky-500"
                    to="/admin/CDEC/Course/AllCourses"
                  >
                    AllCourses
                  </Link>
                </li>
                <li>
                  <Link
                    className="hover:text-sky-500"
                    to="/admin/CDEC/Course/CreateCourse"
                  >
                    Create Course
                  </Link>
                </li>
                <li>
                  <Link
                    className="hover:text-sky-500"
                    to="/admin/Course/cdec/Update"
                  >
                    Update Course
                  </Link>
                </li>
              </ul>

              <div className="space-y-2">
                <h2>
                  {" "}
                  <p className="mb-2 mt-4 font-bold text-xl text-gray-100 flex uppercase items-center ">
                    {" "}
                    <BsArrowRight className=" mr-1 " /> SCHEDULE COURSE
                  </p>{" "}
                </h2>

                <ul className="flex flex-col ml-5 space-y-3 list-disc marker:text-sky-400">
                  <li>
                    <Link
                      className="hover:text-sky-500"
                      to="/admin/Schedule/cdec"
                    >
                      {" "}
                      Schedule new course
                    </Link>
                  </li>
                </ul>
                <ul className="flex flex-col ml-5 space-y-3 list-disc marker:text-sky-400">
                  <li>
                    <Link
                      className="hover:text-sky-500"
                      to="/admin/Delete/cdec"
                    >
                      {" "}
                      Delete Schedule course
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="space-y-2">
                <h2>
                  {" "}
                  <p className="mb-2 mt-4 font-bold text-xl text-gray-100 flex uppercase items-center ">
                    {" "}
                    <BsArrowRight className=" mr-1 " /> Update Status
                  </p>{" "}
                </h2>

                <ul className="flex flex-col ml-5 space-y-3 list-disc marker:text-sky-400">
                  <li>
                    <Link
                      className="hover:text-sky-500"
                      to="/admin/UpdateState/CDeC"
                    >
                      {" "}
                      Update schedule course status
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="space-y-2">
                <h2>
                  {" "}
                  <p className="mb-2 mt-4 font-bold text-xl text-gray-100 flex uppercase items-center ">
                    {" "}
                    <BsArrowRight className=" mr-1 " /> Grading
                  </p>{" "}
                </h2>

                <ul className="flex flex-col ml-5 space-y-3 list-disc marker:text-sky-400">
                  <li>
                    <Link
                      className="hover:text-sky-500"
                      to="/admin/Grading/cdec"
                    >
                      {" "}
                      Grading course
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="space-y-2">
                <h2>
                  {" "}
                  <p className="mb-2 mt-4 font-bold text-xl text-gray-100 flex uppercase items-center ">
                    {" "}
                    <BsArrowRight className=" mr-1 " /> Report
                  </p>{" "}
                </h2>

                <ul className="flex flex-col ml-5 space-y-3 list-disc marker:text-sky-400">
                  <li>
                    <Link
                      className="hover:text-sky-500"
                      to="/admin/Report/cdec"
                    >
                      Generate report
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="space-y-2">
                <h2>
                  {" "}
                  <p className="mb-2 mt-4 font-bold text-xl text-gray-100 flex uppercase items-center ">
                    {" "}
                    <BsArrowRight className=" mr-1 " /> Home page
                  </p>{" "}
                </h2>

                <ul className="flex flex-col ml-5 space-y-3 list-disc marker:text-sky-400">
                  <li>
                    <Link
                      className="hover:text-sky-500"
                      to="/admin/homepageEdit/cdec"
                    >
                      {" "}
                      Edit Text & Image
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* {cdec sidebar details Ends} */}

            {/* {cusatech sidebar details starts} */}

            <div className="space-y-2">
              <h2 className="text-3xl  font-extrabold text-center  hover:text-white tracking-widest uppercase ">
                CUSATECH
                <br />{" "}
                <p className="mb-2 mt-4 font-bold text-xl text-gray-100 flex items-center ">
                  {" "}
                  <BsArrowRight className=" mr-1 " /> Courses
                </p>{" "}
              </h2>
              <ul className="flex flex-col ml-5 space-y-3 list-disc marker:text-sky-400">
                <li>
                  <Link
                    className="hover:text-sky-500"
                    to="/cusatech/admin/CUSATECH/Course/AllCourses"
                  >
                    AllCourses
                  </Link>
                </li>
                <li>
                  <Link
                    className="hover:text-sky-500"
                    to="/cusatech/admin/CUSATECH/Course/CreateCourse"
                  >
                    Create Course
                  </Link>
                </li>
                <li>
                  <Link
                    className="hover:text-sky-500"
                    to="/admin/Course/cusatech/Update"
                  >
                    Update Course
                  </Link>
                </li>
              </ul>

              <div className="space-y-2">
                <h2>
                  {" "}
                  <p className="mb-2 mt-4 font-bold text-xl text-gray-100 flex uppercase items-center ">
                    {" "}
                    <BsArrowRight className=" mr-1 " /> SCHEDULE COURSE
                  </p>{" "}
                </h2>

                <ul className="flex flex-col ml-5 space-y-3 list-disc marker:text-sky-400">
                  <li>
                    <Link
                      className="hover:text-sky-500"
                      to="/admin/Schedule/cusatech"
                    >
                      {" "}
                      Schedule new course
                    </Link>
                  </li>
                </ul>
                <ul className="flex flex-col ml-5 space-y-3 list-disc marker:text-sky-400">
                  <li>
                    <Link
                      className="hover:text-sky-500"
                      to="/admin/Delete/cusatech"
                    >
                      {" "}
                      Delete Schedule course
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="space-y-2">
                <h2>
                  {" "}
                  <p className="mb-2 mt-4 font-bold text-xl text-gray-100 flex uppercase items-center ">
                    {" "}
                    <BsArrowRight className=" mr-1 " /> Update Status
                  </p>{" "}
                </h2>

                <ul className="flex flex-col ml-5 space-y-3 list-disc marker:text-sky-400">
                  <li>
                    <Link
                      className="hover:text-sky-500"
                      to="/admin/UpdateState/cusatech"
                    >
                      {" "}
                      Update schedule course status
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="space-y-2">
                <h2>
                  {" "}
                  <p className="mb-2 mt-4 font-bold text-xl text-gray-100 flex uppercase items-center ">
                    {" "}
                    <BsArrowRight className=" mr-1 " /> Grading
                  </p>{" "}
                </h2>

                <ul className="flex flex-col ml-5 space-y-3 list-disc marker:text-sky-400">
                  <li>
                    <Link
                      className="hover:text-sky-500"
                      to="/admin/Grading/cusatech"
                    >
                      {" "}
                      Grading course
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="space-y-2">
                <h2>
                  {" "}
                  <p className="mb-2 mt-4 font-bold text-xl text-gray-100 flex uppercase items-center ">
                    {" "}
                    <BsArrowRight className=" mr-1 " /> Report
                  </p>{" "}
                </h2>

                <ul className="flex flex-col ml-5 space-y-3 list-disc marker:text-sky-400">
                  <li>
                    <Link
                      className="hover:text-sky-500"
                      to="/admin/Report/cusatech"
                    >
                      {" "}
                      Generate report
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="space-y-2">
                <h2>
                  {" "}
                  <p className="mb-2 mt-4 font-bold text-xl text-gray-100 flex uppercase items-center ">
                    {" "}
                    <BsArrowRight className=" mr-1 " /> Home page
                  </p>{" "}
                </h2>
                <ul className="flex flex-col ml-5 space-y-3 list-disc marker:text-sky-400">
                  <li>
                    <Link
                      className="hover:text-sky-500"
                      to="/admin/homepageEdit/cusatech"
                    >
                      {" "}
                      Edit Text & Image
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            {/* {cusatech sidebar details end} */}
          </nav>
        </aside>
        <div className="container  mt-0">{mainContent}</div>
      </div>
      <Footer />
    </>
  )
}
