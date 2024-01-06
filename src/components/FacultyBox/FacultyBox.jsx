import React from "react"
import { FaLinkedin } from "react-icons/fa"
import { CgProfile } from "react-icons/cg"
import { MdPhone, MdEmail } from "react-icons/md"
import { RiContactsFill } from "react-icons/ri"

function FacultyBox({ item }) {
  return (
    <div
      key={item.DocId}
      className="mt-4 bg-gray-100 rounded-xl	 prose prose-sm text-gray-900"
    >
      <div className="max-w-md p-8 sm:flex  sm:space-x-6  ">
        <div className="sm:flex-shrink-0 mx-auto sm:mx-0  w-32 mb-6 h-32 sm:h-32 sm:w-32  sm:mb-0">
          <img
            src={item.photo}
            alt={item.name}
            className="object-cover object-center w-full h-full rounded "
          />
        </div>
        <div className="flex flex-col space-y-4">
          <div>
            <h2 className="text-2xl w-96 font-semibold">{item.name}</h2>
            <span className="text-sm ">{item.designation} , </span>
            <span className="text-sm ">{item.department} , </span>
            <br />
            <span className="text-sm mt-1 ">{item.affiliation}</span>
          </div>

          <div className="">
            <a
              className="hover:text-green-500 text-black"
              href={`mailto:${item.email}`}
            >
              <span className="flex items-center space-x-2 my-2">
                <MdEmail />
                <span className="">{item.email}</span>
              </span>
            </a>

            <a
              className="hover:text-green-500 text-black"
              href={`tel:+91${item.phone}`}
            >
              <span className="flex items-center my-2 space-x-2">
                <MdPhone />
                <span className=""> {`+91${item.phone}`}</span>
              </span>
            </a>
            {item.iqacUrl && (
              <a
                className="hover:text-green-500 text-black"
                href={item.iqacUrl}
              >
                {" "}
                <span className="flex my-2 items-center space-x-2">
                  <CgProfile />

                  <span className=" ">IQAC Profile</span>
                </span>
              </a>
            )}
            {item.linkedin && (
              <a
                className="hover:text-green-500 text-black"
                href={item.linkedin}
              >
                {" "}
                <span className="flex my-2 items-center space-x-2">
                  <FaLinkedin />

                  <span className=" ">Linkedin Profile</span>
                </span>
              </a>
            )}

            {item.iqacUrl && (
              <a
                className="hover:text-green-500 text-black"
                href={item.iqacUrl}
              >
                {" "}
                <span className="flex my-2 items-center space-x-2">
                  <RiContactsFill />

                  <span className=" ">IQAC Profile</span>
                </span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default FacultyBox
