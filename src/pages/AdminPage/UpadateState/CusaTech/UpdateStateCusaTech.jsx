import React, { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { db } from "../../../../firebase.config"
import { updateDoc, doc, getDoc } from "firebase/firestore"
import { useParams } from "react-router-dom"

import { useNavigate } from "react-router-dom"

import FormDesign from "./../../../../components/NewForms/FormDesign"
import Sidebar2 from "../../SideBar2"
import Spinner from "../../../../components/Spinner/Spinner"
import Required from "../../../../components/Required Icon/Required"

function UpdateStateCusaTech() {
  const navigate = useNavigate()

  const { batch, courseScheduleId } = useParams()
  // State
  const [loading, setLoading] = useState(true)
  const [course, setCourse] = useState({})
  const [oldCourseStatusText, setCourseStatusText] = useState("")
  const [oldCourseStatus, setCourseStatus] = useState("")

  const { CourseStatusText, CourseStatus } = course

  const docRef = doc(db, `/AcademicYear/${batch}/cusaTech`, courseScheduleId)
  // fetch Course title
  const fetchData = async () => {
    try {
      const docSnap = await getDoc(docRef)
      // console.table(docSnap.data())
      setCourse(docSnap.data())
      setCourseStatusText(docSnap.data())
      setCourseStatus(docSnap.data())
    } catch (error) {
      toast.error(error)
    }

    setLoading(false)
  }

  useEffect(() => {
    fetchData()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const canSave = true

  // handle number inputs
  const onNum = (e) => {
    let value = Number(e.target.value)
    setCourse((prevState) => ({
      ...prevState,
      [e.target.id]: value,
    }))
  }

  const onMutate = (e) => {
    // console.log(e.target.id)
    // console.log(e.target.value)

    //Text
    setCourse((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    if (
      oldCourseStatusText === CourseStatusText ||
      oldCourseStatus === CourseStatus
    ) {
      toast.error("No changes made")
    } else {
      try {
        await updateDoc(docRef, {
          CourseStatusText: CourseStatusText,
          CourseStatus: parseInt(CourseStatus),
        })

        toast.success("Status updated  Successfully")
        navigate("/cusatech/admin")
      } catch (error) {
        toast.error(error.message)
      }
    }

    setLoading(false)
  }

  return (
    <Sidebar2
      mainContent={
        loading ? (
          <Spinner />
        ) : course ? (
          <div className="p-5 mt-10  ">
            {course && (
              <div className="w-full">
                <h1 className="text-3xl  text-center font-semibold mb-6">
                  {course.CourseName}
                </h1>

                <p className="text-xl child:font-serif  text-left font-semibold mb-6">
                  <ul className="mt-2">
                    <li>Course Code: {course.CourseCode}</li>
                    <li className="mt-2">Total Students : {course.NoOfStd}</li>
                    <li className="mt-2">
                      Cusat Students : {course.noOfStdCusat}
                    </li>
                    <li className="mt-2">
                      Non Cusat Students : {course.noOfStdNonCusat}
                    </li>
                  </ul>
                </p>
              </div>
            )}

            <FormDesign
              text={" Update State"}
              formJsx={
                <form className="w-full">
                  {/* CourseStatus */}
                  <div className="mb-6">
                    <div className="pb-2">
                      <label
                        htmlFor="name"
                        className=" left-0  text-gray-600  "
                      >
                        Course Status
                      </label>
                    </div>

                    <select
                      name="CourseStatus"
                      value={CourseStatus}
                      className="text-center font-semibold"
                      id="CourseStatus"
                      onChange={(e) => onNum(e)}
                    >
                      <option value={2}>Upcoming</option>
                      <option value={1}>Enroll</option>
                      <option value={3}>Enrollment Closed</option>
                      <option value={4}>Canceled</option>
                      <option value={5}>Completed</option>
                    </select>
                  </div>
                  {/* CourseStatusText */}
                  <div className="mb-6">
                    <div className="pb-2">
                      <label
                        htmlFor="name"
                        className=" left-0  text-gray-600  "
                      >
                        Course Status Text
                      </label>
                    </div>

                    <input
                      type="text"
                      placeholder="Course Status Text"
                      className=" w-full rounded p-3 text-gray-800 border-gray-500 outline-none focus-visible:shadow-none focus:border-primary"
                      name="CourseStatusText"
                      id="CourseStatusText"
                      onChange={(e) => {
                        onMutate(e)
                      }}
                      value={CourseStatusText}
                    />
                  </div>

                  {/* submit */}
                  <div>
                    <button
                      disabled={!canSave}
                      type="submit"
                      onClick={onSubmit}
                      className={
                        canSave
                          ? "w-full text-gray-900  bg-green-400 rounded-lg border border-primary text-lg p-3 transition ease-in-out duration-500"
                          : "w-full  text-gray-400 bg-green-200 rounded-lg border border-primary text-lg p-3 transition ease-in-out duration-500"
                      }
                    >
                      {" "}
                      Update State
                    </button>
                  </div>
                </form>
              }
            />
          </div>
        ) : (
          <div>
            <h1 className="text-5xl font-serif font-semibold mb-6 flex justify-center items-center h-screen w-full  -mt-20">
              Records empty
            </h1>
          </div>
        )
      }
    />
  )
}

export default UpdateStateCusaTech
