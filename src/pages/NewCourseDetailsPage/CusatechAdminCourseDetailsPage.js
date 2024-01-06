import React, { useState, useEffect } from "react"

import { Link, useParams } from "react-router-dom"
import banner from "../../assets/images/banner-bg.jpg"

import Footer from "../../components/Footer/Footer"

import { db } from "../../firebase.config"

import {
  documentId,
  query,
  where,
  getDocs,
  collection,
  getDoc,
  doc,
} from "firebase/firestore"

// toastify
import { toast } from "react-toastify"

import { MdPeople, MdAccessTimeFilled, MdPhone, MdEmail } from "react-icons/md"
import { FaSlackHash, FaLinkedin } from "react-icons/fa"
import { CgProfile } from "react-icons/cg"

import { useUserAuth } from "../../context/UserAuthContext"

function CusatechAdminCourseDetailsPage() {
  const [loading, setLoading] = useState(true)

  const { user } = useUserAuth()

  const [data, setData] = useState({})
  const [facultyData, setFacultyData] = useState([])

  const {
    NoOfStd,
    CourseCode,
    CourseName,
    CourseDepartment,
    CourseDescription,
    CourseFees,
    CourseDuration,
    CourseImage,
  } = data
  // DocId,
  // Image = "https://tailwindui.com/img/ecommerce-images/product-page-05-product-01.jpg"

  const { id } = useParams()
  let batchtemp = ""

  const fetchdata = async (collectionName, docId, stateName) => {
    const docRef = doc(db, collectionName, docId)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      let fee = fund(docSnap.data().CourseFees)
      // console.log("fee")
      stateName({ ...docSnap.data(), CourseFees: fee, DocId: docSnap.id })
      // console.log("Document data:", docSnap.data())
      const FacultyIds = docSnap.data().CourseFaculty

      getDocs(
        query(collection(db, "faculty"), where(documentId(), "in", FacultyIds))
      )
        .then((snapshot) => {
          // console.log(snapshot.docs)
          let books = []
          snapshot.docs.forEach((doc) => {
            books.push({ ...doc.data(), DocId: doc.id })
          })
          // console.log(books)
          setFacultyData(books)
        })
        .catch((err) => {
          // console.log(err.message)
        })
    } else {
      // doc.data() will be undefined in this case
      // console.log("No such document!")
    }
  }

  useEffect(() => {
    window.scroll(0, 0)

    // fetch the temp semester value from firebase
    const getId = async () => {
      // console.log("fetch the temp id")
      try {
        // console.log(batchtemp)

        await fetchdata(`courses/CUSATECH/cusatechChildren`, id, setData)

        setLoading(false)
      } catch (error) {
        toast.error("Could not fetch data")
      }
    }

    getId()
  }, [id])

  // console.log("facultyData")
  // console.log(facultyData)

  const fund = (rs) => {
    if (user) {
      if (user.cusatFlag === false) {
        return rs
      } else return rs
    } else return null
  }

  // console.log(courseDetailsSelector,'hello word');
  return (
    <div
      className="overflow-x-hidden"
      style={{
        marginTop: -100,
        zIndex: -1,
      }}
    >
      <div
        style={{
          position: "relative",
          backgroundColor: "rgba(4, 9, 30)",
          width: "100%",
          height: 400,
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img
          style={{
            objectFit: "cover",
            marginTop: 200,

            width: "100%",
            opacity: 0.2,
            position: "absolute",
          }}
          src={banner}
          alt=""
        />
        <div style={{ zIndex: 1, color: "white", paddingTop: 100 }}>
          <h1 style={{ fontSize: 50 }}> Course</h1>
          <div
            style={{
              display: "flex",
              justifyContent: "space-evenly",
              paddingTop: 20,
            }}
          >
            <div>
              <Link className="hover:text-green-500" to="/">
                Home
              </Link>
            </div>
            <div>/</div>
            <div>
              {" "}
              <Link className="hover:text-green-500" to="/courses">
                Courses
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2 */}

      <div className="bg-white">
        <div className="mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
          {/* <!-- Product --> */}

          <div className="lg:grid lg:grid-rows-1 lg:grid-cols-7 lg:gap-x-8 lg:gap-y-10 xl:gap-x-16">
            {/* <!-- Product image --> */}
            <div className="lg:row-end-1 lg:col-span-4">
              {CourseName && (
                <div className="aspect-w-4 aspect-h-3 rounded-lg bg-gray-100 overflow-hidden">
                  <img
                    src={CourseImage}
                    alt={CourseName}
                    className="object-center  object-cover w-full"
                  />
                </div>
              )}
            </div>

            {/* <!-- Product details --> */}
            <div className="max-w-2xl mx-auto mt-14 sm: lg:max-w-none lg:mt-0 lg:row-end-2 lg:row-span-2 lg:col-span-3">
              <div className="flex flex-col-reverse">
                <div className="">
                  <h1 className="text-2xl font-extrabold tracking-tight mb-2 text-gray-900 sm:text-3xl">
                    {loading
                      ? "loading "
                      : CourseName
                      ? CourseName
                      : "No such document!"}
                  </h1>
                </div>
              </div>

              {CourseDuration && (
                <p className="my-2 font-bold text-gray-900 text-xl flex items-center ">
                  {" "}
                  Duration <MdAccessTimeFilled className=" mx-1 " /> :{" "}
                  {CourseDuration}
                </p>
              )}
              {NoOfStd && (
                <p className="my-2 font-bold text-gray-900 text-xl flex items-center">
                  <MdPeople className=" mr-2 " /> {NoOfStd} Students
                </p>
              )}

              {CourseCode && (
                <p className="my-2 font-bold text-gray-900 text-xl flex items-center ">
                  Course Code <FaSlackHash className=" mx-1 " /> : {CourseCode}
                </p>
              )}
              {CourseDepartment && (
                <p className="my-2 flex-col sm:flex-row flex sm:flex-none  items-start font-bold text-gray-900 text-xl  sm:items-center ">
                  <div className="sm:mb-0 mx-1 mb-2">Department : </div>{" "}
                  <div className="">{` ${CourseDepartment}`}</div>
                </p>
              )}

              {CourseDescription && (
                <p className="text-gray-500 font-medium text-base mt-6">
                  {CourseDescription}
                </p>
              )}
              {
                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                  <button
                    onClick={() => {}}
                    type="button"
                    className="w-full  border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-green-400  text-white bg-green-500   hover:text-black hover:bg-green-400"
                  >
                    ₹{" "}
                    {CourseFees
                      ? CourseFees.toString().replace(
                          /\B(?=(\d{3})+(?!\d))/g,
                          ","
                        )
                      : "Enroll"}
                  </button>
                </div>
              }
            </div>
          </div>

          {facultyData && (
            <div className="">
              {facultyData.map((item) => (
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
                        <h2 className="text-2xl w-96 font-semibold">
                          {item.name}
                        </h2>
                        <span className="text-sm ">{item.designation} , </span>
                        <span className="text-sm ">{item.department} , </span>
                        <br />
                        <span className="text-sm mt-1 ">
                          {item.affiliation}
                        </span>
                      </div>

                      <div className="">
                        <a
                          className="hover:text-green-500"
                          href={`mailto:${item.email}`}
                        >
                          <span className="flex items-center space-x-2 my-2">
                            <MdEmail />
                            <span className="">{item.email}</span>
                          </span>
                        </a>

                        <a
                          className="hover:text-green-500"
                          href={`tel:+91${item.phone}`}
                        >
                          <span className="flex items-center my-2 space-x-2">
                            <MdPhone />
                            <span className=""> {`+91${item.phone}`}</span>
                          </span>
                        </a>
                        {item.iqacUrl && (
                          <a
                            className="hover:text-green-500"
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
                            className="hover:text-green-500"
                            href={item.linkedin}
                          >
                            {" "}
                            <span className="flex my-2 items-center space-x-2">
                              <FaLinkedin />

                              <span className=" ">Linkedin Profile</span>
                            </span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default CusatechAdminCourseDetailsPage
