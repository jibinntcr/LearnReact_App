import React, { useState, useEffect } from "react"

import { v4 } from "uuid"
import { db } from "../../../firebase.config"
import {
  collection,
  serverTimestamp,
  addDoc,
  getDoc,
  doc,
} from "firebase/firestore"

import Select from "react-select"

import { useNavigate, useLocation } from "react-router-dom"
import { toast } from "react-toastify"
import {
  ref,
  getDownloadURL,
  getStorage,
  uploadBytesResumable,
} from "firebase/storage"

//components
import Required from "../../../components/Required Icon/Required"
import Spinner from "../../../components/Spinner/Spinner"

function CreateFacultyForm() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [departmentsList, setDepartmentsList] = useState({})
  // State
  const [formData, setFormData] = useState({
    name: "", // data type changed
    photo: "",
    designation: "",
    // department: "",
    affiliation: "",
    email: "",
    phone: "",
    iqacUrl: "",
    linkedin: "",
    cv: "",
    GoogleScholarLink: "",
  })

  const {
    name,
    designation,
    affiliation,
    email,
    phone,
    iqacUrl,
    linkedin,
    GoogleScholarLink,
  } = formData

  // file size checker
  const [selectedFile, setSelectedFile] = useState()
  const [errorMsg, setErrorMsg] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const [imgFlie, setImgFlie] = useState(null)
  const [preview, setPreview] = useState()

  const [errorMsgCv, setErrorMsgCv] = useState(false)
  const [isSuccessCv, setIsSuccessCv] = useState(false)
  const [CvFlie, setCvFlie] = useState(null)
  const [selectedCv, setSelectedCv] = useState()

  const [selectedDepartment, setSelectedDepartment] = useState({
    value: "",
    label: "",
  })

  const handleImage = (e) => {
    // Files

    if (e.target.files) {
      setImgFlie(e.target.files[0])
      setSelectedFile(e.target.files[0])
    }
  }

  const handleCv = (e) => {
    // Files

    if (e.target.files) {
      setCvFlie(e.target.files[0])
      setSelectedCv(e.target.files[0])
    }
  }

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
    // console.log(formData)
    // console.log("cv",CvFlie)
  }

  const fetchDepartments = async () => {
    const docRef1 = doc(db, "departments", "list")

    const docSnap = await getDoc(docRef1)

    if (docSnap.exists()) {
      const array = docSnap.data().names

      let options = []
      array?.map((item) => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const canSave =
    Boolean(selectedDepartment.value !== "") &&
    Boolean(isSuccess) &&
    Boolean(name) &&
    Boolean(designation) &&
    Boolean(selectedDepartment.value !== "") &&
    Boolean(affiliation) &&
    Boolean(email) &&
    Boolean(phone.length === 10)

  //   validate Selected File Size
  const validateSelectedFile = () => {
    const MIN_FILE_SIZE = 50 //  50kb
    const MAX_FILE_SIZE = 200 // 200kb

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

  const validateSelectedCv = () => {
    const MIN_FILE_SIZE = 50 //  50kb
    const MAX_FILE_SIZE = 1000 // 200kb

    if (!selectedCv) {
      setErrorMsgCv("Please choose a file")
      setIsSuccessCv(false)
      return
    }

    const fileSizeKiloBytes = selectedCv.size / 1024

    if (fileSizeKiloBytes < MIN_FILE_SIZE) {
      setErrorMsgCv("File size is less than minimum limit")
      setIsSuccessCv(false)
      return
    }
    if (fileSizeKiloBytes > MAX_FILE_SIZE) {
      setErrorMsgCv("File size is greater than maximum limit")
      setIsSuccessCv(false)
      return
    }

    setErrorMsgCv("")
    setIsSuccessCv(true)
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

  // useEffect for cv
  useEffect(() => {
    if (CvFlie) {
      validateSelectedCv()
    }
  }, [CvFlie])

  const storeCv = async (cvFile) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage()
      const fileName = `${v4()}-${cvFile.name}`

      const storageRef = ref(storage, "FacultyCv/" + fileName)

      const uploadTask = uploadBytesResumable(storageRef, cvFile)

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = parseInt(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          )

          // console.log(progress)
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
          reject(error)
          toast.error(" Cv Upload Failed")
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL)
          })
        }
      )
    })
  }

  const onSubmit = async (e) => {
    e.preventDefault()

    setLoading(true)
    // document.body.scrollIntoView()

    if (imgFlie.length > 1 || !isSuccess) {
      setLoading(false)
      toast.error("Max 1 image")
      return
    }

    // Store image in firebase
    const storeImage = async (image) => {
      return new Promise((resolve, reject) => {
        const storage = getStorage()
        const fileName = `${v4()}-${image.name}`

        const storageRef = ref(storage, "Faculties/" + fileName)

        const uploadTask = uploadBytesResumable(storageRef, image)

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = parseInt(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            )

            // console.log(progress)
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
            reject(error)
            toast.success(" Image Upload Failed")
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
    imgUrl = await storeImage(imgFlie)

    let cvUrl
    if (CvFlie !== null) {
      // console.log(cvUrl)
      cvUrl = await storeCv(CvFlie)
    } else {
      cvUrl = ""
    }

    const formDataCopy = {
      ...formData,
      photo: imgUrl,
      cv: cvUrl,
      department: selectedDepartment.value,
      createdAt: serverTimestamp(),
    }

    addDoc(collection(db, "faculty"), formDataCopy)
      .then(() => {
        setLoading(false)
        toast.success("Faculty added  successfully")

        if (pathname.toLowerCase().includes("cusatech")) {
          navigate("/cusatech/admin")
        } else {
          navigate("/admin")
        }
      })
      .catch((err) => {
        setLoading(false)

        toast.error(err.message)
      })

    setPreview(null)
    setImgFlie(null)
    setSelectedFile(null)
    setIsSuccess(false)

    setCvFlie(null)
    setSelectedCv(null)
    setIsSuccessCv(false)
  }

  return (
    <div className="">
      {loading ? (
        <>
          <Spinner />
        </>
      ) : (
        <form className="w-full">
          {/* name */}
          <div className="mb-6">
            <div className="pb-2">
              <label htmlFor="name" className=" left-0  text-gray-600  ">
                Faculty Name
                <Required />
              </label>
            </div>

            <input
              required
              type="text"
              placeholder="Faculty Name"
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
              name="name"
              id="name"
              onChange={onMutate}
              value={name}
            />
          </div>

          {/* Designation */}
          <div className="mb-6">
            <div className="pb-2">
              <label htmlFor="designation" className=" left-0  text-gray-600  ">
                Designation
                <Required />
              </label>
            </div>

            <input
              required
              type="text"
              placeholder="Designation"
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
              name="designation"
              id="designation"
              onChange={onMutate}
              value={designation}
            />
          </div>

          {/* Affiliation */}
          <div className="mb-6">
            <div className="pb-2">
              <label htmlFor="affiliation" className=" left-0  text-gray-600  ">
                Affiliation
                <Required />
              </label>
            </div>

            <input
              required
              type="text"
              placeholder="affiliation"
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
              name="affiliation"
              id="affiliation"
              onChange={onMutate}
              value={affiliation}
            />
          </div>

          {/* department */}
          <div className="my-6">
            <div className="pb-2">
              <label htmlFor="department" className=" left-0  text-gray-600  ">
                Department
                <Required />
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

          <div className="mb-6">
            <div className="pb-2">
              <label htmlFor="email" className=" left-0  text-gray-600  ">
                Email
                <Required />
              </label>
            </div>

            <input
              required
              type="email"
              placeholder="Email"
              className="
                              w-full
                              rounded
                              p-3
                              border-gray-500
                              text-gray-800
                              outline-none
                              focus-visible:shadow-none
                              focus:border-primary
                              "
              name="email"
              id="email"
              onChange={onMutate}
              value={email}
            />
          </div>

          <div className="mb-6">
            <div className="pb-2">
              <label htmlFor="email" className=" left-0  text-gray-600  ">
                Phone
                <Required />
              </label>
            </div>

            <input
              required
              type="tel"
              placeholder="Phone number "
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
              name="phone"
              id="phone"
              onChange={onMutate}
              value={phone}
            />
          </div>

          {/* iqacUrl */}
          <div className="mb-6">
            <div className="pb-2">
              <label htmlFor="iqacUrl" className=" left-0  text-gray-600  ">
                IQAC Profile URL Link
              </label>
            </div>

            <input
              type="text"
              placeholder="IQAC Profile URL Link "
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
              name="iqacUrl"
              id="iqacUrl"
              onChange={onMutate}
              value={iqacUrl}
            />
          </div>

          <div className="mb-6">
            <div className="pb-2">
              <label htmlFor="linkedin" className=" left-0  text-gray-600  ">
                Linkedin profile url
              </label>
            </div>

            <input
              type="text"
              placeholder="Linkedin profile url"
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
              name="linkedin"
              id="linkedin"
              onChange={onMutate}
              value={linkedin}
            />
          </div>

          <div className="mb-6">
            <div className="pb-2">
              <label
                htmlFor="GoogleScholarLink"
                className=" left-0  text-gray-600  "
              >
                Google Scholar Link
              </label>
            </div>

            <input
              type="text"
              placeholder="Google Scholar Link"
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
              name="GoogleScholarLink"
              id="GoogleScholarLink"
              onChange={onMutate}
              value={GoogleScholarLink}
            />
          </div>

          {/* {cv and image div } */}
          <div className="grid">
            <div className="my-6">
              <div className="pb-2">
                <label className=" left-0  text-gray-600  ">Select Image</label>
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
                  <span className="sr-only">Choose an Image </span>
                  <input
                    type="file"
                    accept="image/* "
                    onChange={handleImage}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </label>
              </div>
              {/* {section for cv}  */}
              <div className="space-between">
                <p className="text-base"> Max size: 200kb</p>
                <p className="text-base">Min size: 50kb</p>
              </div>
              {isSuccess ? (
                <p className="text-base text-green-600">
                  Size is compatible ✅{" "}
                </p>
              ) : null}
              <p className="text-base text-red-600 ">
                {errorMsg && `${errorMsg} ⛔️`}
              </p>
            </div>

            {/* {div for cv} */}

            <div className="my-6">
              <div className="pb-2">
                <label className=" left-0  text-gray-600  ">Select CV</label>
              </div>
              <div className="my-6 flex items-center space-x-6">
                {/* {preview ? (<div className="shrink-0">
                                <img className="object-cover w-64 rounded"
                                    src={preview} alt="Not Available Preview" />
                            </div>) : null} */}
                <label className="block">
                  <span className="sr-only">Choose Cv</span>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleCv}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </label>
              </div>
              <div className="space-between">
                <p className="text-base"> Max size: 1 MB</p>
                <p className="text-base">Min size: 50 kb</p>
              </div>
              {isSuccessCv ? (
                <p className="text-base text-green-600">
                  Size is compatible ✅{" "}
                </p>
              ) : null}
              <p className="text-base text-red-600 ">
                {errorMsgCv && `${errorMsgCv} ⛔️`}
              </p>
            </div>
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
              Create faculty
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

export default CreateFacultyForm
