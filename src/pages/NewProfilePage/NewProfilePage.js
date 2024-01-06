import React, { useState, useEffect } from "react"
import { Link } from "react-router-dom"

//firebase firestore
import { db, storage } from "../../firebase.config"
import { doc, getDoc } from "firebase/firestore"

//components
import Spinner from "../../components/Spinner/Spinner"
import Footer from "../../components/Footer/Footer"

//icons
import { FaLinkedin, FaUserEdit } from "react-icons/fa"
import { BiRightArrowCircle } from "react-icons/bi"

// toastify
import { toast } from "react-toastify"

//context
import { useUserAuth } from "../../context/UserAuthContext"
import { getDownloadURL, getMetadata, ref } from "firebase/storage"

function NewProfilePage() {
  // State
  const [loading, setLoading] = useState(true)

  const [enrolledCourses, setEnrolledCourses] = useState([])

  const [ImageUrl, setImageurl] = useState("")

  const [profile, setProfile] = useState({
    dob: {
      seconds: 0,
      nanoseconds: 0,
    },
    name: "",
    email: "",
    mobile: "",
    gender: "",
    address: "",
    country: "",
    state: "",
    pincode: 0,
    photo: "",
    linkedIn: "", //  Not Mandatory
    nonCusatStudent: false,
    cusatFlag: false,

    universityRegNo: "",
    department: "",
    course: "",
    semester: "",
    digiLockerId: "",
    abcId: "",
    universityName: "",
    InstitutionType: "", //

    aadharNo: "",
    highestQualification: "",
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

  const TimeStampToDate = (params) => {
    const dobJSDate = new Date(dob.seconds * 1000)
    const yyyy = dobJSDate.getFullYear()
    let mm = dobJSDate.getMonth() + 1 // Months start at 0!
    let dd = dobJSDate.getDate()
    if (dd < 10) dd = "0" + dd
    if (mm < 10) mm = "0" + mm
    return dd + "/" + mm + "/" + yyyy
  }

  const fetchdata = async (collectionName, docId, stateName) => {
    const docRef = doc(db, collectionName, docId)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      stateName({ ...docSnap.data(), DocId: docSnap.id })
      // console.log("Document data:", docSnap.data())
    } else {
      // doc.data() will be undefined in this case
      toast.error("Something went wrong !")
    }
  }
  // for formatting the fetchData
  function formatCourse(doc) {
    return doc.id
  }

  useEffect(() => {
    const getId = async () => {
      await fetchdata(`users`, user.uid, setProfile)
      imageCall()
    }
    getId()
    setLoading(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const imageCall = async () => {
    const imageRef = ref(storage, `profile-image/${user.uid}`)
    getMetadata(imageRef)
      .then((metadata) => {
        getDownloadURL(imageRef)
          .then((url) => {
            if (url) {
              setImageurl(url)
              // console.log(url)
            } else {
              setImageurl(user.photoURL)
            }
          })
          .catch((error) => {
            // console.log(error.code)
          })
      })
      .catch((error) => {
        setImageurl(user.photoURL)
      })
  }

  return loading ? (
    <Spinner />
  ) : name.length > 0 ? (
    <div className="bg-gray-100 mt-16  pt-12">
      <div className="bg-white shadow rounded-lg md:mx-8  mx-2 mb-5   p-10">
        <div className="flex flex-col gap-1 text-center items-center">
          {user && user.photoURL.length > 0 ? (
            <img
              className="h-32 w-32 bg-gray-100 p-2 rounded-full shadow mb-4"
              src={ImageUrl}
              alt={name}
            />
          ) : (
            <div className="h-32 w-32 bg-gray-100 p-2 flex items-center justify-center rounded-full shadow mb-4">
              {name}
            </div>
          )}
          <p className="font-semibold">{name}</p>
          {cusatFlag && (
            <span className="p-1.5 mt-3 text-xs font-medium uppercase tracking-wider text-green-800 bg-green-200 rounded-lg bg-opacity-50">
              Cusat Student
            </span>
          )}

          {!user.admin && (
            <div className="flex ">
              <Link
                to="/Result"
                className="p-1.5 mt-3 mr-4 text-sm font-medium uppercase tracking-wider text-sky-800 bg-sky-200 hover:bg-sky-800 hover:text-white rounded-lg bg-opacity-50 flex items-center "
              >
                Result
                <span className="ml-1 text-base">
                  <BiRightArrowCircle />
                </span>
              </Link>
            </div>
          )}
        </div>
        <div className="flex justify-center items-center gap-2 my-3"></div>
      </div>
      <>
        {/* Profile Information */}
        <div className="w-full   max-w-full px-3    mb-4">
          <div className="relative flex flex-col h-full min-w-0 break-words bg-white border-0 shadow-soft-xl rounded-2xl md:mx-6 bg-clip-border">
            <div className="p-4 pb-0 mb-0 bg-white border-b-0 rounded-t-2xl">
              <div className="flex flex-wrap -mx-3">
                <div className=" w-full max-w-full px-3 shrink-0  ">
                  <Link className="hover:text-green-500" to="/profile/edit">
                    <p className="flex text-base hover:text-green-500 text-black items-center justify-end">
                      Edit profile
                      <FaUserEdit className="mr-1 md:mr-10  mx-1 " />
                    </p>
                  </Link>
                  <h6 className="my-2 font-mono font-bold">
                    Profile Information
                  </h6>
                </div>
              </div>
            </div>
            <div className="flex-auto p-4">
              <ul className="flex flex-col pl-0 mb-0 rounded-lg">
                <li className="relative block px-4 py-2 pt-0 pl-0 leading-normal bg-white border-0 rounded-t-lg text-size-sm text-inherit">
                  <strong className="text-slate-700">Full Name:</strong> &nbsp;{" "}
                  {name}
                </li>
                {mobile && (
                  <li className="relative block px-4 py-2 pl-0 leading-normal bg-white border-0 border-t-0 text-size-sm text-inherit">
                    <strong className="text-slate-700">Mobile:</strong> &nbsp;{" "}
                    {mobile}
                  </li>
                )}
                <li className="relative block px-4 py-2 pl-0 leading-normal bg-white border-0 border-t-0 text-size-sm text-inherit">
                  <strong className="text-slate-700">Email:</strong> &nbsp;{" "}
                  {email}
                </li>

                {gender && (
                  <li className="relative block px-4 py-2 pl-0 leading-normal bg-white border-0 border-t-0 text-size-sm text-inherit">
                    <strong className="text-slate-700">Gender:</strong> &nbsp;{" "}
                    {gender}
                  </li>
                )}
                {dob && (
                  <li className="relative block px-4 py-2 pl-0 leading-normal bg-white border-0 border-t-0 text-size-sm text-inherit">
                    <strong className="text-slate-700">Date of birth:</strong>{" "}
                    &nbsp; {TimeStampToDate(dob)}
                  </li>
                )}

                {address && (
                  <li className="relative block px-4 py-2 pl-0 leading-normal bg-white border-0 border-t-0 text-size-sm text-inherit">
                    <strong className="text-slate-700">Location:</strong> &nbsp;{" "}
                    {`${
                      address && address
                    } - ${state} , ${pincode} - ${country}`}
                  </li>
                )}

                {pincode && (
                  <li className="relative block px-4 py-2 pl-0 leading-normal bg-white border-0 border-t-0 text-size-sm text-inherit">
                    <strong className="text-slate-700">Pincode:</strong> &nbsp;{" "}
                    {`${pincode}`}
                  </li>
                )}

                {!(cusatFlag || nonCusatStudent) && (
                  <>
                    {aadharNo && (
                      <li className="relative block px-4 py-2 pl-0 leading-normal bg-white border-0 border-t-0 text-size-sm text-inherit">
                        <strong className="text-slate-700">
                          Aadhar Number:
                        </strong>{" "}
                        &nbsp; {aadharNo}
                      </li>
                    )}

                    {highestQualification && (
                      <li className="relative block px-4 py-2 pl-0 leading-normal bg-white border-0 border-t-0 text-size-sm text-inherit">
                        <strong className="text-slate-700">
                          Highest Qualification:
                        </strong>{" "}
                        &nbsp; {highestQualification}
                      </li>
                    )}
                  </>
                )}
                {linkedIn && (
                  <li className="relative block px-4 py-2 pb-0 pl-0 bg-white border-0 border-t-0 rounded-b-lg text-inherit">
                    <strong className="leading-normal text-size-sm text-slate-700">
                      Social:
                    </strong>
                    &nbsp;
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block py-0 pl-1 pr-2 mb-0 font-bold text-center text-blue-800 align-middle transition-all bg-transparent border-0 rounded-lg shadow-none cursor-pointer leading-pro text-size-xs ease-soft-in bg-none"
                      href={linkedIn}
                    >
                      <FaLinkedin className=" ml-2 text-2xl" />
                    </a>
                    {/* <a class="inline-block py-0 pl-1 pr-2 mb-0 font-bold text-center align-middle transition-all bg-transparent border-0 rounded-lg shadow-none cursor-pointer leading-pro text-size-xs ease-soft-in bg-none text-sky-600"
                    href="sai-na.com">
                    <i class="fab fa-twitter fa-lg" aria-hidden="true"></i>
                  </a>
                  <a class="inline-block py-0 pl-1 pr-2 mb-0 font-bold text-center align-middle transition-all bg-transparent border-0 rounded-lg shadow-none cursor-pointer leading-pro text-size-xs ease-soft-in bg-none text-sky-900"
                    href="sai-na.com">
                    <i class="fab fa-instagram fa-lg" aria-hidden="true"></i>
                  </a> */}
                  </li>
                )}
              </ul>
            </div>

            <hr className="h-px my-6 bg-transparent bg-gradient-horizontal-light" />

            {/* University  Information */}
            {(cusatFlag || nonCusatStudent) && (
              <div>
                {universityRegNo && (
                  <div className="p-4 pb-0 mb-0 bg-white border-b-0 rounded-t-2xl">
                    <div className="flex flex-wrap -mx-3">
                      <div className="flex items-center w-full max-w-full px-3 shrink-0 md:w-8/12 md:flex-none">
                        <h6 className="my-2 font-mono font-bold">
                          University Information
                        </h6>
                      </div>
                    </div>
                  </div>
                )}
                <div className="flex-auto p-4">
                  <ul className="flex flex-col pl-0 mb-0 rounded-lg">
                    {nonCusatStudent && (
                      <li className="relative block px-4 py-2 pt-0 pl-0 leading-normal bg-white border-0 rounded-t-lg text-size-sm text-inherit">
                        <strong className="text-slate-700">
                          {InstitutionType === "Recognized  Institution"
                            ? "College name :"
                            : "University name :"}
                        </strong>{" "}
                        &nbsp; {universityName}
                      </li>
                    )}
                    {universityRegNo && (
                      <li className="relative block px-4 py-2 pl-0 leading-normal bg-white border-0 border-t-0 text-size-sm text-inherit">
                        <strong className="text-slate-700">
                          University Register No:
                        </strong>{" "}
                        &nbsp; {universityRegNo}
                      </li>
                    )}

                    {department && (
                      <li className="relative block px-4 py-2 pl-0 leading-normal bg-white border-0 border-t-0 text-size-sm text-inherit">
                        <strong className="text-slate-700">Department:</strong>{" "}
                        &nbsp; {department}
                      </li>
                    )}

                    {course && (
                      <li className="relative block px-4 py-2 pl-0 leading-normal bg-white border-0 border-t-0 text-size-sm text-inherit">
                        <strong className="text-slate-700">Course:</strong>{" "}
                        &nbsp; {course}
                      </li>
                    )}

                    {semester && (
                      <li className="relative block px-4 py-2 pl-0 leading-normal bg-white border-0 border-t-0 text-size-sm text-inherit">
                        <strong className="text-slate-700">Semester:</strong>{" "}
                        &nbsp; {semester}
                      </li>
                    )}

                    {digiLockerId && (
                      <li className="relative block px-4 py-2 pl-0 leading-normal bg-white border-0 border-t-0 text-size-sm text-inherit">
                        <strong className="text-slate-700">
                          DigiLocker ID:
                        </strong>{" "}
                        &nbsp; {digiLockerId}
                      </li>
                    )}

                    {abcId && (
                      <li className="relative block px-4 py-2 pl-0 leading-normal bg-white border-0 border-t-0 text-size-sm text-inherit">
                        <strong className="text-slate-700">
                          ABC ID : <br />{" "}
                          <span className="opacity-70">
                            (Academic Bank of Credits)
                          </span>{" "}
                        </strong>{" "}
                        &nbsp; {abcId}
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            )}
            {/* End of University  Information */}
          </div>
        </div>
      </>
      <Footer />
    </div>
  ) : (
    "Data not available"
  )
}

export default NewProfilePage
