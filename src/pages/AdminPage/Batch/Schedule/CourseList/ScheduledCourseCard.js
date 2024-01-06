import React, { useState, useEffect } from "react"
import { MdPeople, MdAccessTimeFilled } from "react-icons/md"
import {
  // FaChalkboardTeacher,
  FaSlackHash,
} from "react-icons/fa"

function ScheduledCourseCard({
  CourseNameInSingleLine,
  NoOfStd,
  CourseCode,
  CourseName,
  CourseDepartment,
  CourseDescription,
  CourseFees,
  CourseDuration,
  CourseImage,
  Scheduledstatus,
}) {
  const [noOfStdView, setNoOfStdView] = useState([])

  useEffect(() => {
    if (NoOfStd === 0) {
      setNoOfStdView(null)
    } else {
      setNoOfStdView(NoOfStd)
    }
  }, [NoOfStd])

  return (
    <>
      <div className="p-2  ">
        {/* <!-- Card --> */}

        <div className="w-60 p-2 bg-white rounded-xl transform transition-all hover:-translate-y-2 duration-300 shadow-lg hover:shadow-2xl">
          {/* <!-- Image --> */}
          {/* <Link className=" m-2" to={urlLink} > */}
          <img
            className="h-40 object-cover rounded-xl"
            src={CourseImage}
            alt=""
          />
          {/* </Link > */}
          <div className="p-2">
            <div className=" ">
              {/* <!-- Heading --> */}

              <p className="flex items-center justify-end">
                <MdAccessTimeFilled className=" mr-1 " /> {CourseDuration}
                {noOfStdView && (
                  <>
                    <MdPeople className="mr-1  mx-1 " /> {noOfStdView}
                  </>
                )}
              </p>
              {/* <Link className=" m-2" to={urlLink} > */}
              <h2
                className={
                  CourseNameInSingleLine
                    ? "font-bold text-lg my-2 line-clamp-1"
                    : "font-bold text-lg my-2"
                }
              >
                {CourseName ? CourseName : "Course Name"}
              </h2>

              <p className="text-gray-800 text-base">{CourseDepartment}</p>
              <p className="flex  items-center font-semibold mt-3">
                <FaSlackHash className="mr-2" /> {CourseCode}
                {/* {professor.forEach(o => (  o.name))} */}
              </p>

              {/* </Link> */}
              {/* <p className="flex  items-center font-semibold my-3">
                <FaChalkboardTeacher className="mr-2" />  {CourseFaculty}
                 {professor.forEach(o => (  o.name))} 
              </p> */}
              {/* <!-- Description --> */}
            </div>
            <p className="text-sm text-gray-600 line-clamp-3">
              {CourseDescription && CourseDescription}
            </p>

            {/* <p className={`text-sm px-3 py-1 rounded-md 
                ${Scheduledstatus ? 
                'text-white bg-green-500 hover:text-black hover:bg-green-400' 
                : 'text-black bg-red-500 hover:text-white hover:bg-red-400'}`}>
              {Scheduledstatus === true ? "Scheduled" : "Not Scheduled"}
            </p> */}
            {Scheduledstatus === true ? (
              <span className="p-1.5 text-xs font-medium uppercase tracking-wider text-green-800 bg-green-200 rounded-lg bg-opacity-50">
                Scheduled
              </span>
            ) : (
              <span className="p-1.5 text-xs font-medium uppercase tracking-wider text-blue-800 bg-blue-200 rounded-lg bg-opacity-50">
                Not Scheduled
              </span>
            )}
          </div>

          {/* <!-- CTA --> */}
          <div className="m-2">
            {/* <Link className=" m-2" to={urlLink} > */}
            <button className="text-white bg-green-500 px-3 py-1 rounded-md hover:text-black hover:bg-green-400">
              {" "}
              {CourseFees && CourseFees}
            </button>
          </div>
        </div>
        {/* <!-- Card --> */}
      </div>
    </>
  )
}

export default ScheduledCourseCard
