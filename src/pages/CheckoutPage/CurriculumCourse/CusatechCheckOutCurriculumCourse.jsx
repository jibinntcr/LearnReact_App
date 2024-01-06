import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Link, useParams } from "react-router-dom"
import banner from "../../../assets/images/banner-bg.jpg"
import Footer from "../../../components/Footer/Footer"
import Page404 from "../../Page404"
import "./Enroll.css"
import { db } from "../../../firebase.config"

import { getDoc, doc } from "firebase/firestore"

import { getFunctions, httpsCallable } from "firebase/functions"

//components
import Spinner from "../../../components/Spinner/Spinner"

// toastify
import { toast } from "react-toastify"

import { useUserAuth } from "../../../context/UserAuthContext"

function CusatechCheckOutCurriculumCourse() {
  const functions = getFunctions()
  const navigate = useNavigate()

  const { id, batch } = useParams()

  const [loading, setLoading] = useState(true)

  const {
    user,
    userDetailsIsFull,
    cusaTechEnrolledCourses,
  } = useUserAuth()

  const [data, setData] = useState({})
  const [sample, setSample] = useState("")

  const {
    CourseName,
    CourseDepartment,
    CourseImage,
    thumbnailImage,
    CourseStatus,
    templateId,
  } = data

  const enroll = () => {
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
      const enrollCourseCusatech = httpsCallable(
        functions,
        "enrollCourseCusatech"
      )

      enrollCourseCusatech({
        batch: batch,
        courseDocid: templateId,
        scheduleCourseDocid: id,
      })
        .then((result) => {
          setLoading(false)
          //  console.log(result.data)
          toast.success("Enrolled successfully")
          navigate("/courses")
          //  console.log(result)
        })
        .catch((error) => {
          setLoading(false)
          // console.log(error.message)
          if (error.message === "Unauthenticated") {
            toast.error(error.message)
            // console.log(`/sign-in/courses/${batch}/${id}`)

            navigate(`/sign-in/cusatech/courses/${batch}/${id}`)
            // console.log(`/sign-in/courses/${batch}/${id}`)
          } else {
            toast.error(error.message)
          }
        })
    }
  }

  const fetchData = async (collectionName, docId, stateName) => {
    const docRef = doc(db, collectionName, docId)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      stateName({
        ...docSnap.data(),

        DocId: docSnap.id,
      })
    } else {
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
  }, [])

  const canEnroll = (CS) => {
    CS = parseInt(CS)
    return CS > 1 ? false : true
  }

  const canSave = Boolean(sample.length > 3)

  return (
    <>
      {" "}
      {loading ? (
        <Spinner />
      ) : CourseName ? (
        <>
          <div
            className="overflow-x-hidden mt-14"
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
                <h1 style={{ fontSize: 50 }}> Checkout</h1>
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
                    <Link className="" to="">
                      Checkout
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white min-h-screen">
              <div className="pt-16 grid sm:px-10 lg:grid-cols-2 lg:px-20 xl:px-32">
                <div className="px-4 pt-8">
                  <p className="text-xl font-medium">Course details</p>
                  <p className="text-gray-400">
                    confirm your course before enroll
                  </p>
                  <Link to={`/courses/${batch}/${id}`}>
                    <div className="mt-8 space-y-3 rounded-lg border border-green-400 bg-white px-2 py-4 sm:px-6">
                      <div className="flex flex-col rounded-lg bg-white sm:flex-row">
                        <img
                          className="m-2 h-24 w-28 rounded-md border object-cover object-center"
                          src={thumbnailImage ? thumbnailImage : CourseImage}
                          alt=""
                        />
                        <div className="flex w-full flex-col px-4 py-4">
                          <span className="font-semibold">{CourseName}</span>
                          <span className="float-right mt-1 text-gray-400">
                            {CourseDepartment}
                          </span>
                          <p className="text-lg font-bold"> ₹0.00</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>

                <div className="mt-10 bg-gray-50 rounded-lg px-4 pt-8 lg:mt-0">
                  <p className="text-xl font-medium">Fill your details</p>
                  <p className="text-gray-400">
                    Complete your order by providing your course details.
                  </p>
                  <div className="">
                    <div className="flex">
                      <label
                        htmlFor="courseCode"
                        className="mt-4 w-9/12 mb-2 block text-sm font-medium"
                      >
                        Your course code
                      </label>
                      <label
                        htmlFor="semester"
                        className="mt-4 w-3/12 mb-2 block text-sm font-medium"
                      >
                        Semester
                      </label>
                    </div>
                    <div className="flex">
                      <div className="relative w-9/12 flex-shrink-0">
                        <input
                          type="text"
                          id=" courseCode"
                          name="courseCode"
                          value={sample}
                          onChange={(e) => setSample(e.target.value)}
                          className="w-full rounded-md border border-gray-200 px-4 py-3 pl-11 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                          placeholder="Your course code"
                        />
                      </div>
                      <select
                        className="w-2/6 rounded-md border border-gray-200 px-4 py-3 pl-11 text-sm uppercase shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                        name="semester"
                        id="semester"
                      >
                        <option key={1} value="1">
                          1
                        </option>
                        <option key={2} value="2">
                          2
                        </option>
                        <option key={3} value="3">
                          3
                        </option>
                        <option key={4} value="4">
                          4
                        </option>
                        <option key={5} value="5">
                          5
                        </option>
                        <option key={6} value="6">
                          6
                        </option>
                        <option key={7} value="7">
                          7
                        </option>
                        <option key={8} value="8">
                          8
                        </option>
                      </select>
                    </div>

                    {/* Total */}
                    <div className="mt-6 border-t border-b py-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">
                          Subtotal
                        </p>
                        <p className="font-semibold text-gray-900"> ₹0.00</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">GST</p>
                        <p className="font-semibold text-gray-900"> ₹0.00</p>
                      </div>
                    </div>
                    <div className="mt-6 flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">Total</p>
                      <p className="text-2xl font-semibold text-gray-900">
                        {" "}
                        ₹0.00
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    disabled={!canSave}
                    onClick={enroll}
                    className={`mt-4 mb-8 w-full rounded-md  px-6 py-3 font-medium text-white 
                    enroll`}
                  >
                    Enroll
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <Page404 />
      )}
      <Footer />
    </>
  )
}

export default CusatechCheckOutCurriculumCourse
