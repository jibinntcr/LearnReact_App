import React from "react"
import { CiMail } from "react-icons/ci"
import {
  // FaChalkboardTeacher,
  PiBagSimpleDuotone,
  PiPhoneDuotone,
} from "react-icons/pi"

// import { BsPeople, BsChat } from "react-icons/bs"

import { Link } from "react-router-dom"

function FacultyCard({
  urlLink,
  photo,
  name,
  phone,
  designation,
  department,
  cv,
  linkedin,
  CourseNameInSingleLine,
  email,
  GoogleScholarLink,
  iqacUrl,
}) {
  return (
    <Link className=" m-2" to={urlLink}>
      <div className="p-2  ">
        {/* <!-- Card --> */}
        <div className=" p-2 bg-white rounded-xl transform transition-all hover:-translate-y-2 duration-300 shadow-lg hover:shadow-2xl">
          {/* <!-- Image --> */}
          <img
            className="mx-auto rounded-full py-2 w-16"
            src={photo}
            alt="url error"
          />

          <div className="p-2">
            <div className=" ">
              {/* <!-- Heading --> */}

              <h2
                className={
                  CourseNameInSingleLine
                    ? "font-bold text-lg my-2 line-clamp-1"
                    : "font-bold text-lg my-2"
                }
              >
                {name}
              </h2>
              <p className="text-gray-800 text-base">{department}</p>
              <p className="flex  items-center font-semibold mt-1">
                <PiBagSimpleDuotone className="mr-2" /> {designation}
              </p>
              <p className="flex  items-center font-semibold mt-1">
                <PiPhoneDuotone className="mr-2" /> {phone}
              </p>
              <p className="flex  items-center font-semibold mt-1">
                <CiMail className="mr-2" /> {email}
              </p>
            </div>
          </div>
          {/* <!-- CTA --> */}
          <div className="m-2">
            {/* <button

              className="text-white bg-green-500 px-3 py-1 rounded-md hover:text-black hover:bg-green-400"
            >
              {" "}
              {CourseFees
                && CourseFees
              }
            </button> */}
          </div>
        </div>
        {/* <!-- Card --> */}
      </div>
    </Link>
  )
}

export default FacultyCard
