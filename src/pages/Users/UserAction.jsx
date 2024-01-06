import React, { useState, useEffect } from "react"

import { Link, useNavigate, useParams } from "react-router-dom"
import banner from "../../assets/images/banner-bg.jpg"
import Title from "../../components/Title/Title"
import Page404 from "../Page404"
import Footer from "../../components/Footer/Footer"
import Spinner from "../../components/Spinner/Spinner"
import { db } from "../../firebase.config"

import { doc, getDoc } from "firebase/firestore"

//
import { FaLinkedin } from "react-icons/fa"

import { confirmAlert } from "react-confirm-alert"
import "react-confirm-alert/src/react-confirm-alert.css"

// import { useUserAuth } from "../../context/UserAuthContext"
import { toast } from "react-toastify"

import { getFunctions, httpsCallable } from "firebase/functions"
import RootLayout from "../../components/SideBar/RootLayout"

function UserAction() {
  const functions = getFunctions()

  //const { user, } = useUserAuth()
  const navigate = useNavigate()

  const { id } = useParams()

  const [loading, setLoading] = useState(true)

  const [data, setData] = useState([])

  const [details, setDetails] = useState([])

  const docRef = doc(db, "users", id)

  const getUserDetails = httpsCallable(functions, "getUserDetails")

  const enableDisableUserCallable = httpsCallable(
    functions,
    "enableDisableUser"
  )

  const TimeStampToDate = (dob) => {
    const dobJSDate = new Date(dob.seconds * 1000)
    const yyyy = dobJSDate.getFullYear()
    let mm = dobJSDate.getMonth() + 1 // Months start at 0!
    let dd = dobJSDate.getDate()
    if (dd < 10) dd = "0" + dd
    if (mm < 10) mm = "0" + mm
    return dd + "/" + mm + "/" + yyyy
  }

  const fetchData = async () => {
    try {
      const docSnap = await getDoc(docRef)
      //console.log(docSnap.data());
      setDetails(docSnap.data())
    } catch (error) {
      // console.log(error)
    }
    setLoading(false)
  }

  const handleGetUser = async (id) => {
    fetchData()

    try {
      const userDetails = await getUserDetails({ uid: id })
      setData(userDetails.data)
    } catch (error) {
      console.error("Error fetching user details:", error.name)
    }
  }

  const [Path, setPath] = useState("")

  useEffect(() => {
    handleGetUser(id)
    let location = window.location.href.split("/")[3]
    // console.log(location)
    if (location.toLocaleLowerCase() === "cusatech") {
      setPath(`cusatech/admin`)
    } else {
      setPath("admin")
    }
  }, [])

  const toggleUserStatus = async (docId, newStatus) => {
    try {
      const result = await enableDisableUserCallable({
        uid: docId,
        disabled: newStatus,
      })
      // console.log(result.data.message)
      toast.success(`User ${!newStatus ? "enabled" : "disabled"} successfully`)
    } catch (error) {
      console.error("Error toggling user:", error)
    }
    // console.log("Disable Status:", newStatus)
    navigate(-1)
  }

  const EnableConfirm = (e, docId) => {
    confirmAlert({
      title: "Enable this user?",
      message: "To confirm, click yes.",
      buttons: [
        {
          label: "Yes",
          onClick: () => toggleUserStatus(docId, false),
        },
        {
          label: "No",
          onClick: () => {
            toast.error("Enable cancelled")
          },
        },
      ],
    })
  }

  const DisableConfirm = (e, docId) => {
    confirmAlert({
      title: "Disable this user?",
      message: "To confirm, click yes.",
      buttons: [
        {
          label: "Yes",
          onClick: () => toggleUserStatus(docId, true),
        },
        {
          label: "No",
          onClick: () => {
            toast.error("Disable cancelled")
          },
        },
      ],
    })
  }

  return (
    <RootLayout>
      <div className="overflow-x-hidden ">
        {loading ? (
          <Spinner />
        ) : (
          <div className="bg-white">
            <div className="mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
              <Title>Users Details</Title>
              {/* <!-- Product --> */}
              {details && (
                <div className="">
                  <div
                    key={id}
                    className="mt-4  bg-gray-100 rounded-xl	 prose prose-sm text-gray-900"
                  >
                    <div className="w-full p-4  max-w-full px-3    mb-4">
                      <div className=" my-6 py-4 h-full min-w-0 break-words bg-white border-0 shadow-soft-xl rounded-2xl md:mx-6 bg-clip-border">
                        <div className="sm:flex-shrink-0 mt-4  sm:mx-0  w-32 mb-6 h-32 sm:h-32 sm:w-32  sm:mb-0">
                          <img
                            src={details?.photo}
                            alt={details.name}
                            className="object-cover object-center mt-10 mx-10 w-full h-full rounded-full "
                          />
                        </div>

                        <div className="p-4 pb-0 mb-0 bg-white border-b-0 rounded-t-2xl">
                          <div className="flex flex-wrap -mx-3">
                            <div className=" w-full max-w-full px-3 shrink-0  ">
                              {details?.cusatFlag ? (
                                <span className="p-1.5 ml-8 text-xs font-medium uppercase tracking-wider text-green-800 bg-green-200 rounded-lg bg-opacity-50">
                                  Cusat
                                </span>
                              ) : (
                                <span className="p-1.5 ml-8 text-xs font-medium uppercase tracking-wider text-blue-800 bg-blue-200 rounded-lg bg-opacity-50">
                                  NON Cusat
                                </span>
                              )}
                              <h6 className="my-2 font-mono font-bold">
                                Profile Information
                              </h6>
                            </div>
                          </div>
                        </div>

                        <div className="flex-auto p-4">
                          <ul className="flex flex-col pl-0 mb-0 rounded-lg">
                            <li className="relative block px-4 py-2 pt-0 pl-0 leading-normal bg-white border-0 rounded-t-lg text-size-sm text-inherit">
                              <strong className="text-slate-700">
                                Full Name:
                              </strong>{" "}
                              &nbsp; {details.name}
                            </li>
                            {details.mobile && (
                              <li className="relative block px-4 py-2 pl-0 leading-normal bg-white border-0 border-t-0 text-size-sm text-inherit">
                                <strong className="text-slate-700">
                                  Mobile:
                                </strong>{" "}
                                &nbsp; {details.mobile}
                              </li>
                            )}
                            <li className="relative block px-4 py-2 pl-0 leading-normal bg-white border-0 border-t-0 text-size-sm text-inherit">
                              <strong className="text-slate-700">Email:</strong>{" "}
                              &nbsp; {details.email}
                            </li>

                            {details.gender && (
                              <li className="relative block px-4 py-2 pl-0 leading-normal bg-white border-0 border-t-0 text-size-sm text-inherit">
                                <strong className="text-slate-700">
                                  Gender:
                                </strong>{" "}
                                &nbsp; {details.gender}
                              </li>
                            )}
                            {details.dob && (
                              <li className="relative block px-4 py-2 pl-0 leading-normal bg-white border-0 border-t-0 text-size-sm text-inherit">
                                <strong className="text-slate-700">
                                  Date of birth:
                                </strong>{" "}
                                &nbsp; {TimeStampToDate(details.dob)}
                              </li>
                            )}

                            {details.address && (
                              <li className="relative block px-4 py-2 pl-0 leading-normal bg-white border-0 border-t-0 text-size-sm text-inherit">
                                <strong className="text-slate-700">
                                  Location:
                                </strong>{" "}
                                &nbsp;{" "}
                                {`${details.address && details.address} - ${
                                  details.state
                                } , ${details.pincode} - ${details.country}`}
                              </li>
                            )}

                            {details.pincode && (
                              <li className="relative block px-4 py-2 pl-0 leading-normal bg-white border-0 border-t-0 text-size-sm text-inherit">
                                <strong className="text-slate-700">
                                  Pincode:
                                </strong>{" "}
                                &nbsp; {`${details.pincode}`}
                              </li>
                            )}

                            {!(
                              details.cusatFlag || details.nonCusatStudent
                            ) && (
                              <>
                                {details.aadharNo && (
                                  <li className="relative block px-4 py-2 pl-0 leading-normal bg-white border-0 border-t-0 text-size-sm text-inherit">
                                    <strong className="text-slate-700">
                                      Aadhar Number:
                                    </strong>{" "}
                                    &nbsp; {details.aadharNo}
                                  </li>
                                )}

                                {details.highestQualification && (
                                  <li className="relative block px-4 py-2 pl-0 leading-normal bg-white border-0 border-t-0 text-size-sm text-inherit">
                                    <strong className="text-slate-700">
                                      Highest Qualification:
                                    </strong>{" "}
                                    &nbsp; {details.highestQualification}
                                  </li>
                                )}
                              </>
                            )}
                            {details.linkedIn && (
                              <li className="relative block px-4 py-2 pb-0 pl-0 bg-white border-0 border-t-0 rounded-b-lg text-inherit">
                                <strong className="leading-normal text-size-sm text-slate-700">
                                  Social:
                                </strong>
                                &nbsp;
                                <a
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-block py-0 pl-1 pr-2 mb-0 font-bold text-center text-blue-800 align-middle transition-all bg-transparent border-0 rounded-lg shadow-none cursor-pointer leading-pro text-size-xs ease-soft-in bg-none"
                                  href={details.linkedIn}
                                >
                                  <FaLinkedin className=" ml-2 text-2xl" />
                                </a>
                              </li>
                            )}
                            <li className="relative block px-4 py-2 pb-0 pl-0 bg-white border-0 border-t-0 rounded-b-lg text-inherit">
                              <>
                                <strong className="text-slate-700">
                                  Block / UnBlock :{" "}
                                  <span className="opacity-70">
                                    <span
                                      className={` px-4 py-2 font-bold text-lg ${
                                        data.disabled
                                          ? "text-red-600"
                                          : "text-green-600"
                                      }   text-sm font-medium `}
                                    >
                                      {" "}
                                      {!data.disabled
                                        ? "Now Enable"
                                        : "Now Blocked "}
                                    </span>
                                  </span>{" "}
                                </strong>{" "}
                                &nbsp;{" "}
                                <button
                                  id={details.DocId}
                                  onClick={(e) =>
                                    !data.disabled
                                      ? DisableConfirm(e, details.DocId)
                                      : EnableConfirm(e, details.DocId)
                                  }
                                  className={` px-4 py-2 ${
                                    !data.disabled
                                      ? "bg-red-600"
                                      : "bg-green-600"
                                  }  text-white font-serif text-sm font-medium rounded-md`}
                                >
                                  {!data.disabled ? "Block" : "UnBlock"}
                                </button>
                              </>
                            </li>
                          </ul>
                        </div>

                        <hr className="h-px my-6 bg-transparent bg-gradient-horizontal-light" />

                        {/* University  Information */}
                        {(details.cusatFlag || details.nonCusatStudent) && (
                          <div>
                            {details.universityRegNo && (
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
                                {details.nonCusatStudent && (
                                  <li className="relative block px-4 py-2 pt-0 pl-0 leading-normal bg-white border-0 rounded-t-lg text-size-sm text-inherit">
                                    <strong className="text-slate-700">
                                      University Name:
                                    </strong>{" "}
                                    &nbsp; {details.universityName}
                                  </li>
                                )}
                                {details.universityRegNo && (
                                  <li className="relative block px-4 py-2 pl-0 leading-normal bg-white border-0 border-t-0 text-size-sm text-inherit">
                                    <strong className="text-slate-700">
                                      University Register No:
                                    </strong>{" "}
                                    &nbsp; {details.universityRegNo}
                                  </li>
                                )}

                                {details.department && (
                                  <li className="relative block px-4 py-2 pl-0 leading-normal bg-white border-0 border-t-0 text-size-sm text-inherit">
                                    <strong className="text-slate-700">
                                      Department:
                                    </strong>{" "}
                                    &nbsp; {details.department}
                                  </li>
                                )}

                                {details.course && (
                                  <li className="relative block px-4 py-2 pl-0 leading-normal bg-white border-0 border-t-0 text-size-sm text-inherit">
                                    <strong className="text-slate-700">
                                      Course:
                                    </strong>{" "}
                                    &nbsp; {details.course}
                                  </li>
                                )}

                                {details.semester && (
                                  <li className="relative block px-4 py-2 pl-0 leading-normal bg-white border-0 border-t-0 text-size-sm text-inherit">
                                    <strong className="text-slate-700">
                                      Semester:
                                    </strong>{" "}
                                    &nbsp; {details.semester}
                                  </li>
                                )}

                                {details.digiLockerId && (
                                  <li className="relative block px-4 py-2 pl-0 leading-normal bg-white border-0 border-t-0 text-size-sm text-inherit">
                                    <strong className="text-slate-700">
                                      DigiLocker ID:
                                    </strong>{" "}
                                    &nbsp; {details.digiLockerId}
                                  </li>
                                )}

                                {details.abcId && (
                                  <li className="relative block px-4 py-2 pl-0 leading-normal bg-white border-0 border-t-0 text-size-sm text-inherit">
                                    <strong className="text-slate-700">
                                      ABC ID : <br />{" "}
                                      <span className="opacity-70">
                                        (Academic Bank of Credits)
                                      </span>{" "}
                                    </strong>{" "}
                                    &nbsp; {details.abcId}
                                  </li>
                                )}
                                {details.nonCusatStudent && (
                                  <li className="relative block px-4 py-2 pt-0 pl-0 leading-normal bg-white border-0 rounded-t-lg text-size-sm text-inherit">
                                    <strong className="text-slate-700">
                                      Id card :
                                    </strong>{" "}
                                    {Boolean(details.idCardImg) ? (
                                      <img src={details.idCardImg} alt="" />
                                    ) : (
                                      "Not available "
                                    )}
                                  </li>
                                )}
                                <li className="relative block px-4 py-2 pl-0 leading-normal bg-white border-0 border-t-0 text-size-sm text-inherit"></li>
                              </ul>
                            </div>
                          </div>
                        )}

                        {/* End of University  Information */}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {/* <!-- End Product --> */}
              {!details && <Page404 />}
            </div>
          </div>
        )}

        <Footer />
      </div>
    </RootLayout>
  )
}

export default UserAction
