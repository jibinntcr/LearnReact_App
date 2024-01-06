import React, { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"

//firebase
import { db } from "../../../../firebase.config"
import { collection, Timestamp, getDoc, doc, addDoc } from "firebase/firestore"

// toastify
import { toast } from "react-toastify"

// React icons
import { BiSelectMultiple } from "react-icons/bi"
import { FaChalkboardTeacher } from "react-icons/fa"
import { FcMultipleInputs } from "react-icons/fc"

// Date Picker
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

//Components
import Title from "../../../../components/Title/Title"
import Spinner from "../../../../components/Spinner/Spinner"
import FromDesign from "../../../../components/NewForms/FormDesign"
import RootLayout from "../../../../components/SideBar/RootLayout"

function ScheduleCdecCoursePart3() {
  // State

  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())

  const { batch, courseScheduleId } = useParams()
  const navigate = useNavigate()

  // fetch faculty data from db
  const [loading, setLoading] = useState(false)

  const [course, setCourse] = useState({
    noOfStdLimitCusat: 0,
    noOfStdLimitNonCusat: 0,
  }) // batchList

  const { noOfStdLimitCusat, noOfStdLimitNonCusat } = course

  // for formating the fetchData
  function formatCourse(doc) {
    const { CourseName, createdAt } = doc.data()

    return { DocId: doc.id, CourseName, createdAt }
  }

  //fetch Data from server
  const fetchData = async (state, docRef, transform = formatCourse) => {
    setLoading(true)

    try {
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        const results = { ...docSnap.data(), templateId: docSnap.id }
        state(results)
        // var result = results[0](item => ({ value: item.DocId, label: item.CourseName }))
        // console.log(result)
        // state(result)
        setLoading(false)
      } else {
        // doc.data() will be undefined in this case
        // console.log("No such document!")
        toast.error("No such document!")
      }
    } catch (err) {
      // console.log(err.message)
      toast.error("Data fetching failed")
      setLoading(false)
    }
  }

  useEffect(() => {
    let fTimestamp = Timestamp.fromDate(startDate)
    // console.log(fTimestamp)
    // console.log("fTimestamp")

    document.body.scrollIntoView()

    // collection ref

    const docRef = doc(db, "courses/CDEC/cdecChildren", courseScheduleId)

    fetchData(setCourse, docRef)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const noOfStd = (e) => {
    let value = Number(e.target.value)
    setCourse((prevState) => ({
      ...prevState,
      [e.target.id]: value,
    }))
    // console.log(course)
  }

  let limitCusatBoolean = false
  if (noOfStdLimitCusat > 0) {
    limitCusatBoolean = true
  }

  let limitNonCusatBoolean = false
  if (noOfStdLimitNonCusat >= 0) {
    limitNonCusatBoolean = true
  }

  const canSave =
    Boolean(startDate) &&
    Boolean(endDate) &&
    Boolean(limitCusatBoolean) &&
    Boolean(limitNonCusatBoolean)

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const formDataCopy = {
      ...course,
      startDate: Timestamp.fromDate(startDate),
      endDate: Timestamp.fromDate(endDate),
      noOfStdCusat: 0,
      noOfStdNonCusat: 0,
      NoOfStd: 0, // total no of std
      scheduleAt: Timestamp.now(),
      CourseStatusText: "",
      CourseStatus: 2,
    }

    // console.log("formData value"+formDataCopy)

    if (course) {
      // console.log("formData value" + formDataCopy)
      // Update in firestore
      try {
        await addDoc(collection(db, `AcademicYear/${batch}/cdec`), formDataCopy)
        setLoading(false)

        toast.success(" Course Schedule Successfully")
        navigate("/admin")
      } catch (error) {
        setLoading(false)
        toast.error("Course  not saved")
        // console.log(error.message)
      }
    } else {
      toast.warning("")
    }
    setLoading(false)
  }

  return (
    <RootLayout>
      <Title> Schedule Course - Cdec </Title>
      <>
        {/* step bar */}
        <div className="w-full mt-0 py-6">
          <div className="flex">
            <div className="w-1/4">
              <div className="relative mb-2">
                <div className="w-10 h-10 mx-auto bg-green-500 rounded-full text-lg text-white flex items-center">
                  <span className=" flex items-center justify-center text-white w-full">
                    <BiSelectMultiple className="text-xl" />
                  </span>
                </div>
              </div>

              <div className="text-xs font-semibold text-center md:text-base">
                Select batch
              </div>
            </div>

            <div className="w-1/4">
              <div className="relative mb-2">
                <div
                  className="absolute flex align-center items-center align-middle content-center"
                  style={{
                    width: "calc(100% - 2.5rem - 1rem)",
                    top: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <div className="w-full bg-gray-200 rounded items-center align-middle align-center flex-1">
                    <div
                      className="w-0 bg-green-300 py-1 rounded"
                      style={{ width: "100%" }}
                    ></div>
                  </div>
                </div>

                <div className="w-10 h-10 mx-auto  bg-green-500 rounded-full  text-lg text-white flex items-center">
                  <span className=" flex items-center justify-center text-white w-full">
                    <FaChalkboardTeacher className="text-xl " />
                  </span>
                </div>
              </div>

              <div className="text-xs font-semibold text-center md:text-base">
                Select Course{" "}
              </div>
            </div>

            <div className="w-1/4">
              <div className="relative mb-2">
                <div
                  className="absolute flex align-center items-center align-middle content-center"
                  style={{
                    width: "calc(100% - 2.5rem - 1rem)",
                    top: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <div className="w-full bg-gray-200 rounded items-center align-middle align-center flex-1">
                    <div
                      className="w-0 bg-green-300 py-1 rounded"
                      style={{ width: "100%" }}
                    ></div>
                  </div>
                </div>

                <div className="w-10 h-10 mx-auto bg-green-500 rounded-full  text-lg text-white flex items-center">
                  <span className=" flex items-center justify-center text-white w-full">
                    <FcMultipleInputs className="text-xl text-white " />
                  </span>
                </div>
              </div>

              <div className="text-xs font-semibold text-center md:text-base">
                Additional information
              </div>
            </div>

            <div className="w-1/4">
              <div className="relative mb-2">
                <div
                  className="absolute flex align-center items-center align-middle content-center"
                  style={{
                    width: "calc(100% - 2.5rem - 1rem)",
                    top: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <div className="w-full bg-gray-200 rounded items-center align-middle align-center flex-1">
                    <div
                      className="w-0 bg-green-300 py-1 rounded"
                      style={{ width: "33%" }}
                    ></div>
                  </div>
                </div>

                <div className="w-10 h-10 mx-auto bg-white border-2 border-gray-200 rounded-full text-lg text-white flex items-center">
                  <span className="text-center text-gray-600 w-full">
                    <svg
                      className="w-full fill-current"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="24"
                      height="24"
                    >
                      <path
                        className="heroicon-ui"
                        d="M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-2.3-8.7l1.3 1.29 3.3-3.3a1 1 0 0 1 1.4 1.42l-4 4a1 1 0 0 1-1.4 0l-2-2a1 1 0 0 1 1.4-1.42z"
                      />
                    </svg>
                  </span>
                </div>
              </div>

              <div className="text-xs  font-semibold text-center md:text-base">
                Finished
              </div>
            </div>
          </div>
        </div>
      </>

      <FromDesign
        text={null}
        formJsx={
          <div className="mt-0">
            {" "}
            <div className="mb-6">
              {loading ? (
                <>
                  <Spinner />
                </>
              ) : (
                <>
                  <p className="text-2xl font-sans font-bold text-gray-900 p-3">
                    {course.CourseName}
                  </p>{" "}
                  <p className="text-sm font-semibold text-right text-gray-900 p-3">
                    Course Code : {course.CourseCode}
                  </p>
                  <form className="w-full">
                    <div className="mb-6">
                      <div className="pb-2">
                        <label
                          htmlFor="noOfStdLimitCusat"
                          className=" left-0  text-gray-600  "
                        >
                          Maximum no of Cusat students
                        </label>{" "}
                      </div>
                      <input
                        required
                        type="number"
                        placeholder="Maximum no of Cusat students "
                        min="0"
                        max="90000"
                        className="
                              w-full
                              rounded
                              p-3
                              text-gray-800
                             
                             
                              border-gray-500
                             
                              outline-none
                              focus-visible:shadow-none
                              focus:border-primary
                              "
                        name="noOfStdLimitCusat"
                        id="noOfStdLimitCusat"
                        onChange={noOfStd}
                        value={noOfStdLimitCusat}
                      />
                    </div>

                    <div className="mb-6">
                      <div className="pb-2">
                        <label
                          htmlFor="noOfStdLimitNonCusat"
                          className=" left-0  text-gray-600  "
                        >
                          Maximum no of non Cusat students
                        </label>{" "}
                      </div>
                      <input
                        required
                        type="number"
                        placeholder=" Maximum no of non Cusat students"
                        min="0"
                        max="10000"
                        className="
                              w-full
                              rounded
                              p-3
                              text-gray-800
                             
                             
                              border-gray-500
                             
                              outline-none
                              focus-visible:shadow-none
                              focus:border-primary
                              "
                        name="Maximum no of non Cusat students"
                        id="noOfStdLimitNonCusat"
                        onChange={noOfStd}
                        value={noOfStdLimitNonCusat}
                      />
                    </div>
                    <div className="mb-6">
                      <div className="pb-2">
                        <label
                          htmlFor="StartDate"
                          className=" left-0  text-gray-600  "
                        >
                          Start Date
                        </label>{" "}
                      </div>

                      <DatePicker
                        className="w-full 
                              rounded
                              py-3
                              text-gray-800
                              required
                              outline-none
                              focus-visible:shadow-none
                              focus:border-primary"
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        dateFormat="dd/MM/yyyy"
                        minDate={new Date()}
                        isClearable
                        showYearDropdown
                        scrollableMonthYearDropdown
                        showMonthDropdown
                      />
                    </div>

                    <div className="mb-6">
                      <div className="pb-2">
                        <label
                          htmlFor="EndDate"
                          className=" left-0  text-gray-600  "
                        >
                          End Date
                        </label>{" "}
                      </div>
                      <DatePicker
                        className="w-full
                              rounded
                              py-3
                              text-gray-800
                              required
                              outline-none
                              focus-visible:shadow-none
                              focus:border-primary"
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        dateFormat="dd/MM/yyyy"
                        minDate={startDate}
                        isClearable
                        showYearDropdown
                        showMonthDropdown
                      />
                    </div>
                    <div className="my-6">
                      <button
                        disabled={!canSave}
                        type="submit"
                        onClick={onSubmit}
                        className={
                          canSave
                            ? "w-full text-white font-semibold bg-green-400 rounded-lg border border-primary text-lg p-3 transition ease-in-out duration-500"
                            : "w-full  text-gray-400 bg-green-200 rounded-lg border border-primary text-lg p-3 transition ease-in-out duration-500"
                        }
                      >
                        Schedule Course
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        }
      />
      {/*  FromDesign Ending */}
    </RootLayout>
  )
}

export default ScheduleCdecCoursePart3
