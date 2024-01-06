import React, { useState, useEffect } from "react"

import { Link, useNavigate, useParams } from "react-router-dom"
import Title from "../../../components/Title/Title"
import Spinner from "../../../components/Spinner/Spinner"
import { db } from "../../../firebase.config"

import { getDoc, doc } from "firebase/firestore"

//
import { MdPhone, MdEmail } from "react-icons/md"
import { FaLinkedin } from "react-icons/fa"
import { CgProfile } from "react-icons/cg"
import { SiGooglescholar } from "react-icons/si"
import { RiContactsFill } from "react-icons/ri"

import { useUserAuth } from "../../../context/UserAuthContext"
import { toast } from "react-toastify"
import RootLayout from "../../../components/SideBar/RootLayout"

function FacultyDetails() {
  const [loading, setLoading] = useState(true)

  const { user } = useUserAuth()

  // const [data, setData] = useState({})

  const [facultyData, setFacultyData] = useState([])

  const navigate = useNavigate()

  // DocId,
  // Image = "https://tailwindui.com/img/ecommerce-images/product-page-05-product-01.jpg"

  const { id } = useParams()

  const fetchdata = async (collectionName, docId) => {
    const docRef = doc(db, collectionName, docId)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      setFacultyData(docSnap.data())
      setLoading(false)
    } else {
      // doc.data() will be undefined in this case
      // console.log("No such document!")
    }
    // console.log("data", facultyData.cv)
  }

  useEffect(() => {
    window.scroll(0, 0)

    // fetch the temp semester value from firebase
    try {
      fetchdata(`faculty`, id)
    } catch (e) {
      // console.log(e.name)
    }
  }, [id])

  const handleClick = () => {
    navigate(`/admin/Faculty/EditDetails/${id}`)
    // console.log("navigated!")
  }

  const handleDownload = (downloadUrl, fileName) => {
    window.open(downloadUrl, fileName)
  }
  // console.log(courseDetailsSelector,'hello word');
  return (
    <RootLayout>
      <div>
        {/* Section 2 */}

        {loading ? (
          <Spinner />
        ) : (
          <div className="bg-white min-h-screen">
            <div className="mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
              {/* <!-- Product --> */}
              <Title>Faculty Details</Title>
              {facultyData && (
                <div className="">
                  <div
                    key={facultyData.DocId}
                    className="mt-4 bg-gray-100 rounded-xl	 prose prose-sm text-gray-900"
                  >
                    <div className="max-w-md p-8 sm:flex  sm:space-x-6  ">
                      <div className="sm:flex-shrink-0 mx-auto sm:mx-0  w-32 mb-6 h-32 sm:h-32 sm:w-32  sm:mb-0">
                        <img
                          src={facultyData.photo}
                          alt={facultyData.name}
                          className="object-cover object-center w-full h-full rounded "
                        />
                      </div>
                      <div className="flex flex-col space-y-4">
                        <div>
                          <h2 className="text-2xl w-96 font-semibold">
                            {facultyData.name}
                          </h2>
                          <span className="text-sm ">
                            {facultyData.designation} ,{" "}
                          </span>
                          <span className="text-sm ">
                            {facultyData.department} ,{" "}
                          </span>
                          <br />
                          <span className="text-sm mt-1 ">
                            {facultyData.affiliation}
                          </span>
                        </div>

                        <div className=" text-black">
                          <a
                            className="hover:text-green-500 text-black"
                            href={`mailto:${facultyData.email}`}
                          >
                            <span className="flex items-center space-x-2 my-2">
                              <MdEmail />
                              <span className="">{facultyData.email}</span>
                            </span>
                          </a>

                          <a
                            className="hover:text-green-500 text-black"
                            href={`tel:+91${facultyData.phone}`}
                          >
                            <span className="flex items-center my-2 space-x-2">
                              <MdPhone />
                              <span className="">
                                {" "}
                                {`+91${facultyData.phone}`}
                              </span>
                            </span>
                          </a>
                          {facultyData.iqacUrl && (
                            <a
                              className="hover:text-green-500 text-black"
                              href={facultyData.iqacUrl}
                            >
                              {" "}
                              <span className="flex my-2 items-center space-x-2">
                                <CgProfile />

                                <span className=" ">{facultyData.iqacUrl}</span>
                              </span>
                            </a>
                          )}
                          {facultyData.linkedin && (
                            <a
                              className="hover:text-green-500 text-black"
                              href={facultyData.linkedin}
                            >
                              {" "}
                              <span className="flex my-2 items-center space-x-2">
                                <FaLinkedin />
                                <span className=" ">
                                  {facultyData.linkedin}
                                </span>
                              </span>
                            </a>
                          )}
                          {facultyData.iqacUrl && (
                            <a
                              className="hover:text-green-500 text-black"
                              href={facultyData.iqacUrl}
                            >
                              {" "}
                              <span className="flex my-2 items-center space-x-2">
                                <RiContactsFill />
                                <span className=" ">{facultyData.iqacUrl}</span>
                              </span>
                            </a>
                          )}
                          {facultyData.GoogleScholarLink && (
                            <a
                              className="hover:text-green-500 text-black"
                              href={facultyData.GoogleScholarLink}
                            >
                              {" "}
                              <span className="flex my-2 items-center space-x-2">
                                <SiGooglescholar />
                                <span className=" ">
                                  {facultyData.GoogleScholarLink}
                                </span>
                              </span>
                            </a>
                          )}
                          {/* { download CV Button } */}

                          {facultyData.cv !== "" && (
                            <button
                              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
                              onClick={() =>
                                handleDownload(
                                  facultyData.cv,
                                  `${facultyData.name}cv`
                                )
                              }
                            >
                              <span>Download Cv</span>
                              <svg
                                className="fill-current w-4 h-4 mr-2"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                              >
                                <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" />
                              </svg>
                            </button>
                          )}
                          {/* { download CV Button } */}
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button
                        onClick={handleClick}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </RootLayout>
  )
}

export default FacultyDetails
