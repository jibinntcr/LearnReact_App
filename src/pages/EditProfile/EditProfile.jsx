import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import imageCompression from "browser-image-compression"
import { updateProfile } from "firebase/auth"
// React Select
import Select from "react-select"
import CreatableSelect from "react-select/creatable"
import CountryData from "./country-code.json"

//phone number Check
import PhoneNumber from "libphonenumber-js"

import "react-phone-input-2/lib/style.css"

// phone number
import PhoneInput from "react-phone-input-2"
import "./error.css"
//firebase firestore
import { db, storage } from "../../firebase.config"
import {
  doc,
  getDoc,
  Timestamp,
  getDocs,
  updateDoc,
  limit,
  collection,
  query,
  where,
} from "firebase/firestore"

import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage"

//components
import Spinner from "../../components/Spinner/Spinner"
import Footer from "../../components/Footer/Footer"
import Required from "../../components/Required Icon/Required"
//icons

// Date Picker
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

// toastify
import { toast } from "react-toastify"
//context
import { useUserAuth } from "../../context/UserAuthContext"
// data
import { options } from "./../../assets/state/state"

function EditProfile() {
  const toastId = React.useRef(null)

  const subtractFromDate = (
    date,
    { years, days, hours, minutes, seconds, milliseconds } = {}
  ) => {
    const millisecondsOffset = milliseconds ?? 0
    const secondsOffset = seconds ? 1000 * seconds : 0
    const minutesOffset = minutes ? 1000 * 60 * minutes : 0
    const hoursOffset = hours ? 1000 * 60 * 60 * hours : 0
    const daysOffset = days ? 1000 * 60 * 60 * 24 * days : 0
    const dateOffset =
      millisecondsOffset +
      secondsOffset +
      minutesOffset +
      hoursOffset +
      daysOffset

    let newDate = date
    if (years) newDate = date.setFullYear(date.getFullYear() - years)
    newDate = new Date(newDate - dateOffset)

    return newDate
  }

  var date = subtractFromDate(new Date(), { years: 19 })

  const [loading, setLoading] = useState(true)
  const [dateOfBirth, setDateOfBirth] = useState(date)

  const [collegeDepartment, setCollegeDepartment] = useState({
    value: "department name",
    label: "department name",
  })
  const [collegeCourse, setCollegeCourse] = useState({
    value: "Course name",
    label: "Course name",
  })
  const [departmentsList, setDepartmentsList] = useState({})
  const [courseList, setCourseList] = useState({})
  const [collegeDepartmentBoolean, setCollegeDepartmentBoolean] =
    useState(false)
  const [collegeCourseBoolean, setCollegeCourseBoolean] = useState(false)

  const navigate = useNavigate()

  const [imagedata, setimageData] = useState(null)

  const [selectedImage, setselectedImage] = useState()

  const [idCardData, setidCardData] = useState(null)

  const [selectIDCardImage, setselectIDCardImage] = useState(null)

  console.log(selectIDCardImage + "selectIDCardImage")

  const [num, setnum] = useState()

  const [profile, setProfile] = useState({
    dob: {
      seconds: 0,
      nanoseconds: 0,
    },
    name: "",
    email: "",
    mobile: "",
    gender: "female",
    address: "",
    country: "",
    state: "",
    pincode: 0,
    photo: "",
    idCardImg: "",
    linkedIn: "", //  Not Mandatory
    nonCusatStudent: false,
    cusatFlag: false,
    InstitutionType: "",
    universityRegNo: "",
    department: "",
    course: "",
    semester: "1",
    digiLockerId: "",
    abcId: "",
    universityName: "",
    aadharNo: "",
    highestQualification: "SSLC",
  })

  const { user } = useUserAuth()

  const {
    // Common for all users
    name,
    email,
    mobile,
    gender,
    dob,
    address,
    country,
    state,
    pincode,
    photo,
    linkedIn, //  Not Mandatory
    nonCusatStudent,
    cusatFlag,
    idCardImg,
    InstitutionType,
    // For (Cusat && NON-CUSAT) students
    universityRegNo, // For Cusat students = ( Not Mandatory since 1st years students may not have this ID)
    department,
    course,
    semester,
    digiLockerId,
    abcId, // Academic Bank of Credits
    // For  NON-CUSAT students
    universityName,
    // For professional users only
    aadharNo,
    highestQualification,
  } = profile

  useEffect(() => {
    // console.log("Profile:", profile)
  }, [profile])

  const [indianStates, setIndianStates] = useState(state)

  const [selectedCountry, setSelectedCountry] = useState("")

  function isEmptyObject() {
    if (collegeDepartment?.value === "department name") {
      // console.log("first" + Object.keys(collegeDepartment).length === 0)
      return Object.keys(collegeDepartment).length === 0
    }
  }

  const custom = (e) => {
    setProfile((prevState) => ({
      ...prevState,
      InstitutionType: e.target.value,
    }))

    if (e.target.value === "Other Institution") {
      setProfile((prevState) => ({
        ...prevState,
        idCardImg: "",
      }))
      setselectIDCardImage(null)
    }
  }

  const onMutate = (e) => {
    let boolean = null
    // console.log(e.target.value)

    if (e.target.value === "true") {
      boolean = true
    }
    if (e.target.value === "false") {
      boolean = false
    }

    // Text/Booleans
    if (!e.target.files) {
      setProfile((prevState) => ({
        ...prevState,
        [e.target.id]: boolean ?? e.target.value,
      }))
    }
    //console.log(profile)
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    let imgUrl = ""
    if (imagedata != null) {
      imgUrl = await storeImage(imagedata, "profile-image/", profile.DocId)
    } else {
      imgUrl = profile.photo
    }

    let idCardUrl = ""
    if (idCardData != null) {
      idCardUrl = await storeImage(idCardData, "IdCard/", profile.DocId)
    } else {
      idCardUrl = profile.idCardImg
    }

    const flag =
      Boolean(InstitutionType === "Recognised Institution under CUSAT") &&
      Boolean(selectIDCardImage || idCardImg)

    let formDataCopy = {
      ...profile,
      dob: Timestamp.fromDate(dateOfBirth),
      //department: collegeDepartment.value,
      RecognizedInstitutionFlag: flag,
      photo: imgUrl,
      idCardImg: idCardUrl,
      state: indianStates.value,
    }
    if (cusatFlag) {
      formDataCopy = {
        ...formDataCopy,
        department: collegeDepartment.value,
        course: collegeCourse.value,
      }
    }

    delete formDataCopy.cusatFlag

    if (cusatFlag || nonCusatStudent) {
      delete formDataCopy.highestQualification
      delete formDataCopy.aadharNo
      if (cusatFlag) {
        delete formDataCopy.universityName
      }
    } else {
      delete formDataCopy.universityRegNo
      delete formDataCopy.semester
      delete formDataCopy.department
      delete formDataCopy.collegeCourse
      delete formDataCopy.digiLockerId
      delete formDataCopy.abcId
    }
    try {
      if (user.displayName !== name) {
        // Update display name in fb
        await updateProfile(user, {
          displayName: name,
        })
        // Update in firestore
      }

      const userRef = doc(db, "users", user.uid)
      await updateDoc(userRef, formDataCopy)
      setLoading(false)

      toast.success("Profile details updated")
      navigate("/profile")
    } catch (error) {
      // console.log(error)
      toast.error("Could not update profile details")
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

  const fetchCourse = async () => {
    try {
      if (collegeDepartmentBoolean) {
        const q = query(
          collection(db, "departments"),
          where("name", "==", collegeDepartment.value),
          limit(1)
        )
        const docSnap = await getDocs(q)
        // Check if the QuerySnapshot is empty
        if (!docSnap.empty) {
          // Get the first document from the docSnap
          const firstDocument = docSnap.docs[0]

          // Extract the ID and data of the first document
          const docId = firstDocument.id
          let docData = firstDocument.data()

          docData = { ...docData, docId: docId }

          // setData(docData)

          // console.log("Document ID:", docId)
          // console.log("Document data:", docData)
          let options = []

          let array = docData.courses
          array.map((item) => {
            options.push({ value: item, label: item })
          })

          setCourseList(options)
        } else {
          toast.warning("Something went wrong, retry select department")
          // console.log("No documents found in the collection.")
        }
      } else {
        // console.log("No state provided!")
        // toast.warning("Something went wrong, retry select department")
      }
    } catch (error) {
      console.error("An error occurred:", error)

      toast.error("An error occurred while fetching data!")
    }
  }

  useEffect(() => {
    if (cusatFlag) {
      fetchCourse()
    }

    return () => {}
  }, [collegeDepartment])

  const fetchData = async (collectionName, docId, stateName) => {
    const docRef = doc(db, collectionName, docId)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      stateName({ ...profile, ...docSnap.data(), DocId: docSnap.id })
      //console.log("Document data:", docSnap.data())
      docSnap.data().dob &&
        setDateOfBirth(new Date(docSnap.data().dob.seconds * 1000))
      docSnap.data().state &&
        setIndianStates({
          value: docSnap.data().state,
          label: docSnap.data().state,
        })
      docSnap.data().department &&
        setCollegeDepartment({
          value: docSnap.data().department,
          label: docSnap.data().department,
        })
      docSnap.data().course &&
        setCollegeCourse({
          value: docSnap.data().course,
          label: docSnap.data().course,
        })
    } else {
      // doc.data() will be undefined in this case
      toast.error("Something went wrong !")
    }
  }

  useEffect(() => {
    const getId = async () => {
      await fetchData(`users`, user.uid, setProfile)
      await fetchDepartments()
    }
    getId()
    setLoading(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (
      collegeDepartment.value.length === 0 ||
      collegeDepartment.value === "department name"
    ) {
      setCollegeDepartmentBoolean(false)
    } else {
      setCollegeDepartmentBoolean(true)
    }
    // console.log(collegeCourseBoolean)
  }, [collegeDepartment])

  useEffect(() => {
    if (
      collegeCourse.value?.length === 0 ||
      collegeCourse.value === "Course name"
    ) {
      setCollegeCourseBoolean(false)
    } else {
      setCollegeCourseBoolean(true)
    }
  }, [collegeCourse])

  useEffect(() => {
    if (indianStates.value !== null) {
      setProfile((prevState) => ({
        ...prevState,
        state: indianStates.value,
      }))
    }
  }, [indianStates])

  const borderColor = (field) => {
    return Boolean(field) ? "border-green-300" : "border-yellow-300"
  }

  async function handleImageUpload(event) {
    if (event.target.files && event.target.value) {
      setselectedImage(event.target.files[0])
    }

    const imageFile = event.target.files[0]

    const optionsCompress = {
      maxSizeMB: 0.3,
      maxWidthOrHeight: 1920,
    }
    try {
      const compressedFile = await imageCompression(imageFile, optionsCompress)
      setimageData(compressedFile)
    } catch (error) {
      // console.log(error)
    }
  }

  async function handleIdCardUpload(event) {
    if (event.target.files && event.target.value) {
      setselectIDCardImage(event.target.files[0])
    }

    const imageFile = event.target.files[0]

    const optionsCompress = {
      maxSizeMB: 0.3,
      maxWidthOrHeight: 1920,
    }
    try {
      const compressedFile = await imageCompression(imageFile, optionsCompress)
      setidCardData(compressedFile)
    } catch (error) {
      // console.log(error)
    }
  }

  function toastfy(progress = "Creating  Course  in Progress") {
    if (toastId.current === null) {
      toastId.current = toast(`Updation in Progress,`)
    } else {
      toast.update(toastId.current, `Updation in Progress `)
    }
  }

  // Store image in firebase
  const storeImage = async (image, storageName, fileName) => {
    return new Promise((resolve, reject) => {
      const storageRef = ref(storage, storageName + fileName)

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

  const [phoneError, setPhoneError] = useState("")

  const [error, seterror] = useState(false)

  const PhoneNumberCheck = (e) => {
    let isValid = null
    let concatedNumber = "+" + e

    try {
      const phoneNumberInstance = PhoneNumber(concatedNumber)
      isValid = phoneNumberInstance.isValid()
    } catch (error) {
      console.error("Error validating phone number:", error)
      isValid = false
    }

    if (isValid === true) {
      setProfile((prevdata) => ({
        ...prevdata,
        mobile: concatedNumber,
      }))
      seterror(false)
      setPhoneError("")
      document.getElementById("save-btn").style.visibility = "visible"
    } else {
      seterror(true)
      setPhoneError("Check Your Phone Number")
      document.getElementById("save-btn").style.visibility = "hidden"
    }
  }

  const [aadharno, setAadharNo] = useState("")

  useEffect(() => {
    // combineAadhaar()
    let part1 = aadharNo.slice(0, 4) + "-"
    let part2 = aadharNo.slice(4, 8) + "-"
    let part3 = aadharNo.slice(8, 12)
    // console.log("formatedValue:"+part1+part2+part3);
    setAadharNo(part1 + part2 + part3)
  }, [aadharNo])

  const adharChange = (event) => {
    const inputValue = event.target.value.replace(/\D/g, "")

    let formattedValue = inputValue
    if (inputValue.length > 4) {
      formattedValue = `${inputValue.substr(0, 4)}-${inputValue.substr(4, 4)}`
    }
    if (inputValue.length > 8) {
      formattedValue += `-${inputValue.substr(8, 4)}`
    }

    setAadharNo(formattedValue)

    setProfile((prevState) => ({
      ...prevState,
      aadharNo: formattedValue.replace(/\D/g, ""),
    }))

    if (event.nativeEvent.inputType === "deleteContentBackward") {
      // If backspace is pressed, set the formatted value without modifying it
      setAadharNo(event.target.value)
    }

    // console.log("adharno"+profile.aadharNo)
  }

  useEffect(() => {
    setSelectedCountry(country)
  }, [country])

  const handleCountryChange = (e) => {
    setSelectedCountry(e.target.value)

    let boolean = null
    // console.log(e.target.value)

    if (e.target.value === "true") {
      boolean = true
    }
    if (e.target.value === "false") {
      boolean = false
    }

    // Text/Booleans
    if (!e.target.files) {
      setProfile((prevState) => ({
        ...prevState,
        [e.target.id]: boolean ?? e.target.value,
      }))
      // console.log(profile)
    }
  }

  let text = `collegeDepartmentBoolean ${Boolean(
    collegeDepartmentBoolean
  )} collegeCourseBoolean  ${Boolean(
    collegeCourseBoolean
  )} Boolean(email) ${Boolean(email)} && Boolean(name)  ${Boolean(name)} 
       && Boolean(mobile)  ${Boolean(mobile)} &&  Boolean(gender)${Boolean(
         gender
       )}
        &&  Boolean(dateOfBirth)${Boolean(
          dateOfBirth
        )} &&  Boolean(address)${Boolean(address)}
         &&  Boolean(pincode)${Boolean(
           pincode
         )} &&Boolean(highestQualification) ${Boolean(highestQualification)} 
          && Boolean(aadharNo)  ${Boolean(aadharNo)}`

  let idCardImgBoolean = false

  if (idCardImg !== "") {
    // console.log("True")
    // debugger
    idCardImgBoolean = true
  } else {
    if (InstitutionType === "Other Institution") {
      idCardImgBoolean = true
      // debugger
    } else if (
      InstitutionType === "Recognised Institution under CUSAT" &&
      selectIDCardImage !== null
    ) {
      // debugger
      idCardImgBoolean = true
    }
  }

  const sai = `  nonCusatStudent ${nonCusatStudent} &&
    Boolean(universityName) ${Boolean(universityName)} &&
    Boolean(universityRegNo) ${Boolean(universityRegNo)}&&
    Boolean(department) ${Boolean(department)} &&
    collegeCourseBoolean ${collegeCourseBoolean}&&
    Boolean(semester) ${Boolean(semester)}&&
    Boolean(digiLockerId) ${Boolean(digiLockerId)} &&
    Boolean(abcId) ${Boolean(abcId)}&&
    Boolean(InstitutionType === "Recognised Institution under CUSAT") ${Boolean(
      InstitutionType === "Recognised Institution under CUSAT"
    )} &&
    Boolean(selectIDCardImage) ${Boolean(selectIDCardImage)}`

  const canSave =
    Boolean(email) &&
    Boolean(pincode.toString().length === 6) &&
    Boolean(state) &&
    Boolean(name) &&
    Boolean(mobile) &&
    Boolean(gender) &&
    Boolean(dateOfBirth) &&
    Boolean(address) &&
    Boolean(country) &&
    ((collegeDepartmentBoolean &&
      collegeCourseBoolean &&
      Boolean(semester) &&
      Boolean(digiLockerId) &&
      Boolean(abcId) &&
      cusatFlag) || // Cusat
      (nonCusatStudent &&
        Boolean(universityName) &&
        Boolean(universityRegNo) &&
        Boolean(department) &&
        collegeCourseBoolean &&
        Boolean(semester) &&
        Boolean(digiLockerId) &&
        Boolean(abcId) &&
        Boolean(InstitutionType === "Other Institution")) || // non Cusat
      (nonCusatStudent &&
        Boolean(universityName) &&
        Boolean(universityRegNo) &&
        Boolean(department) &&
        collegeCourseBoolean &&
        Boolean(semester) &&
        Boolean(digiLockerId) &&
        Boolean(abcId) &&
        Boolean(InstitutionType === "Recognised Institution under CUSAT") &&
        Boolean(selectIDCardImage || idCardImg)) || // Recognized Institution
      (!nonCusatStudent &&
        Boolean(aadharNo.toString().length === 12) &&
        Boolean(highestQualification))) // professional

  return loading ? (
    <Spinner />
  ) : email.length > 0 ? (
    <>
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full ">
          {/* <img className="mx-auto h-12 w-auto" src="https://tailwindui.com/img/logos/workflow-mark-green-600.svg" alt="Workflow" /> */}
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Update your account details
          </h2>
          {/* <p className="mt-2 text-center text-sm text-gray-600 max-w">
                        Already registered?
                        <a href="#" className="font-medium text-green-600 hover:text-green-500 focus:outline-none focus:ring-2 focus:ring-green-500">Sign in</a>
                    </p> */}
        </div>

        <div className="mt-8 sm:mx-auto w-full sm:w-4/6">
          <div className="bg-white py-8 px-6 shadow rounded-lg sm:px-10">
            <form className="mb-0 space-y-6" onSubmit={onSubmit}>
              <div className="mx-auto w-64 text-center">
                <div className="flex justify-center flex-col items-center w-64">
                  {selectedImage ? (
                    <img
                      id="profile-img"
                      className="h-32 w-32 bg-gray-100 p-2 rounded-full shadow mb-4"
                      src={URL.createObjectURL(selectedImage)}
                      alt="profile"
                    />
                  ) : (
                    <img
                      id="profile-img"
                      className="h-32 w-32 bg-gray-100 p-2 rounded-full shadow mb-4"
                      src={photo ? photo : user.photoURL}
                      alt="profile"
                    />
                  )}

                  <div className="m-2">
                    <label
                      className="block mb-2 text-sm font-medium text-gray-900"
                      htmlFor="file_input"
                    >
                      Upload Image
                    </label>
                    <input
                      className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 "
                      id="file_input"
                      type="file"
                      onChange={(e) => {
                        handleImageUpload(e)
                      }}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 md:text-base md:mb-1"
                >
                  Email address{" "}
                  <span className="opacity-70 text-sm">(Can't change)</span>{" "}
                  <Required />
                </label>
                <div className="mt-1">
                  <input
                    className={borderColor(email)}
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    disabled
                    required
                    value={email}
                    onChange={onMutate}
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 md:text-base md:mb-1"
                >
                  Name <Required />
                </label>
                <div className="mt-1">
                  <input
                    id="name"
                    className={borderColor(name)}
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    value={name}
                    onChange={onMutate}
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="mobile"
                  className="block text-sm font-medium text-gray-700 md:text-base md:mb-1"
                >
                  Mobile number <Required />
                </label>
                <div className="mt-1">
                  <PhoneInput
                    //containerStyle={{ backgroundColor: 'blue', padding: '10px' }}
                    country={"IN"}
                    value={mobile}
                    onChange={(value) => PhoneNumberCheck(value)}
                    countryCodeEditable={false}
                    inputClassName={error ? ".error" : ""}
                    required
                    defaultErrorMessage="Number is Not Valid!"
                  />
                  {phoneError && <p className="text-red-600">{phoneError}</p>}
                  {/* <input id="mobile"
                                            className={borderColor(mobile)}
                                            name="mobile"
                                            type="number"
                                            autoComplete="mobile"
                                            required value={mobile}
                                            onChange={onMutate} /> */}
                </div>
              </div>

              <div>
                <label
                  htmlFor="gender"
                  className="block text-sm  font-medium text-gray-700 md:text-base md:mb-1"
                >
                  Gender <Required />
                </label>
                <div className="mt-1 ">
                  <select
                    name="gender"
                    className={borderColor(gender)}
                    id="gender"
                    value={gender}
                    onChange={onMutate}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div>
                <label
                  htmlFor="dateOfBirth"
                  className="block text-sm font-medium text-gray-700 md:text-base md:mb-1"
                >
                  {" "}
                  Date of Birth <Required />
                </label>
                <DatePicker
                  selected={dateOfBirth}
                  className={borderColor(dateOfBirth)}
                  onChange={(date) => setDateOfBirth(date)}
                  dateFormat="dd/MM/yyyy"
                  minDate={new Date("1945-08-15")}
                  maxDate={subtractFromDate(new Date(), { years: 10 })}
                  showYearDropdown
                  showMonthDropdown
                  scrollableYearDropdown
                  scrollableMonthDropdown
                  id="dateOfBirth"
                />
              </div>

              <div>
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700 md:text-base md:mb-1"
                >
                  {" "}
                  Address <Required />
                </label>
                <div className="mt-1">
                  <textarea
                    className={borderColor(address)}
                    id="address"
                    name="address"
                    type="text"
                    autoComplete="address"
                    required
                    value={address}
                    onChange={onMutate}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="pincode"
                  className="block text-sm font-medium text-gray-700 md:text-base md:mb-1"
                >
                  Pin Code <Required />
                </label>
                <div className="mt-1 w-1/2">
                  <input
                    className={borderColor(pincode.toString().length === 6)}
                    id="pincode"
                    name="pincode"
                    type="number"
                    pattern="^[1-9][0-9]{5}"
                    min="100000"
                    max="999999"
                    required
                    value={pincode}
                    onChange={onMutate}
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="country"
                  className="block text-sm font-medium text-gray-700 md:text-base md:mb-1"
                >
                  Country <Required />
                </label>
                <select
                  value={selectedCountry ? selectedCountry : country}
                  onChange={handleCountryChange}
                  className={borderColor(country)}
                  name="country"
                  id="country"
                >
                  {CountryData.map((data) => (
                    <option value={data.name}>{data.name}</option>
                  ))}
                </select>
              </div>
              {selectedCountry === "India" && (
                <div>
                  <label
                    htmlFor="state"
                    className="block text-sm font-medium text-gray-700 md:text-base md:mb-1"
                  >
                    State <Required />
                  </label>
                  <div className="mt-1">
                    <Select
                      options={options}
                      className={borderColor(state)}
                      onChange={(selectedOption) => {
                        setIndianStates(selectedOption)
                      }}
                      isSearchable
                      value={indianStates}
                    />
                  </div>
                </div>
              )}

              {selectedCountry !== "India" && (
                <div>
                  <label
                    htmlFor="linkedIn"
                    className="block text-sm font-medium text-gray-700 md:text-base md:mb-1"
                  >
                    State
                  </label>
                  <div className="mt-1">
                    <input
                      className={borderColor(state)}
                      id="state"
                      name="state"
                      type="text"
                      autoComplete="name"
                      value={state}
                      onChange={onMutate}
                      required
                    />
                  </div>
                </div>
              )}

              {/* {text} */}

              <div>
                <label
                  htmlFor="linkedIn"
                  className="block text-sm font-medium text-gray-700 md:text-base md:mb-1"
                >
                  linkedIn Profile Url{" "}
                </label>
                <div className="mt-1">
                  <input
                    id="linkedIn"
                    name="linkedIn"
                    type="text"
                    autoComplete="name"
                    value={linkedIn}
                    onChange={onMutate}
                  />
                </div>
              </div>

              {!cusatFlag && (
                <div>
                  <label
                    htmlFor="nonCusatStudent"
                    className="block text-sm font-medium text-gray-700 md:text-base md:mb-1"
                  >
                    Profession <Required />
                  </label>
                  <div className="mt-1">
                    <select
                      name="nonCusatStudent"
                      id="nonCusatStudent"
                      value={nonCusatStudent}
                      onChange={onMutate}
                    >
                      <option value={false}>Professional</option>
                      <option value={true}>Student </option>
                    </select>
                  </div>
                </div>
              )}

              {(cusatFlag || nonCusatStudent) && (
                <>
                  {nonCusatStudent && (
                    <>
                      {/* {InstitutionType} */}
                      <div>
                        <label
                          htmlFor="nonCusatStudent"
                          className="block text-sm font-medium text-gray-700 md:text-base md:mb-1"
                        >
                          Institution Type
                          <Required />
                        </label>
                        <div className="mt-1">
                          <select
                            name="InstitutionType"
                            id="InstitutionType"
                            className={borderColor(InstitutionType)}
                            value={InstitutionType}
                            onChange={custom}
                          >
                            <option selected></option>
                            <option
                              value={"Recognised Institution under CUSAT"}
                            >
                              Recognised Institution under CUSAT
                            </option>
                            <option value={"Other Institution"}>
                              Other Institution
                            </option>
                          </select>
                        </div>
                      </div>
                      {/* {InstitutionType Ends} */}

                      <div>
                        <label
                          htmlFor="universityName"
                          className="block text-sm font-medium text-gray-700 md:text-base md:mb-1"
                        >
                          {InstitutionType ===
                          "Recognised Institution under CUSAT"
                            ? "College name"
                            : "University name"}
                          <Required />
                        </label>
                        <div className="mt-1">
                          <input
                            className={borderColor(universityName)}
                            id="universityName"
                            name="universityName"
                            type="text"
                            autoComplete="name"
                            required
                            value={universityName}
                            onChange={onMutate}
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="universityRegNo"
                          className="block text-sm font-medium text-gray-700 md:text-base md:mb-1"
                        >
                          University Registration Number <Required />
                        </label>
                        <div className="mt-1">
                          <input
                            className={borderColor(universityRegNo)}
                            id="universityRegNo"
                            min="1"
                            name="universityRegNo"
                            type="number"
                            autoComplete="name"
                            required
                            value={universityRegNo}
                            onChange={onMutate}
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {/* {(cusatFlag || nonCusatStudent) && 
                                    <>
                                    {nonCusatStudent &&

                                    <div>
                                        <label htmlFor="aadharNo" className="block text-sm font-medium text-gray-700 md:text-base md:mb-1">Aadhar Number <span className="opacity-70 text-sm" >( Without spaces)</span> <Required /></label>
                                        <div className="mt-1">
                                            <input className={borderColor(aadharNo ? aadharNo.toString().length === 12 : false)} id="aadharNo" min="100000000000" max="999999999999" name="aadharNo" type="number" autoComplete="name" required value={aadharNo} onChange={onMutate} />
                                        </div>
                                    </div>
                                    
                                    }
                                    </>
                             } */}

                  {cusatFlag && (
                    <div>
                      <label
                        htmlFor="universityRegNo"
                        className="block text-sm font-medium text-gray-700 md:text-base md:mb-1"
                      >
                        University Registration Number{" "}
                      </label>
                      <div className="mt-1">
                        <input
                          id="universityRegNo"
                          min="1"
                          name="universityRegNo"
                          type="number"
                          autoComplete="name"
                          value={universityRegNo}
                          onChange={onMutate}
                        />
                      </div>
                    </div>
                  )}

                  {cusatFlag && (
                    <div>
                      <label htmlFor="department">
                        <div className="flex items-center">
                          <p className="block text-sm font-medium text-gray-700 md:text-base md:mb-1">
                            Department <Required /> &nbsp;{" "}
                          </p>
                          {!isEmptyObject(collegeDepartment) &&
                          collegeDepartment.value !== "department name" ? (
                            <p className="text-xs text-green-600"> ✅ </p>
                          ) : (
                            <p className="text-xs text-red-600 "> ⛔️</p>
                          )}
                        </div>
                      </label>

                      <Select
                        options={departmentsList}
                        onChange={(selectedOption) => {
                          setCollegeDepartment(selectedOption)
                          setCollegeCourse({
                            value: "Course name",
                            label: "Course name",
                          })
                        }}
                        isSearchable
                        value={collegeDepartment}
                      />
                    </div>
                  )}

                  {!cusatFlag && (
                    <div>
                      <label htmlFor="department">
                        <div className="flex items-center">
                          <p className="block text-sm font-medium text-gray-700 md:text-base md:mb-1">
                            Department <Required /> &nbsp;{" "}
                          </p>
                          {Boolean(department) ? (
                            <p className="text-xs text-green-600"> ✅ </p>
                          ) : (
                            <p className="text-xs text-red-600 "> ⛔️</p>
                          )}
                        </div>
                      </label>

                      <input
                        className={borderColor(department)}
                        id="department"
                        name="department"
                        type="text"
                        autoComplete="name"
                        value={department}
                        onChange={onMutate}
                      />
                    </div>
                  )}

                  <div>
                    <label htmlFor="course">
                      <div className="flex items-center">
                        <p className="block text-sm font-medium text-gray-700 md:text-base md:mb-1">
                          Course <Required /> &nbsp;{" "}
                        </p>
                        {!isEmptyObject(collegeCourse) &&
                        collegeCourse.value !== "Course name" ? (
                          <p className="text-xs text-green-600"> ✅ </p>
                        ) : (
                          <p className="text-xs text-red-600 "> ⛔️</p>
                        )}
                      </div>
                    </label>

                    {cusatFlag && (
                      <Select
                        options={courseList}
                        isSearchable={false}
                        onChange={(selectedOption) => {
                          setCollegeCourse(selectedOption)
                        }}
                        value={collegeCourse}
                      />
                    )}
                    {!cusatFlag && (
                      <input
                        className={borderColor(department)}
                        id="course"
                        name="course"
                        type="text"
                        value={course}
                        onChange={onMutate}
                      />
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="semester"
                      className="block text-sm font-medium text-gray-700 md:text-base  md:mb-1"
                    >
                      Semester <Required />
                    </label>
                    <select
                      className={`${borderColor(semester)}   md:w-1/4 `}
                      name="semester"
                      id="semester"
                      value={semester}
                      onChange={onMutate}
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
                  {/* {} */}
                  {InstitutionType === "Recognised Institution under CUSAT" && (
                    <div className="my-6">
                      <div className="pb-2">
                        <label className=" left-0  text-gray-600  ">
                          ID CARD <Required />
                        </label>
                      </div>
                      <div className="my-6 flex items-center space-x-6">
                        {selectIDCardImage ? (
                          <div className="shrink-0">
                            <img
                              id="idCardImg"
                              className="object-cover w-64 rounded"
                              src={URL.createObjectURL(selectIDCardImage)}
                              alt="idImage"
                            />
                          </div>
                        ) : idCardImg ? (
                          <div className="shrink-0">
                            <img
                              className="object-cover w-64 rounded"
                              src={idCardImg}
                              alt="Not Available Preview"
                            />
                          </div>
                        ) : null}
                        <label className="block">
                          <span className="sr-only">Choose an Image </span>
                          <input
                            id="file_input"
                            type="file"
                            accept="image/* "
                            onChange={(e) => {
                              handleIdCardUpload(e)
                            }}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                          />
                        </label>
                      </div>
                    </div>
                  )}

                  {/* {} */}
                  <div>
                    <label
                      htmlFor="digiLockerId"
                      className="block text-sm font-medium text-gray-700 md:text-base md:mb-1"
                    >
                      DigiLocker ID <Required />
                    </label>
                    <div className="mt-1">
                      <input
                        className={borderColor(digiLockerId)}
                        id="digiLockerId"
                        name="digiLockerId"
                        type="text"
                        autoComplete="digiLockerId"
                        required
                        value={digiLockerId}
                        onChange={onMutate}
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="abcId"
                      className="block text-sm font-medium text-gray-700 md:text-base md:mb-1"
                    >
                      ABC ID{" "}
                      <span className="opacity-70 text-sm">
                        (Academic Bank of Credits)
                      </span>{" "}
                      <Required />
                    </label>
                    <div className="mt-1">
                      <input
                        className={borderColor(abcId)}
                        id="abcId"
                        name="abcId"
                        type="text"
                        autoComplete="abcId"
                        required
                        value={abcId}
                        onChange={onMutate}
                      />
                    </div>
                  </div>
                </>
              )}

              {!(cusatFlag || nonCusatStudent) && (
                <>
                  <div>
                    <label
                      htmlFor="aadharNo"
                      className="block text-sm font-medium text-gray-700 md:text-base md:mb-1"
                    >
                      Aadhar Number{" "}
                      <span className="opacity-70 text-sm">
                        ( Without spaces)
                      </span>{" "}
                      <Required />
                    </label>
                    <div className="mt-1">
                      <input
                        id="1"
                        className={borderColor(
                          aadharNo ? aadharNo.length === 12 : false
                        )}
                        min="1000"
                        max="9999"
                        type="tel"
                        value={aadharno}
                        onChange={adharChange}
                        maxLength={14}
                        required
                        // onKeyUp={combineAadhaar}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="highestQualification"
                      className="block text-sm font-medium text-gray-700 md:text-base md:mb-1"
                    >
                      Highest Qualification <Required />
                    </label>
                    <select
                      name="highestQualification"
                      className={`${borderColor(
                        highestQualification
                      )} md:w-1/2  `}
                      id="highestQualification"
                      value={highestQualification}
                      onChange={onMutate}
                    >
                      <option key={0} value="SSLC">
                        SSLC
                      </option>
                      <option key={1} value="Plus 2">
                        Plus 2
                      </option>
                      <option key={2} value="Degree">
                        Degree
                      </option>
                      <option key={3} value="Diploma">
                        Diploma
                      </option>
                      <option key={4} value="Ph.D">
                        Ph.D
                      </option>
                      <option key={5} value="Other">
                        Other
                      </option>
                    </select>
                  </div>
                </>
              )}

              {/* <div className="flex items-center">
                                    <input id="terms-and-privacy" name="terms-and-privacy" type="checkbox" className="" />
                                    <label htmlFor="terms-and-privacy" className="ml-2 block text-sm text-gray-900"
                                    >I agree to the
                                        <a href="link" className="text-green-600 hover:text-green-500">Terms</a>
                                        and
                                        <a href="link" className="text-green-600 hover:text-green-500">Privacy Policy</a>.
                                    </label>
                                </div> */}

              <div>
                <button
                  id="save-btn"
                  disabled={!canSave}
                  type="submit"
                  className={
                    canSave
                      ? "w-full sm:mx-auto text-gray-900  bg-green-400 rounded-lg border border-primary text-base sm:text-lg p-3 transition ease-in-out duration-500 sm:w-1/2"
                      : "sm:mx-auto sm:w-1/2 w-full  text-gray-400 bg-green-200 rounded-lg border border-primary text-lg p-3 transition ease-in-out duration-500"
                  }
                >
                  Update profile
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </>
  ) : (
    "Data not available"
  )
}

export default EditProfile
