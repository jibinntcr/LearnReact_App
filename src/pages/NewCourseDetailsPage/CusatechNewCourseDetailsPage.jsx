import React, { useState, useEffect ,useRef, Fragment} from "react"
import { useNavigate } from "react-router-dom"
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

import { getFunctions, httpsCallable } from "firebase/functions"

//components
import Spinner from "../../components/Spinner/Spinner"

// toastify
import { toast } from "react-toastify"

import { MdPeople, MdAccessTimeFilled, MdPhone, MdEmail } from "react-icons/md"
import { FaSlackHash, FaLinkedin } from "react-icons/fa"
import { CgProfile } from "react-icons/cg"


import { Dialog, Transition } from "@headlessui/react"
import { LiaBookSolid } from "react-icons/lia"

import { useUserAuth } from "../../context/UserAuthContext"
import Page404 from "../Page404"
import FacultyBox from "../../components/FacultyBox/FacultyBox"

function CusatechNewCourseDetailsPage() {
  const functions = getFunctions()
  const navigate = useNavigate()

  const { id, batch } = useParams()

  const [loading, setLoading] = useState(true)

  const { user, cusaTechEnrolledCourses, userDetailsIsFull, userDetails } =
    useUserAuth()

  const [data, setData] = useState({})
  const [facultyData, setFacultyData] = useState([])
  const [noOfStdView, setNoOfStdView] = useState([])
  const [cash, setCash] = useState([])

  const [open, setOpen] = useState(false)
  const cancelButtonRef = useRef(null)

  const {
    NoOfStd,
    DocId,
    CourseFees,
    CourseStatusText,
    CourseStatus,
    templateId,
    CourseCode,
    CourseName,
    CourseDepartment,
    CourseDescription,
    noOfStdNonCusat,
    noOfStdLimitNonCusat,
    noOfStdLimitCusat,
    noOfStdCusat,
    CourseDuration,
    CourseImage,
    CurriculumCourse,
    CusatStudentsCourseFees,
    InstitutionalStudentPricing,
  } = data
  // DocId,
  // Image = "https://tailwindui.com/img/ecommerce-images/product-page-05-product-01.jpg"

  const fetchData = async (collectionName, docId, stateName) => {
    const docRef = doc(db, collectionName, docId)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      setCash(
        fund(
          docSnap.data().CourseFees,
          docSnap.id,
          docSnap.data()?.CourseStatus,
          docSnap.data()?.CurriculumCourse,
          docSnap.data()?.CusatStudentsCourseFees,
          docSnap.data()?.InstitutionalStudentPricing
        )
      )

      stateName({
        ...docSnap.data(),

        DocId: docSnap.id,
      })
      // console.log("Document data:", docSnap.data())
      const FacultyIds = docSnap.data().CourseFaculty

      try {
        const snapshot = await getDocs(
          query(
            collection(db, "faculty"),
            where(documentId(), "in", FacultyIds)
          )
        )

        let faculty = []
        snapshot.docs.forEach((doc) => {
          faculty.push({ ...doc.data(), DocId: doc.id })
        })

        // console.log(faculty)
        setFacultyData(faculty)
      } catch (error) {
        // console.log(error.message)
      }
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
        await fetchData(`AcademicYear/${batch}/cusaTech`, id, setData)

        setLoading(false)
      } catch (error) {
        toast.error("Could not fetch data")
      }
    }

    getId()

    if (NoOfStd === 0) {
      setNoOfStdView(null)
    } else {
      setNoOfStdView(NoOfStd)
    }
  }, [id])

  setTimeout(() => {
    setCash(
      fund(
        CourseFees,
        DocId,
        CourseStatus,
        CurriculumCourse,
        CusatStudentsCourseFees,
        InstitutionalStudentPricing
      )
    )
  }, 1000)

  const canEnroll = (CS) => {
    CS = parseInt(CS)

    // console.log(CS)

    return CS > 1 ? false : true
  }

  const fund = (
    CourseFees,
    DocId,
    CourseStatus,
    CurriculumCourse,
    CusatStudentsCourseFees,
    InstitutionalStudentPricing
  ) => {
    if (user && cusaTechEnrolledCourses.includes(DocId)) {
      return "Enrolled"
    }
    CourseStatus = parseInt(CourseStatus)

    switch (CourseStatus) {
      case 2:
        return "Upcoming"
      case 3:
        return "Enrollment closed"
      case 4:
        return "Canceled"
      case 5:
        return "Completed"
      default:
        return funds(
          CourseFees,
          CurriculumCourse,
          CusatStudentsCourseFees,
          InstitutionalStudentPricing
        )
    }
  }

  const funds = (
    CourseFees,
    CurriculumCourse,
    CusatStudentsCourseFees,
    InstitutionalStudentPricing
  ) => {
    if (user) {
      if (user.cusatFlag === true) {
        if (CurriculumCourse) {
          return "Enroll"
        } else {
          let rt = CusatStudentsCourseFees?.toString().replace(
            /\B(?=(\d{3})+(?!\d))/g,
            ","
          )
          if (rt === undefined) return "Enroll"
          return (rt = "₹" + rt)
        }
      } else if (
        user.cusatFlag === false &&
        userDetails &&
        userDetails?.RecognizedInstitutionFlag
      ) {
        let rt = InstitutionalStudentPricing?.toString().replace(
          /\B(?=(\d{3})+(?!\d))/g,
          ","
        )
        if (rt === undefined) return "Enroll"

        return (rt = "₹" + rt)
      } else if (user.cusatFlag === false) {
        let rt = CourseFees?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        if (rt === undefined) return "Enroll"
        return (rt = "₹" + rt)
      }
    } else return "Enroll"
  }

  const modelYes = () => {
    setOpen(false)
    navigate(`/cusatech/checkout/CurriculumCourse/${batch}/${id}`)
  }


  const checkout = () => {
    setLoading(true)

    if (canEnroll(CourseStatus) === false) {
      toast.error("Enrollment closed")
      setLoading(false)
      return
    }

    if (user) {
      if (cusaTechEnrolledCourses.includes(id)) {
        toast.error("Already enrolled")
        setLoading(false)
        return
      }
    }

    if (user === null) {
      toast.warning("Unauthenticated")
      navigate(`/sign-in/cusatech/courses/${batch}/${id}`)
    } else if (user !== null && !userDetailsIsFull) {
      toast.warning("Please fill your details")
      navigate(`/Profile/edit`)
    } else {
      if (user) {
        if (user?.cusatFlag === true) {
          // modal open  are you c
          setLoading(false)
          setOpen(true)
        } else {
          // navigate  to checkout page
          
          setLoading(false)
          if(userDetails?.RecognizedInstitutionFlag===true){

          }else{
            navigate(`/cusatech/checkout/${batch}/${id}`)

          }
          
        }
      }
    }
  }















  const newline = (text) => {
    return text.split("\n").map((item, key) => {
      return (
        <span key={key}>
          {item}
          <br />
        </span>
      )
    })
  }

  // console.log(courseDetailsSelector,'hello word');
  return (
    <>
      {" "}
      {loading ? (
        <Spinner />
      ) : CourseName ? (
        <>
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
                          {CourseName ? CourseName : "No such document!"}
                        </h1>

                        {/* <h2 id='information-heading ' className='sr-only'> </h2> */}

                        {/* <p className='text-sm text-gray-500 mt-2'>
                  Version 1.0 (Updated{" "}
                  <time dateTime='2021-06-05'>June 5, 2021</time>)
                </p> */}
                      </div>
                    </div>

                    {CourseDuration && (
                      <p className="my-2 font-bold text-gray-900 text-xl sm:text-lg flex items-center ">
                        {" "}
                        Duration <MdAccessTimeFilled className=" mx-1 " /> :{" "}
                        {CourseDuration}
                      </p>
                    )}

                    {noOfStdView && (
                      <p className="my-2 font-bold text-gray-900 text-xl sm:text-lg flex items-center">
                        <MdPeople className=" mr-2 " /> Students {noOfStdView}
                      </p>
                    )}

                    {CourseCode && (
                      <p className="my-2 font-bold text-gray-900 text-xl sm:text-lg flex items-center ">
                        Course Code <FaSlackHash className=" mx-1 " /> :{" "}
                        {CourseCode}
                      </p>
                    )}
                    {CourseDepartment && (
                      <div className="my-2 flex-col sm:flex-row flex sm:flex-none  items-start font-bold text-gray-900 text-xl sm:text-lg  sm:items-center ">
                        <div className="sm:mb-0 mx-1 mb-2">Department : </div>{" "}
                        <div className="">{` ${CourseDepartment}`}</div>
                      </div>
                    )}
                    {noOfStdLimitCusat && (
                      <div className="my-2 flex-col sm:flex-row flex sm:flex-none  items-start font-bold text-gray-900 text-xl sm:text-lg  sm:items-center ">
                        <div className="sm:mb-0 mx-1 mb-2">
                          Seats Available for CUSAT Students :
                        </div>
                        <div className="">{` ${
                          noOfStdLimitCusat - noOfStdCusat
                        }`}</div>
                      </div>
                    )}
                    {noOfStdLimitNonCusat && (
                      <div className="my-2 flex-col sm:flex-row flex sm:flex-none  items-start font-bold text-gray-900 text-xl sm:text-lg  sm:items-center ">
                        <div className="sm:mb-0 mx-1 mb-2">
                          Seats Available for Non CUSAT Students :{" "}
                        </div>
                        <div className="">{` ${
                          noOfStdLimitNonCusat - noOfStdNonCusat
                        }`}</div>
                      </div>
                    )}

                    {CourseDescription && (
                      <div className="text-gray-500 font-medium text-justify text-base mt-6">
                        {newline(CourseDescription)}
                      </div>
                    )}
                    {CourseStatusText > " " && (
                      <div className="bg-gray-200 p-3 text-gray-900 rounded-md  font-semibold mt-10">
                        {CourseStatusText}
                      </div>
                    )}
                    {cash && (
                      <div className="mt-3 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                        <button
                          onClick={checkout}
                          type="button"
                          className="w-full  border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-green-400  text-white bg-green-500   hover:text-black hover:bg-green-400"
                        >
                          {cash && cash === undefined ? "Enrolled" : cash}
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {facultyData && (
                  <div className="">
                    {facultyData.map((item, index) => (
                      <FacultyBox key={index} item={item} />
                    ))}
                  </div>
                )}
              </div>
            </div>

            <>
              {/* card curriculum */}
              <Transition.Root show={open} as={Fragment}>
                <Dialog
                  as="div"
                  className="relative z-10"
                  initialFocus={cancelButtonRef}
                  onClose={setOpen}
                >
                  <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                  </Transition.Child>

                  <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                      <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        enterTo="opacity-100 translate-y-0 sm:scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                        leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                      >
                        <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                          <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                            <div className="sm:flex sm:items-start">
                              <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                                <LiaBookSolid
                                  className="h-6 w-6 text-green-400"
                                  aria-hidden="true"
                                />
                              </div>
                              <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                <Dialog.Title
                                  as="h3"
                                  className="text-base font-semibold leading-6 text-gray-900"
                                >
                                  Whether this course is part of your curriculum
                                  ?
                                </Dialog.Title>
                                <div className="mt-2">
                                  <p className="text-sm text-gray-500">
                                    {/* Are you sure you want to deactivate your account? All
                          of your data will be permanently removed. This action
                          cannot be undone. */}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                            <button
                              type="button"
                              className="inline-flex w-full justify-center rounded-md bg-green-400 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-700 sm:ml-3 sm:w-auto"
                              onClick={() => modelYes()}
                            >
                              YES
                            </button>
                            <button
                              type="button"
                              className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                              onClick={() => setOpen(false)}
                              ref={cancelButtonRef}
                            >
                              NO
                            </button>
                          </div>
                        </Dialog.Panel>
                      </Transition.Child>
                    </div>
                  </div>
                </Dialog>
              </Transition.Root>
            </>
         
          </div>
        </>
      ) : (
        <Page404 />
      )}   <Footer />
    </>
  )
}

export default CusatechNewCourseDetailsPage
