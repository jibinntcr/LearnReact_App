import React, { useState, useEffect } from "react"

import { Link, useParams } from "react-router-dom"
import banner from "../../assets/images/banner-bg.jpg"

import Footer from "../../components/Footer/Footer"

import { db } from "../../firebase.config"

import { getDoc, doc, Timestamp } from "firebase/firestore"

import { MdLocationOn, MdPhone, MdEmail } from "react-icons/md"
function EventsDetailsPage() {
  const [data, setData] = useState({})
  const [jsDate, setJsDate] = useState()

  const { date, description, location, phone, image, title, email } = data
  // let { Image } = data
  // Image = "https://tailwindui.com/img/ecommerce-images/product-page-05-product-01.jpg"

  const { id } = useParams()

  const fetchdata = async (collectionName, docId, stateName) => {
    const docRef = doc(db, collectionName, docId)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      stateName({ ...docSnap.data(), DocId: docSnap.id })
      // console.log("Document data:", docSnap.data())
      setJsDate(new Date(docSnap.data().date.seconds * 1000))
    } else {
      // doc.data() will be undefined in this case
      // console.log("No such document!")
    }
  }

  useEffect(() => {
    document.body.scrollIntoView()
    fetchdata("events", id, setData)
  }, [])

  return (
    <div
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
          <h1 style={{ fontSize: 50 }}> Event</h1>
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
              <Link className="hover:text-green-500" to="/events">
                Events
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-screen-lg mx-auto">
        {/* <!-- header --> */}

        {/* <!-- header ends here --> */}

        <main className="my-10">
          <div className="mb-4 md:mb-0 w-full md:mx-auto ">
            <div className="px-4 lg:px-0">
              <div className=" w-full mx-auto mt-12  md:mt-20 h-full rounded-lg bg-gray-100 overflow-hidden">
                <img
                  src={image}
                  alt="Title"
                  className="object-center mx-auto object-cover  h-2/3 "
                />
              </div>
              <h2 className="text-4xl my-5 font-semibold text-gray-800 leading-tight">
                {title}
              </h2>
            </div>

            {date && (
              <span
                className="
                         bg-green-500
                         rounded
                         inline-block
                         text-center
                         py-1
                         px-4
                    text-sm
                         md:text-xl
                         leading-loose
                         font-semibold
                         text-white
                         mx-5
                         mt-7
                         mb-0
                         "
              >
                {`  ${jsDate
                  .toJSON()
                  .slice(0, 10)
                  .split("-")
                  .reverse()
                  .join("/")} -
                                  ${jsDate.toLocaleString("en-US", {
                                    hour: "numeric",
                                    minute: "numeric",
                                    hour12: true,
                                  })}`}
              </span>
            )}
          </div>

          <div className="flex flex-col lg:flex-row     lg:space-x-12">
            <div className="  mx-auto  px-4 lg:px-0 mt-12 text-gray-700 text-lg leading-relaxed w-full lg:w-2/3">
              <div className="border-l-4  border-gray-800 text-gray-800 pl-4 mb-6   rounded">
                {location && (
                  <div className="flex  items-center font-semibold my-3">
                    <MdLocationOn className="mr-2 shrink-0 " /> {location}
                  </div>
                )}
                {description}
              </div>
            </div>

            {(email || phone) && (
              <div className="w-full lg:w-1/4 sm:m-auto mt-12 max-w-screen-sm  ">
                <div className="p-4 border-t border-b border rounded mx-3">
                  <div className="flex py-2">
                    <div>
                      <p className="font-semibold text-gray-700 text-sm">
                        Contact
                      </p>
                    </div>
                  </div>
                  {email && (
                    <a
                      className="hover:text-green-500"
                      href={`mailto:${email}`}
                    >
                      <span className="flex items-center space-x-2 my-2">
                        <MdEmail />
                        <span className="">{email}</span>
                      </span>
                    </a>
                  )}

                  {phone && (
                    <a
                      className="hover:text-green-500"
                      href={`tel:+91${phone}`}
                    >
                      <span className="flex items-center my-2 space-x-2">
                        <MdPhone />
                        <span className=""> {`+91${phone}`}</span>
                      </span>
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </main>
        {/* <!-- main ends here --> */}

        {/* <!-- footer --> */}
      </div>{" "}
      <Footer />
    </div>
  )
}

export default EventsDetailsPage
