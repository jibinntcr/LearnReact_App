import React, { useState, useEffect } from "react"

import { v4 } from "uuid"
import { db } from "../../../firebase.config"
import { serverTimestamp, getDoc, doc, updateDoc } from "firebase/firestore"

import Select from "react-select"

import { useNavigate, useParams } from "react-router-dom"
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

function CreateEditForm({}) {
  const { id } = useParams()
  // console.log("CreateEditForm component rendering")

  const [loading, setLoading] = useState(false)
  const [departmentsList, setDepartmentsList] = useState({})

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

  const navigate = useNavigate()

  // State
  const [formData, setFormData] = useState({
    name: "", // data type changed
    photo: "",
    designation: "",
    department: "",
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
    photo,
    designation,
    affiliation,
    email,
    phone,
    iqacUrl,
    linkedin,
    department,
    cv,
    GoogleScholarLink,
  } = formData

  let docRef = doc(db, "faculty", id)

  useEffect(() => {
    const getId = async () => {
      await fetchdata("faculty", id, setFormData)
      await fetchDepartments()
      //listImage()
    }
    getId()
    setLoading(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchdata = async (collectionName, docId, stateName) => {
    const CollectionRef = doc(db, collectionName, docId)
    const docSnap = await getDoc(CollectionRef)
    // console.log(docSnap)
    if (docSnap.exists()) {
      stateName({ ...formData, ...docSnap.data(), DocId: docSnap.id })
      // console.log("Document data:", docSnap.data())
      //docSnap.data().dob && setDateOfBirth(new Date(docSnap.data().dob.seconds * 1000))
      //docSnap.data().state && setIndianStates({ value: docSnap.data().state, label: docSnap.data().state })
      docSnap.data().department &&
        setSelectedDepartment({
          value: docSnap.data().department,
          label: docSnap.data().department,
        })
      // console.log(docSnap.department)
    } else {
      // doc.data() will be undefined in this case
      toast.error("Something went wrong !")
    }
  }

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
    (formData.department !== ""
      ? Boolean(department)
      : Boolean(selectedDepartment.value !== "")) &&
    (photo !== "" ? Boolean(photo) : Boolean(isSuccess)) &&
    Boolean(name) &&
    Boolean(designation) &&
    Boolean(affiliation) &&
    Boolean(email) &&
    Boolean(phone.length === 10)

  //   validate Selected File Size
  const validateSelectedFile = () => {
    const MIN_FILE_SIZE = 50 //  50kb
    const MAX_FILE_SIZE = 250 // 200kb

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
        formData.photo = ""
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
          toast.success(" Cv Upload Failed")
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

    if (formData.photo !== "") {
      imgUrl = formData.photo
    } else {
      if (imgFlie.length > 1 || !isSuccess) {
        setLoading(false)
        toast.error("Max 1 image")
        return
      }
      // console.log(imgFlie)
      imgUrl = await storeImage(imgFlie)
    }

    let cvUrl

    if (formData.cv !== "") {
      cvUrl = formData.cv
    } else if (CvFlie !== null) {
      // console.log(cvUrl)
      cvUrl = await storeCv(CvFlie)
    } else {
      cvUrl = ""
    }

    let facultyDept

    if (formData.department !== "") {
      facultyDept = formData.department
    } else {
      facultyDept = selectedDepartment.value
    }

    const formDataCopy = {
      ...formData,
      photo: imgUrl,
      cv: cvUrl,
      department: facultyDept,
      createdAt: serverTimestamp(),
    }

    updateDoc(docRef, formDataCopy)
      .then(() => {
        setLoading(false)
        toast.success("Faculty added  successfully")
        navigate(-1)
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
  // const handleDownload = (downloadUrl,fileName) => {

  //   FileSaver.saveAs(downloadUrl, fileName);
  //   // try{
  //   //   fetch(downloadUrl)
  //   //   .then((response) => response.blob())
  //   //   .then((blob) => {
  //   //     const url = window.URL.createObjectURL(new Blob([blob]));
  //   //     const a = document.createElement('a');
  //   //     a.href = url;
  //   //     a.download = fileName;
  //   //     a.click();
  //   //     window.URL.revokeObjectURL(url);
  //   //   })
  //   //   .catch((error) => {
  //   //     console.error('Error downloading PDF:', error);
  //   //   });
  //   // }catch(e){
  //   //   toast.error("Could not Find Cv!")
  //   // }
  //   //window.open(downloadUrl,fileName)
  // };

  return (
    <div className="">
      {loading ? (
        <>
          <Spinner />
        </>
      ) : (
        <form className="w-full">
          {/* {image} */}
          <div className="mx-auto w-64 text-center">
            <div className="flex justify-center flex-col items-center w-64">
              {preview ? (
                <img
                  id="profile-img"
                  className="h-32 w-32 bg-gray-100 p-2 rounded-full shadow mb-4"
                  src={preview}
                  alt="profile"
                />
              ) : (
                <img
                  id="profile-img"
                  className="h-32 w-32 bg-gray-100 p-2 rounded-full shadow mb-4"
                  src={photo}
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
                    handleImage(e)
                  }}
                />
              </div>
              <div className="my-6">
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
            </div>
          </div>
          {/* {image} */}

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
              defaultValue={formData.department}
              onChange={(selectedOption) => {
                setSelectedDepartment(selectedOption)
                formData.department = ""
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

          {/* {cv  } */}
          <div className="grid">
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
                {formData.cv !== "" && (
                  <p className="text-base text-green-600">Cv Available ✅ </p>
                )}
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
                <p className="text-base"> Max size: 250 kb</p>
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
              Save Changes
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

export default CreateEditForm
