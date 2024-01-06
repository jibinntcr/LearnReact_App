import React, { useState, useEffect } from "react"
import Sidebar from "../../../components/SideBar/SideBar"

import FromDesign from "../../../components/NewForms/FormDesign"

//firebase firestore
import { db } from "../../../firebase.config"
import { doc, getDoc } from "firebase/firestore"
import { FaRegEdit } from "react-icons/fa"
import { Link } from "react-router-dom"
import Spinner from "../../../components/Spinner/Spinner"
import RootLayout from "../../../components/SideBar/RootLayout"

function HomepageCdecEdit() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState({})

  function formatDoc(doc) {
    const { bg1, bg2, text1, text2 } = doc.data()
    return { bg1, bg2, text1, text2 }
  }

  const getData = async () => {
    const docRef = doc(db, "homepage", "cdec")
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      // console.log("Document data:", docSnap.data())
      setData(formatDoc(docSnap))
    } else {
      // doc.data() will be undefined in this case
      // console.log("No such document!")
    }

    setLoading(false)
  }

  useEffect(() => {
    getData()
  }, [])

  return (
    <RootLayout>
      <div className=" min-h-screen w-full">
        <FromDesign
          text={"Home Page Edit Cdec"}
          formJsx={
            <>
              {loading ? (
                <>
                  <Spinner />
                </>
              ) : (
                <form className="w-full flex justify-center">
                  <div className="mb-6 ">
                    <div className="flex flex-wrap -mx-3">
                      <div className=" w-full max-w-full px-3 shrink-0  ">
                        <Link
                          className="hover:text-green-500"
                          to="/admin/homepageEdit/text"
                        >
                          <p className="flex text-base hover:text-green-500 text-black items-center justify-end">
                            Edit
                            <FaRegEdit className="mr-1 md:mr-10  mx-1 " />
                          </p>
                        </Link>
                      </div>
                    </div>

                    <div className="mb-6">
                      <div className="pb-2">
                        <label
                          htmlFor="text1"
                          className=" left-0  text-gray-600 font-semibold  text-xl  "
                        >
                          Main Heading
                        </label>{" "}
                      </div>
                      <textarea
                        rows="6"
                        placeholder="Main Heading..."
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
                        name="text1"
                        id="text1"
                        value={data.text1}
                        maxLength={50}
                        disabled
                      ></textarea>
                    </div>
                    {/* { First text } */}

                    <div className="mb-6">
                      <div className="pb-2">
                        <label
                          htmlFor="text1"
                          className=" left-0  text-gray-600 font-semibold  text-xl "
                        >
                          Banner Text
                        </label>{" "}
                      </div>
                      <textarea
                        rows="6"
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
                        name="text2"
                        id="text2"
                        placeholder="Banner Text..."
                        value={data.text2}
                        disabled
                        maxLength={256}
                      ></textarea>
                    </div>

                    {/* {Background Image} */}
                    <div className="mb-6">
                      <div class="grid grid-cols-2 gap-2">
                        <div>
                          <figure className="max-w-sm">
                            <img
                              className="h-auto max-w-full rounded-lg"
                              src={data.bg1}
                              alt="bg1"
                            />
                            <figcaption className="mt-2 text-sm text-center text-gray-500 ">
                              Background Image 1
                            </figcaption>
                            <Link
                              className="hover:text-green-500"
                              to={`/admin/homepageEdit/cdec/ImageEdit/bg1`}
                            >
                              <p className="flex text-base hover:text-green-500 text-black items-center justify-end">
                                Edit
                                <FaRegEdit className="mr-1 md:mr-10  mx-1 " />
                              </p>
                            </Link>
                          </figure>
                        </div>

                        {/* {second Image} */}

                        <div>
                          <figure className="max-w-sm">
                            <img
                              className="h-auto max-w-full rounded-lg"
                              src={data.bg2}
                              alt="bg2"
                            />

                            <figcaption className="mt-2 text-sm text-center text-gray-500 ">
                              Background Image 2
                            </figcaption>
                            <Link
                              className="hover:text-green-500"
                              to={`/admin/homepageEdit/cdec/ImageEdit/bg2`}
                            >
                              <p className="flex text-base hover:text-green-500 text-black items-center justify-end">
                                Edit
                                <FaRegEdit className="mr-1 md:mr-10  mx-1 " />
                              </p>
                            </Link>
                          </figure>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              )}
            </>
          }
        />
      </div>
    </RootLayout>
  )
}

export default HomepageCdecEdit
