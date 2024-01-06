import React, { useState, useEffect } from "react"

import { v4 } from "uuid"
import { db } from "../../../firebase.config"
import {
  collection,
  serverTimestamp,
  addDoc,
  Timestamp,
} from "firebase/firestore"

import Spinner from "../../../components/Spinner/Spinner"
import { useLocation, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import {
  ref,
  getDownloadURL,
  getStorage,
  uploadBytesResumable,
} from "firebase/storage"

import CompressionOptions from "../../../const/CompressionOptions"

// Date Picker
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import Required from "../../../components/Required Icon/Required"
import imageCompression from "browser-image-compression"

function CreateEventForm() {
  const navigate = useNavigate()

  const { pathname } = useLocation()

  const [loading, setLoading] = useState(false)

  // State

  const [date, setDate] = useState(new Date())

  const [imagedata, setimageData] = useState(null)
  const [selectedImage, setselectedImage] = useState(null)

  const [formData, setFormData] = useState({
    title: "", // data type changed
    description: "",
    location: "",
    phone: "",
    email: "",
  })

  const { title, description, location, phone, email } = formData

  // file size checker
  const [selectedFile, setSelectedFile] = useState()
  const [errorMsg, setErrorMsg] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const [imgFlie, setImgFlie] = useState(null)
  const [preview, setPreview] = useState()

  const handleImage = (e) => {
    handleImageUpload(e)
    // Files
    if (e.target.files) {
      setImgFlie(e.target.files[0])
      setSelectedFile(e.target.files[0])
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
  }

  const canSave =
    Boolean(isSuccess) &&
    Boolean(imagedata) &&
    Boolean(title) &&
    Boolean(description) &&
    Boolean(location)

  // let text = `
  //    ${Boolean(isSuccess)}`

  //   validate Selected File Size
  const validateSelectedFile = () => {
    const MIN_FILE_SIZE = 250 //  250kb
    const MAX_FILE_SIZE = 755 // 750kb

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
      // console.log(`compressedFile size ${compressedFile.size} MB`);
    } catch (error) {
      // console.log(error)
    }
  }

  const onSubmit = async (e) => {
    window.scroll(0, 0)

    e.preventDefault()

    setLoading(true)
    // document.body.scrollIntoView()

    if (imgFlie.length > 1 || !isSuccess) {
      setLoading(false)
      toast.error("Max 1 image")
      return
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
    imgUrl = await storeImage(imgFlie, fileName, "/events/images/")

    let thumbnailUrl // to store thumbnail image
    let thumbnailImageName = `${v4()}-${imagedata.name}`
    thumbnailUrl = await storeImage(
      imagedata,
      thumbnailImageName,
      "/events/images/thumbnail/"
    )

    const formDataCopy = {
      ...formData,

      date: Timestamp.fromDate(date),
      image: imgUrl,
      thumbnailImage: thumbnailUrl,
      imageLocation: `${"/events/images/"}${fileName}`,
      thumbnailImageLocation: `${"events/images/thumbnail/"}${thumbnailImageName}`,
      createdAt: serverTimestamp(),
    }

    addDoc(collection(db, "events"), formDataCopy)
      .then(() => {
        setLoading(false)
        toast.success("Event created  successfully")
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
  }

  return (
    <div className="">
      {loading ? (
        <>
          <Spinner />
        </>
      ) : (
        <form className="w-full">
          <div className="mb-6">
            <div className="pb-2">
              <label htmlFor="title" className=" left-0  text-gray-600  ">
                Event title
                <Required />
              </label>
            </div>

            <input
              type="text"
              placeholder="Event title"
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
              name="title"
              id="title"
              onChange={onMutate}
              value={title}
            />
          </div>

          <div className="mb-6">
            <div className="pb-2">
              <label htmlFor="location" className=" left-0  text-gray-600  ">
                Event location
                <Required />
              </label>
            </div>

            <input
              type="text"
              placeholder="Event location"
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
              name="location"
              id="location"
              onChange={onMutate}
              value={location}
            />
          </div>

          <div className="my-6">
            <label
              htmlFor="Display"
              className="flex items-center cursor-pointer relative mb-4"
            >
              Date and Time
              <Required />
            </label>

            <DatePicker
              className="w-full 
                              rounded
                              py-3
                              text-gray-800
                              border-gray-500
                              required
                              outline-none
                              focus-visible:shadow-none
                              focus:border-primary"
              selected={date}
              onChange={(date) => setDate(date)}
              dateFormat="MM-dd-yyyy hh:mm aa"
              minDate={new Date()}
              isClearable
              showTimeInput
              showYearDropdown
              scrollableMonthYearDropdown
              showMonthDropdown
            />
          </div>

          <div className="my-6">
            <div className="pb-2">
              <label htmlFor="description" className=" left-0  text-gray-600  ">
                Description
                <Required />
              </label>{" "}
            </div>
            <textarea
              required
              rows="6"
              placeholder="Description"
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
              name="description"
              id="description"
              value={description}
              onChange={onMutate}
            ></textarea>
          </div>

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
            <div className="space-between">
              <p className="text-base"> Max size: 750kb</p>
              <p className="text-base">Min size: 250kb</p>
            </div>
            {isSuccess ? (
              <p className="text-base text-green-600">Size is compatible ✅ </p>
            ) : null}
            <p className="text-base text-red-600 ">
              {errorMsg && `${errorMsg} ⛔️`}
            </p>
          </div>

          <div className="flex justify-center">
            <hr className=" w-11/12 my-10  h-px bg-green-400  border-0 " />
          </div>

          <div className="mb-6">
            <div className="pb-2">
              <label htmlFor="email" className=" left-0  text-gray-600  ">
                Email
              </label>
            </div>

            <input
              type="email"
              placeholder="Email"
              className="
                              w-full
                              rounded
                              p-3
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
              </label>
            </div>

            <input
              type="tel"
              placeholder="Phone number "
              className="
                              w-full
                              rounded
                              p-3
                              text-gray-800
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
              Create event
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

export default CreateEventForm
