import React, { useState, useEffect } from "react"
import Select from "react-select"
import { v4 } from "uuid"
import { db } from "../../firebase.config"
import {
  collection,
  getDocs,
  query,
  where,
  serverTimestamp,
  addDoc,
  doc,
  getDoc,
} from "firebase/firestore"

import Spinner from "../../components/Spinner/Spinner"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import {
  ref,
  getDownloadURL,
  getStorage,
  uploadBytesResumable,
} from "firebase/storage"
import imageCompression from "browser-image-compression"
import CompressionOptions from "../../const/CompressionOptions"

function Form() {
  const toastId = React.useRef(null)
  const navigate = useNavigate()

  // fech faculty data from db
  const [loading, setLoading] = useState(false)
  const [loadingText, setloadingText] = useState(true)
  const [facultyData, setFacultyData] = useState([]) // select element format
  const [courseFacultys, setCourseFacultys] = useState([]) //s    selected faculty data
  const [departmentsList, setDepartmentsList] = useState({})
  const [selectedDepartment, setSelectedDepartment] = useState({
    value: "",
    label: "",
  })

  const [imagedata, setImageData] = useState(null)

  // file size checker
  const [selectedFile, setSelectedFile] = useState()
  const [errorMsg, setErrorMsg] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  //--------------------------

  const [imgFlie, setImgFlie] = useState(null)
  const [preview, setPreview] = useState()

  const [formData, setFormData] = useState({
    CourseCode: "", // data type changed
    CourseName: "",
    CourseFees: 0, //  removed "cusat_cost"
    CourseDescription: "",
    CourseFaculty: [], // only need professor id
    CourseDuration: "",
    CurriculumCourse: true,
    CusatStudentsCourseFees: 0,
    InstitutionalStudentPricing: 0,
    totalMark: 100,
    thumbnailImage: "",
    // CourseDepartment: "", //new field
    CourseOfferedBy: "CDeC",

    // CourseActive: true,

    // Display: false,

    //new field
    //new field   store img names
  })

  // Course Offered By

  const {
    CourseCode,
    CourseName,
    CourseFees,
    CourseDescription,
    //  CourseFaculty,
    CourseDuration,
    // CourseDepartment,
    CurriculumCourse,
    CusatStudentsCourseFees,
    CourseOfferedBy,
    thumbnailImage,
    InstitutionalStudentPricing,
    totalMark,
    // CourseActive,
    // Display,
    /// Images,
  } = formData

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

  const handleImage = (e) => {
    // Files
    handleImageUpload(e)

    if (e.target.files) {
      setImgFlie(e.target.files[0])
      setSelectedFile(e.target.files[0])
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

  const onMarkChange = (e) => {
    let value = Number(e.target.value)
    setFormData((prevState) => ({
      ...prevState,
      totalMark: value,
    }))
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

  const fetchFaculty = (e) => {
    const colRef = collection(db, "faculty")
    const q = query(colRef, where("department", "==", selectedDepartment.value))

    getDocs(q)
      .then((snapshot) => {
        // console.log(snapshot.docs)
        let tempArray = []
        snapshot.docs.forEach((doc) => {
          tempArray.push({ ...doc.data(), DocId: doc.id })
        })

        var result = tempArray.map((item) => ({
          value: item.DocId,
          label: `${item.name} (${item.designation})`,
        }))
        // console.log(result)

        setFacultyData(result)
        setloadingText(false)
      })
      .catch((err) => {
        toast.error("Error fetching data ")
        setloadingText(false)
      })
  }

  useEffect(() => {
    if (selectedDepartment) {
      // collection ref
      fetchFaculty()
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDepartment])

  let InBoolean = false
  if (InstitutionalStudentPricing >= 0) {
    InBoolean = true
  }

  let CusatStudentFeeBoolean = false

  if (CurriculumCourse === false && CusatStudentsCourseFees >= 0) {
    CusatStudentFeeBoolean = true
  } else if (CurriculumCourse === true) {
    CusatStudentFeeBoolean = true
  } else {
    CusatStudentFeeBoolean = false
  }

  let totalMarkBoolean = false
  if (totalMark > 0) {
    totalMarkBoolean = true
  }

  const canSave =
    Boolean(CourseCode) &&
    Boolean(CourseName) &&
    Boolean(CourseFees >= 0) &&
    Boolean(InBoolean) &&
    // Boolean(imagedata) &&
    Boolean(totalMarkBoolean) &&
    Boolean(CusatStudentFeeBoolean) &&
    Boolean(CourseDescription) &&
    Boolean(CourseDuration) &&
    Boolean(selectedDepartment.value !== "") &&
    Boolean(CourseOfferedBy) &&
    Boolean(isSuccess) &&
    Boolean(courseFacultys.value !== "")

  let text = ` const canSave =
  Boolean(CourseCode) ${Boolean(CourseCode)}
  Boolean(CourseName) ${Boolean(CourseName)}
  Boolean(CourseFee) ${Boolean(CourseFees >= 0)}
  Boolean(InBoolean) ${Boolean(InBoolean)}
  // Boolean(imagedata) ${Boolean(imagedata)}
  Boolean(totalMarkBoolean) ${Boolean(totalMarkBoolean)}
  Boolean(CusatStudentFeeBoolean) ${Boolean(CusatStudentFeeBoolean)}
  Boolean(CourseDescription) ${Boolean(CourseDescription)}
  Boolean(CourseDuration) ${Boolean(CourseDuration)}
  Boolean(selectedDepartment.value !== "") ${Boolean(
    selectedDepartment.value !== ""
  )}
  Boolean(CourseOfferedBy) ${Boolean(CourseOfferedBy)}
  Boolean(isSuccess) ${Boolean(isSuccess)}
  Boolean(courseFacultys.value !== "") ${Boolean(courseFacultys.value !== "")}`

  // console.log("Curriculum Course:",CurriculumCourse)
  // console.log("C FEE:",CusatStudentsCourseFees)
  // console.log("Cusat Student Fee Boolean:",CusatStudentFeeBoolean)
  // console.log("canSave:",canSave)

  let text1 = `Boolean(CourseFee) ${Boolean(
    CourseFees >= 0
  )} Boolean(CusatStudentFeeBoolean) ${Boolean(
    CusatStudentFeeBoolean
  )}  Boolean(InBoolean) ${Boolean(InBoolean)}
  `

  //   validate Selected File Size
  const validateSelectedFile = () => {
    const MIN_FILE_SIZE = 200 //  200kb
    const MAX_FILE_SIZE = 1024 // 1MB

    if (!selectedFile) {
      setErrorMsg("Please choose a file")
      setIsSuccess(false)
      return
    }

    const fileSizeKiloBytes = selectedFile.size / 1024

    if (fileSizeKiloBytes < MIN_FILE_SIZE) {
      setErrorMsg("File size is less than minimum limit")
      setIsSuccess(false)
      return
    }
    if (fileSizeKiloBytes > MAX_FILE_SIZE) {
      setErrorMsg("File size is greater than maximum limit")
      setIsSuccess(false)
      return
    }

    setErrorMsg("")
    setIsSuccess(true)
  }
  useEffect(() => {
    if (imgFlie) {
      validateSelectedFile()
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result)
      }
      reader.readAsDataURL(imgFlie)
    } else {
      setPreview(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imgFlie])

  const onSubmit = async (e) => {
    e.preventDefault()

    setLoading(true)
    document.body.scrollIntoView()

    if (imgFlie.length > 1 || !isSuccess) {
      setLoading(false)
      toast.error("Max 1 image")
      return
    }

    // faculty data
    let tempFacultyData = []
    // console.log(courseFacultys)
    courseFacultys.map((person) => tempFacultyData.push(person.value))
    // console.log(tempFacultyData)

    // toastfy
    function toastfy(progress = "Creating  Course  in Progress") {
      if (toastId.current === null) {
        toastId.current = toast(`Creating  Course  in Progress,`)
      } else {
        toast.update(toastId.current, `Creating  Course  in Progress `)
      }
    }

    // Store image in firebase
    const storeImage = async (image, fileName, storageLocation) => {
      return new Promise((resolve, reject) => {
        const storage = getStorage()

        const storageRef = ref(storage, `${storageLocation}${fileName}`)

        const uploadTask = uploadBytesResumable(storageRef, image)

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = parseInt(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            )

            // console.log(progress)
            // check if we already displayed a toast

            toastfy(progress)

            switch (snapshot.state) {
              case "paused":
                // console.log('Upload is paused')
                break
              case "running":
                // console.log('Upload is running')
                break
              default:
                break
            }
          },
          (error) => {
            toast.error(error.message)
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL)
            })
          }
        )
      })
    }
    let imgUrl // to store the image url from storage
    // console.log(imgFlie)
    let fileName = `${v4()}-${imgFlie.name}`
    imgUrl = await storeImage(imgFlie, fileName, "/courses/images/")

    let thumbnailUrl // to store thumbnail image
    let thumbnailImageName = `${v4()}-${imagedata.name}`
    thumbnailUrl = await storeImage(
      imagedata,
      thumbnailImageName,
      "/courses/images/thumbnail/"
    )

    const formDataCopy = {
      ...formData,
      CourseFaculty: tempFacultyData,
      CourseDepartment: selectedDepartment.value,
      CourseImage: imgUrl,
      thumbnailImage: thumbnailUrl,
      imageLocation: `${"/courses/images/"}${fileName}`,
      thumbnailImageLocation: `${"courses/images/thumbnail/"}${thumbnailImageName}`,
      createdAt: serverTimestamp(),
    }

    try {
      await addDoc(collection(db, "courses/CDEC/cdecChildren"), formDataCopy)
      setLoading(false)
      toast.success(" Course Created Successfully")
      navigate("/admin/CDEC/Course/AllCourses")
    } catch (error) {
      setLoading(false)
      toast.error("Course  not saved")
      // console.log(error.message)
    }
  }

  async function handleImageUpload(event) {
    const imageFile = event.target.files[0]

    try {
      const compressedFile = await imageCompression(
        imageFile,
        CompressionOptions.thumbnailOptions
      )
      setImageData(compressedFile)
      // console.log(`compressedFile size ${compressedFile.size} MB`)
    } catch (error) {
      // console.log(error)
    }
  }

  return (
    <div className="">
      {loading ? (
        <Spinner />
      ) : (
        <form className="w-full">
          {/* Course Code (ID) */}
          <div className="mb-6">
            <div className="pb-2">
              {" "}
              <label htmlFor="CourseCode" className=" left-0  text-gray-600  ">
                Course Code (ID)
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
              onChange={onMutate}
            />
          </div>
          {/* Course name */}
          <div className="mb-6">
            <div className="pb-2">
              <label htmlFor="CourseName" className=" left-0  text-gray-600  ">
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
              <label htmlFor="CourseFees" className=" left-0  text-gray-600  ">
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
              <label htmlFor="CourseFees" className=" left-0  text-gray-600  ">
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
                setSelectedDepartment(selectedOption)
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
                  setCourseFacultys(selectedOption)
                }}
                isMulti
                isSearchable
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
                  <Link to="/admin/Faculty/addFaculty">
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
          <div className="my-6">
            <div className="pb-2">
              <label className=" left-0  text-gray-600  ">
                Course Brochure / Image -- aspect ratio: 3 : 2
              </label>
            </div>
            <div className="my-6 flex items-center space-x-6">
              {preview ? (
                <div className="shrink-0">
                  <img
                    className="object-cover w-64 rounded"
                    src={preview}
                    alt="Not Available Preview"
                  />
                </div>
              ) : null}
              <label className="block">
                <span className="sr-only">Choose an Image</span>
                <input
                  type="file"
                  accept="image/* "
                  onChange={handleImage}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </label>
            </div>
            <div className="space-between">
              <p className="text-base">Min size: 200kb </p>
              <p className="text-base">Max size: 1MB</p>
            </div>
            {isSuccess ? (
              <p className="text-base text-green-600">Size is compatible ✅ </p>
            ) : null}
            <p className="text-base text-red-600 ">
              {errorMsg && `${errorMsg} ⛔️`}
            </p>
          </div>

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
              Create Course
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

export default Form
