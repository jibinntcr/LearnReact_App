import React, { useState, useEffect, useId, } from "react"
import { useNavigate } from "react-router-dom"
import { Link, useParams } from "react-router-dom"
import banner from "../../../assets/images/banner-bg.jpg"
import Footer from "../../../components/Footer/Footer"
import Page404 from "../../Page404"
import qrImg from "./../../../assets/images/upqricode.png"
import "../CurriculumCourse/Enroll.css"
import { db } from "../../../firebase.config"

import {
  getDoc,
  doc,
} from "firebase/firestore"


import {
  ref,
  getDownloadURL,
  getStorage,
  uploadBytesResumable,
} from "firebase/storage"





import { getFunctions, httpsCallable } from "firebase/functions"

//components
import Spinner from "../../../components/Spinner/Spinner"

// toastify
import { toast } from "react-toastify"

import { useUserAuth } from "../../../context/UserAuthContext"

function CheckoutFullPriceCourse() {
  const functions = getFunctions()
  const navigate = useNavigate()

  const { id, batch } = useParams()

  const [loading, setLoading] = useState(true)
  const [gst,setGst] = useState(0)

  const { user, enrolledCourses, userDetailsIsFull, userDetails } = useUserAuth()

  const [data, setData] = useState({})


  
  const {
    CourseName,
    CourseDepartment,
    CourseImage,
    thumbnailImage,
    CourseStatus,
    templateId,
    CourseFees,
  } = data

  const [preview, setPreview] = useState()
  const [imgFlie, setImgFlie] = useState(null)


  const handleImage = (e) => {
    
    if (e.target.files) {
      setImgFlie(e.target.files[0])
   
    }
  }

  useEffect(() => {
    if (imgFlie) {

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

  const enroll = (e) => {
    e.preventDefault()
    setLoading(true)

    if (canEnroll(CourseStatus) === false) {
      toast.error("Enrollment closed")
      setLoading(false)
      return
    }

    if (user) {
      if (enrolledCourses.includes(id)) {
        toast.error("Already enrolled")
        setLoading(false)
        return
      }
    }

    if (user === null) {
      toast.warning("Unauthenticated")
      navigate(`/sign-in/courses/${batch}/${id}`)
    } else if (user !== null && !userDetailsIsFull) {
      toast.warning("Please fill your details")
      navigate(`/Profile/edit`)
    } else {

      if (imgFlie.length > 1 ) {
        setLoading(false)
        toast.error("Max 1 image")
        return
      }
  

      onSubmit()
      
    }
  }



  
  const onSubmit = async () => {
    

    setLoading(true)
    // document.body.scrollIntoView()

    if (imgFlie.length > 1) {
      setLoading(false)
      toast.error("Max 1 image")
      return
    }

    // Store image in firebase
    const storeImage = async (image) => {
      return new Promise((resolve, reject) => {
        const storage = getStorage()
        const fileName = `${id}-${image.name}`

        

        const storageRef = ref(storage, `payment/${userDetails.uid}/` + fileName)

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
            toast.error(" Image Upload Failed")
            return
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

  
    const paymentFullCdec = httpsCallable(functions, "paymentFullCdec")
    paymentFullCdec({
      batch: batch,
      courseDocid: templateId,
      scheduleCourseDocid: id,
      paymentImage:imgUrl
    })
      .then((result) => {
        setLoading(false)
        //  console.log(result.data)
        toast.success("added successfully")
         navigate("/courses")
        //  console.log(result)
      })
      .catch((error) => {
        setLoading(false)
        // console.log(error.message)
        if (error.message === "Unauthenticated") {
          toast.error(error.message)
          // console.log(`/sign-in/courses/${batch}/${id}`)

          navigate(`/sign-in/courses/${batch}/${id}`)
          // console.log(`/sign-in/courses/${batch}/${id}`)
        } else {
          toast.error(error.message)
        }
      })

    
    setPreview(null)
    setImgFlie(null)

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
        await fetchData(`AcademicYear/${batch}/cdec`, id, setData)

        setLoading(false)
      } catch (error) {
        toast.error("Could not fetch data")
      }
    }
  getId()


  const fetchGst = async () => {
    try {
      // Assuming 'docRef' is the reference to the document you want to fetch
      const documentSnapshot = await getDoc(doc(db, "current", "doc"))

      if (documentSnapshot.exists()) {
        const data = documentSnapshot.data()

        if (data.GstValue) {
          setGst(data.GstValue)
          console.log(data.GstValue)
        }
      }
    } catch (error) {
      console.error("Error fetching document:", error.message)
    }
  }

  fetchGst()

  
  }, [])








 






















  const canEnroll = (CS) => {
    CS = parseInt(CS)
    return CS > 1 ? false : true
  }


  const canSave =  Boolean(imgFlie) 
  
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
            <div className='bg-white min-h-screen'>
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
            src={      thumbnailImage
              ? thumbnailImage
              : CourseImage}
            alt=""
          />
          <div className="flex w-full flex-col px-4 py-4">
            <span className="font-semibold">
              {CourseName}
            </span>
            <span className="float-right mt-1 text-gray-400">{CourseDepartment}</span>
            <p className="text-lg font-bold"> ₹{CourseFees}</p>
          </div>
        </div>
        
      </div>
      </Link>
    </div>
 
    <div className="my-10 bg-gray-100 rounded-xl px-4 pt-8 lg:mt-0">
      <p className="text-xl font-medium">Payment</p>
      <p className="text-gray-400">
        Complete your payment and  submit the screenshot
      </p>
      {/* Total */}
      <div className="mt-6 border-t border-b py-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-900">Subtotal</p>
            <p className="font-semibold text-gray-900"> ₹{CourseFees}</p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-900">GST ({gst}%)</p>
            <p className="font-semibold text-gray-900"> ₹{(CourseFees*gst)/100}</p>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm font-medium text-gray-900">Total</p>
          <p className="text-2xl font-semibold text-gray-900"> ₹{CourseFees+(CourseFees*gst)/100}</p>
        </div>
      <>
  <section className="bg-white mx-auto my-20 rounded-3xl p-4 w-80 border border-green-400">
    <div className="mb-6">
      <img
        src={qrImg}
        className="rounded-xl  "
        alt="qr code"
      />
    </div>
    
  </section>
  <form >
          <div className="my-6 flex flex-col justify-center items-center space-x-6">
              {preview ? (
                <div className="shrink-0 mb-6">
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
  
      <button type="submit" disabled={!canSave} onClick={enroll} className="enroll my-12 ">
       Enroll
      </button>
      </form>
      </>
    </div>
  </div></div>
            </div>


            </>


) : (
  <Page404 />
)}
<Footer/>
</>
    


  )
}

export default CheckoutFullPriceCourse