import React, { useState, useEffect } from "react"

import { v4 } from "uuid"
import { db } from "../../firebase.config"
import { doc, getDoc, updateDoc } from "firebase/firestore"

import Spinner from "../../components/Spinner/Spinner"

import { toast } from "react-toastify"
import {
  ref,
  getDownloadURL,
  getStorage,
  uploadBytesResumable,
} from "firebase/storage"
import { useNavigate } from "react-router-dom"

function UpdateBgImgCusatech2() {
  const [loading, setLoading] = useState(false)

  const docRef = doc(db, "homepage", "cusatech")

  const [data, setData] = useState({
    bg1: "",
    bg2: "",
    text1: "",
    text2: "",
  })

  const { bg1, bg2, text1, text2 } = data

  const getData = async () => {
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      setData({ ...data, ...docSnap.data() })
    } else {
      // doc.data() will be undefined in this case
      // console.log("No such document!")
    }
    setLoading(false)
  }

  useEffect(() => {
    getData()
  }, [])

  // file size checker
  const [selectedFile, setSelectedFile] = useState()
  const [errorMsg, setErrorMsg] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const [imgFlie, setImgFlie] = useState(null)
  const [preview, setPreview] = useState()

  const handleImage = (e) => {
    // Files

    if (e.target.files) {
      setImgFlie(e.target.files[0])
      setSelectedFile(e.target.files[0])
    }
  }

  const canSave = Boolean(isSuccess)

  // let text = `
  //    ${Boolean(isSuccess)}`

  //   validate Selected File Size
  const validateSelectedFile = () => {
    const MIN_FILE_SIZE = 200 //  50kb
    const MAX_FILE_SIZE = 2048 // 2MB

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

  const navigate = useNavigate()

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
        const fileName = `${image.name}-${v4()}`

        const storageRef = ref(storage, "HomePage/" + fileName)

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

    const formDataCopy = {
      bg2: imgUrl,
    }

    updateDoc(docRef, formDataCopy)
      .then(() => {
        setLoading(false)
        toast.success(" Image added Successfully")
      })
      .catch((err) => {
        setLoading(false)

        toast.error(err.message)
      })

    // navigate("/gallery")
    setPreview(null)
    setImgFlie(null)
    setSelectedFile(null)
    setIsSuccess(false)
    navigate("/cusatech/admin/homepageEdit/cusatech")
  }

  return (
    <div className="">
      {loading ? (
        <>
          <Spinner />
        </>
      ) : (
        <form className="w-full">
          <div className="my-6">
            <div>
              <figure className="max-w-sm">
                <img
                  className="h-auto max-w-full rounded-lg"
                  src={data.bg2}
                  alt="bg2"
                />
                <figcaption className="mt-2 text-sm text-center text-gray-500 dark:text-gray-400">
                  Background Image 1
                </figcaption>
              </figure>
            </div>
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
              <p className="text-base"> Max size: 2MB</p>
              <p className="text-base">Min size: 200kb</p>
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
              Add Image
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

export default UpdateBgImgCusatech2
