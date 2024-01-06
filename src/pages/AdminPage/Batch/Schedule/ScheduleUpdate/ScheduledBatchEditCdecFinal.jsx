import React, { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { v4 } from "uuid"
import Select from "react-select"
import {
  ref,
  getDownloadURL,
  getStorage,
  uploadBytesResumable,
} from "firebase/storage"

//firebase
import { db } from "../../../../../firebase.config"
import {
  Timestamp,
  getDoc,
  doc,
  updateDoc,
  getDocs,
  where,
  query,
  collection,
  documentId,
  serverTimestamp,
} from "firebase/firestore"

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
import Title from "../../../../../components/Title/Title"
import Spinner from "../../../../../components/Spinner/Spinner"
import FromDesign from "../../../../../components/NewForms/FormDesign"
import RootLayout from "../../../../../components/SideBar/RootLayout"
// image compression
import imageCompression from "browser-image-compression"
import CompressionOptions from "../../../../../const/CompressionOptions"

function ScheduledBatchEditCdecFinal() {
  // State
  const toastId = React.useRef(null)

  const [loadingText, setloadingText] = useState(true)
  const [facultyData, setFacultyData] = useState([]) // select element format
  const [courseFacultys, setCourseFacultys] = useState([]) //s    selected faculty data
  const [courseFacultysObj, setCourseFacultysObj] = useState([])
  const [departmentsList, setDepartmentsList] = useState({})
  const [selectedDepartment, setSelectedDepartment] = useState({
    value: "",
    label: "",
  })

  const [imagedata, setimageData] = useState(null)
  const [selectedImage, setselectedImage] = useState(null)

  // file size checker
  const [selectedFile, setSelectedFile] = useState()
  const [errorMsg, setErrorMsg] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  //--------------------------

  const [imgFlie, setImgFlie] = useState(null)
  const [preview, setPreview] = useState()

  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())

  const { batch, courseScheduleId } = useParams()
  const navigate = useNavigate()

  // fetch faculty data from db
  const [loading, setLoading] = useState(false)

  // ref to current doc
  const docRef = doc(db, `/AcademicYear/${batch}/cdec`, courseScheduleId)

  const [formData, setFormData] = useState({
    CourseCode: "", // data type changed
    CourseName: "",
    CourseFees: 0, //  removed "cusat_cost"
    CourseDescription: "",
    CourseFaculty: [], // only need professor id
    CourseDuration: "",
    // CourseDepartment: "", //new field
    CourseOfferedBy: "CDeC",

    noOfStdLimitCusat: 0,
    noOfStdLimitNonCusat: 0,
    CurriculumCourse: true,
    thumbnailImage: "",
    thumbnailImageLocation: "",
    CusatStudentsCourseFees: 0,
    InstitutionalStudentPricing: 0,
    totalMark: 100,
  }) // batchList

  const {
    CourseCode,
    CourseName,
    CourseFees,
    CourseDescription,
    //  CourseFaculty,
    CourseDuration,
    // CourseDepartment,
    CourseOfferedBy,

    // CourseActive,
    // Display,
    /// Images,
    CurriculumCourse,
    CusatStudentsCourseFees,
    InstitutionalStudentPricing,
    noOfStdLimitCusat,
    noOfStdLimitNonCusat,
    totalMark,
    thumbnailImage,
    thumbnailImageLocation,
  } = formData

  // for formating the fetchData
  function formatCourse(doc) {
    const {
      CourseCode,
      CourseName,
      CourseFees,
      CourseDescription,
      //  CourseFaculty,
      CourseDuration,
      // CourseDepartment,
      CourseOfferedBy,

      // CourseActive,
      // Display,
      /// Images,
      totalMark,
      CurriculumCourse,
      CusatStudentsCourseFees,
      InstitutionalStudentPricing,
      noOfStdLimitCusat,
      noOfStdLimitNonCusat,
      thumbnailImage,
      thumbnailImageLocation,
    } = doc.data()

    return {
      DocId: doc.id,
      CourseCode,
      CourseName,
      CourseFees,
      CourseDescription,
      CourseDuration,
      CourseOfferedBy,

      noOfStdLimitCusat,
      noOfStdLimitNonCusat,
      CurriculumCourse,
      thumbnailImage,
      CusatStudentsCourseFees,
      InstitutionalStudentPricing,
      thumbnailImageLocation,
      totalMark,
    }
  }

  const fetchDepartments = async () => {
    const docRef = doc(db, "departments", "list")

    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const array = docSnap.data().names
      let options = []
      array.map((item) => {
        options.push({ value: item, label: item })
      })
      setDepartmentsList(options)
    } else {
      // doc.data() will be undefined in this case
      toast.error("Something went wrong !")
    }
  }

  useEffect(() => {
    fetchDepartments()
  }, [])

  // conversion of database time stamp value to dd/mm/yyyy format
  const convertTimestampToDate = (timestampValue) => {
    // console.log("Value:", timestampValue.toDate())

    return timestampValue.toDate()
  }

  //fetch Data from server
  const fetchData = async (state, docRef, transform = formatCourse) => {
    setLoading(true)

    try {
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        const results = { ...docSnap.data() }
        setSelectedDepartment({
          value: docSnap.data().CourseDepartment,
          label: docSnap.data().CourseDepartment,
        })

        setStartDate(convertTimestampToDate(docSnap.data().startDate))
        setEndDate(convertTimestampToDate(docSnap.data().endDate))

        const FacultyIds = docSnap.data().CourseFaculty

        getDocs(
          query(
            collection(db, "faculty"),
            where(documentId(), "in", FacultyIds)
          )
        )
          .then((snapshot) => {
            // console.log(snapshot.docs)
            let values = []
            snapshot.docs.forEach((doc) => {
              values.push({ ...doc.data(), DocId: doc.id })
            })
            // console.log(values)
            var result = values.map((item) => ({
              value: item.DocId,
              label: `${item.name} (${item.designation})`,
            }))
            // console.log(result)
            setCourseFacultysObj(result)
          })
          .catch((err) => {
            // console.log(err.message)
          })
        state(results)
        setLoading(false)
      } else {
        // doc.data() will be undefined in this case
        toast.error("No such document!")
      }
    } catch (err) {
      toast.error(err.message)
      toast.error("Data fetching failed")
      setLoading(false)
    }
  }

  const handleSelectDepartment = (selectedOption) => {
    setCourseFacultysObj([])
    setCourseFacultys([])
    setSelectedDepartment(selectedOption)
  }

  const handleSelectFaculty = (selectedOption) => {
    setCourseFacultys(selectedOption)
    setCourseFacultysObj(selectedOption)
    // console.log(selectedOption)
  }

  useEffect(() => {
    // let fTimestamp = Timestamp.fromDate(startDate)
    // console.log(fTimestamp)
    // console.log("fTimestamp")

    document.body.scrollIntoView()

    // collection ref
    fetchData(setFormData, docRef)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const onMutate = (e) => {
    let boolean = null

    if (e.target.value === "true") {
      boolean = true
    }
    if (e.target.value === "false") {
      boolean = false
    }

    // Text/Booleans
    if (!e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: boolean ?? e.target.value,
      }))
    }
  }

  // handle number inputs
  const onFee = (e) => {
    let value = Number(e.target.value)
    setFormData((prevState) => ({
      ...prevState,
      CourseFees: value,
    }))
  }

  const fetchFaculty = (e) => {
    const colRef = collection(db, "faculty")
    const q = query(colRef, where("department", "==", selectedDepartment.value))

    getDocs(q)
      .then((snapshot) => {
        // console.log(snapshot.docs)
        let books = []
        snapshot.docs.forEach((doc) => {
          books.push({ ...doc.data(), DocId: doc.id })
        })

        var result = books.map((item) => ({
          value: item.DocId,
          label: `${item.name} (${item.designation})`,
        }))
        // console.log(result)

        setFacultyData(result)
        setloadingText(false)
      })
      .catch((err) => {
        toast.error("Error fetching faculty data " + err.message)
        setloadingText(false)
      })
  }

  useEffect(() => {
    if (selectedDepartment) {
      fetchFaculty()
    }
  }, [selectedDepartment])

  const noOfStd = (e) => {
    let value = Number(e.target.value)
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: value,
    }))
  }

  let limitCusatBoolean = false
  if (noOfStdLimitCusat > 0) {
    limitCusatBoolean = true
  }

  let limitNonCusatBoolean = false
  if (noOfStdLimitNonCusat >= 0) {
    limitNonCusatBoolean = true
  }

  let facultyBoolean = false

  if (courseFacultysObj.length > 0) {
    facultyBoolean = true
  } else if (courseFacultys.length > 0) {
    facultyBoolean = true
  } else {
    facultyBoolean = false
  }

  let startDateBoolean = false

  if (startDate !== null) {
    startDateBoolean = true
  }

  let endDateBooelan = false

  if (endDate !== null) {
    endDateBooelan = true
  }

  let imageBoolean = formData.CourseImage !== null ? true : false

  if (imgFlie !== null) {
    if (!isSuccess) {
      imageBoolean = false
    } else {
      imageBoolean = true
    }
  }

  const CusatStdFee = (e) => {
    let value = Number(e.target.value)
    setFormData((prevState) => ({
      ...prevState,
      CusatStudentsCourseFees: value,
    }))
  }

  const InStudentPricing = (e) => {
    let value = Number(e.target.value)
    setFormData((prevState) => ({
      ...prevState,
      InstitutionalStudentPricing: value,
    }))
  }

  const onMarkChange = (e) => {
    let value = Number(e.target.value)
    setFormData((prevState) => ({
      ...prevState,
      totalMark: value,
    }))
  }

  async function handleImageUpload(event) {
    if (event.target.files && event.target.value) {
      setselectedImage(event.target.files[0])
    }

    const imageFile = event.target.files[0]

    try {
      const compressedFile = await imageCompression(
        imageFile,
        CompressionOptions.thumbnailOptions
      )
      setimageData(compressedFile)
      // console.log(`compressedFile size ${compressedFile.size} MB`)
    } catch (error) {
      // console.log(error)
    }
  }

  let CusatStudentFeeBoolean = false

  if (CurriculumCourse === false && CusatStudentsCourseFees >= 0) {
    CusatStudentFeeBoolean = true
  } else if (CurriculumCourse === true) {
    CusatStudentFeeBoolean = true
  } else {
    CusatStudentFeeBoolean = false
  }

  let InBoolean = false

  if (InstitutionalStudentPricing >= 0) {
    InBoolean = true
  }

  let totalMarkBoolean = false
  if (totalMark > 0) {
    totalMarkBoolean = true
  }

  const canSave =
    Boolean(imageBoolean) &&
    Boolean(CourseCode) &&
    Boolean(CourseName) &&
    Boolean(CourseFees >= 0) &&
    Boolean(InBoolean) &&
    Boolean(totalMarkBoolean) &&
    Boolean(CusatStudentFeeBoolean) &&
    Boolean(CourseDescription) &&
    Boolean(CourseDuration) &&
    Boolean(selectedDepartment.value !== "") &&
    Boolean(CourseOfferedBy) &&
    Boolean(facultyBoolean) &&
    Boolean(startDateBoolean) &&
    Boolean(endDateBooelan) &&
    Boolean(limitCusatBoolean) &&
    Boolean(limitNonCusatBoolean)

  // console.log(formData)

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    let tempFacultyData = []
    //console.log(courseFacultys)
    courseFacultysObj.map((person) => tempFacultyData.push(person.value))
    // console.log(tempFacultyData)

    // This page and as well as Cusat Page When Updating formdata,the value of templateId also changes with current docId

    let formDataCopy = {
      ...formData,
      CourseDepartment: selectedDepartment.value,
      CourseFaculty: tempFacultyData,
      startDate: Timestamp.fromDate(startDate),
      endDate: Timestamp.fromDate(endDate),
      lastUpdate: serverTimestamp(),
    }

    try {
      updateDoc(docRef, formDataCopy)
        .then((docRef) => {
          // console.log(
          //   "A New Document Field has been added to an existing document"
          //)
        })
        .catch((error) => {
          // console.log(error)
        })

      toast.success("Updated  Successfully")
      navigate("/admin")
    } catch (error) {
      toast.error("Course  not saved")
      // console.log(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <RootLayout>
      <Title> Update Scheduled Course - Cdec </Title>

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
                  <form className="w-full">
                    {/* {course Image Display} */}

                    <div className="mb-6">
                      <div className="pb-2">
                        <label
                          htmlFor="CourseCode"
                          className=" left-0  text-gray-600  "
                        >
                          Course Code (ID) - (Can't change)
                        </label>
                      </div>

                      <input
                        required
                        type="text"
                        placeholder=" Course Code"
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
                        name="CourseCode"
                        id="CourseCode"
                        value={CourseCode}
                        disabled
                      />
                    </div>
                    {/* Course name */}
                    <div className="mb-6">
                      <div className="pb-2">
                        <label
                          htmlFor="CourseName"
                          className=" left-0  text-gray-600  "
                        >
                          Course name
                        </label>
                      </div>

                      <input
                        type="text"
                        placeholder="Course name"
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
                        name="CourseName"
                        id="CourseName"
                        onChange={onMutate}
                        value={CourseName}
                      />
                    </div>
                    {/* Course Offered By (select) */}
                    <div className="mb-6">
                      <div className="pb-2">
                        <label
                          htmlFor="CourseOfferedBy"
                          className=" left-0  text-gray-600  "
                        >
                          Course Offered By
                        </label>{" "}
                      </div>

                      <select
                        required
                        id="CourseOfferedBy"
                        className=" 
            w-full
            rounded
            p-3
            text-gray-800
            border-gray-500
            outline-none
            focus-visible:shadow-none
            focus:border-primary"
                        value={CourseOfferedBy}
                        onChange={(e) => onMutate(e)}
                      >
                        <option value="CDeC">CDeC</option>
                        {/* <option value="CUSATECH">CUSATECH</option> */}
                      </select>
                    </div>

                    {/* { Course Type} */}

                    <div className="mb-6">
                      <div className="pb-2">
                        <label
                          htmlFor="CourseOfferedBy"
                          className=" left-0  text-gray-600  "
                        >
                          Course Type
                        </label>{" "}
                      </div>

                      <select
                        required
                        id="CurriculumCourse"
                        className=" 
            w-full
            rounded
            p-3
            text-gray-800
            border-gray-500
            outline-none
            focus-visible:shadow-none
            focus:border-primary"
                        value={CurriculumCourse}
                        onChange={(e) => onMutate(e)}
                      >
                        <option value="true">Curriculum Course</option>
                        <option value="false">NON Curriculum Course</option>
                      </select>
                    </div>

                    {/* {course Fee For Cusat student if Course is NON C C} */}
                    {CurriculumCourse === false && (
                      <div className="mb-6">
                        <div className="pb-2">
                          <label
                            htmlFor="Course Fee For Cusat Students"
                            className=" left-0  text-gray-600  "
                          >
                            Course Fee For Cusat Students
                          </label>
                        </div>

                        <input
                          required
                          type="number"
                          placeholder="Course Fee For Cusat Students"
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
                          name="CusatStudentsCourseFees"
                          id="CusatStudentsCourseFees"
                          onChange={CusatStdFee}
                          value={CusatStudentsCourseFees}
                        />
                      </div>
                    )}

                    {/* {} */}
                    {/* {course Fee For Cusat student if Course is C C} */}

                    <div className="mb-6">
                      <div className="pb-2">
                        <label
                          htmlFor="Course Fee For Cusat Students"
                          className=" left-0  text-gray-600  "
                        >
                          Course Fee For Students from Recognized Institutions
                        </label>
                      </div>

                      <input
                        required
                        type="number"
                        placeholder="Course Fee For Students from Recognized Institutions"
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
                        name="InstitutionalStudentPricing"
                        id="InstitutionalStudentPricing"
                        onChange={InStudentPricing}
                        value={InstitutionalStudentPricing}
                      />
                    </div>

                    {/*  Course Fees */}
                    <div className="mb-6">
                      <div className="pb-2">
                        <label
                          htmlFor="CourseFees"
                          className=" left-0  text-gray-600  "
                        >
                          Course Fees for Outside CUSAT Participants
                        </label>{" "}
                      </div>
                      <input
                        required
                        type="number"
                        placeholder=" Course Fees"
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
                        name="CourseFees"
                        id="CourseFees"
                        onChange={onFee}
                        value={CourseFees}
                      />
                    </div>

                    {/* {maximum mark} */}
                    <div className="mb-6">
                      <div className="pb-2">
                        <label
                          htmlFor="CourseFees"
                          className=" left-0  text-gray-600  "
                        >
                          Total Mark
                        </label>{" "}
                      </div>
                      <input
                        required
                        type="number"
                        placeholder="Total Mark"
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
                        name="totalMark"
                        id="totalMark"
                        onChange={onMarkChange}
                        value={totalMark}
                      />
                    </div>

                    {/*    Course Duration */}
                    <div className="my-6">
                      <div className="pb-2">
                        <label
                          htmlFor="courseDuration"
                          className=" left-0  text-gray-600  "
                        >
                          Course Duration
                        </label>{" "}
                      </div>
                      <input
                        required
                        type="text"
                        placeholder="Course duration"
                        className="
                              w-full
                              rounded
                              p-3
                              text-gray-800 border-gray-500
                              required
                              outline-none
                              focus-visible:shadow-none
                              focus:border-primary
                              "
                        name="CourseDuration"
                        id="CourseDuration"
                        value={CourseDuration}
                        onChange={onMutate}
                      />
                    </div>

                    {/* CourseDepartment */}
                    <div className="my-6">
                      <div className="pb-2">
                        <label
                          htmlFor="CourseDepartment"
                          className=" left-0  text-gray-600  "
                        >
                          Course Department
                        </label>{" "}
                      </div>
                      <Select
                        options={departmentsList}
                        onChange={(selectedOption) => {
                          handleSelectDepartment(selectedOption)
                        }}
                        isSearchable
                        value={selectedDepartment}
                      />
                    </div>

                    {/*     Select professors */}
                    {loadingText ? (
                      "Loading..."
                    ) : facultyData && facultyData.length > 0 ? (
                      <div className="my-6">
                        <div className="pb-2">
                          <label
                            htmlFor="courseDuration"
                            className=" left-0  text-gray-600  "
                          >
                            Select professors
                          </label>{" "}
                        </div>
                        <Select
                          className="w-full
                              rounded
                              py-3
                              text-gray-800
                              required
                              outline-none
                              focus-visible:shadow-none
                              focus:border-primary"
                          options={facultyData}
                          onChange={(selectedOption) => {
                            handleSelectFaculty(selectedOption)
                          }}
                          isMulti
                          isSearchable
                          value={courseFacultysObj}
                        />
                      </div>
                    ) : (
                      <>
                        {!(selectedDepartment.value === "") && (
                          <>
                            <span className="text-red-600 mr-1">
                              {" "}
                              No Faculty Found ⛔️
                            </span>
                            you can add Faculty from
                            <Link to="/admin/event/addFaculty">
                              {" "}
                              <span className=" mx-1 items-baseline text-green-600">
                                {" "}
                                Here{" "}
                              </span>
                            </Link>
                            OR{" "}
                            <span className=" italic text-sm">
                              {" "}
                              make sure you are connected to internet
                            </span>
                          </>
                        )}
                      </>
                    )}

                    <div className="my-6">
                      <div className="pb-2">
                        <label
                          htmlFor="CourseDescription"
                          className=" left-0  text-gray-600  "
                        >
                          Course Description
                        </label>{" "}
                      </div>
                      <textarea
                        required
                        rows="6"
                        placeholder="Course Description"
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
                        name="CourseDescription"
                        id="CourseDescription"
                        value={CourseDescription}
                        onChange={onMutate}
                      ></textarea>
                    </div>

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
                        type="tel"
                        placeholder="Maximum no of Cusat students"
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
                      <div className="pb-2">
                        <label className=" left-0  text-gray-600  ">
                          Course Image - (Can't change)
                        </label>
                      </div>
                      <div className="my-6 flex items-center space-x-6">
                        {formData.CourseImage ? (
                          <div className="shrink-0">
                            <img
                              className="object-cover w-64 rounded"
                              src={formData.CourseImage}
                              alt="Not Available Preview"
                            />
                          </div>
                        ) : null}
                      </div>
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
                        Save Changes
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

export default ScheduledBatchEditCdecFinal
