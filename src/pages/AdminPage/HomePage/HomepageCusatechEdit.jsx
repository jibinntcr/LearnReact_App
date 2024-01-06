import React, { useState, useEffect } from "react"
import Sidebar from "../../../components/SideBar/SideBarCusatech"
//firebase firestore
import { db } from "../../../firebase.config"
import { doc, getDoc } from "firebase/firestore"
// css
//Components
import Title from "../../../components/Title/Title"
import Spinner from "../../../components/Spinner/Spinner"
import FromDesign from "../../../components/NewForms/FormDesign"
import { FaRegEdit } from "react-icons/fa"
import { Link } from "react-router-dom"
import RootLayout from "../../../components/SideBar/RootLayout"

function HomepageCusatechEdit() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState({})

  const getData = async () => {
    const docRef = doc(db, "homepage", "cusatech")
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

  function formatDoc(doc) {
    const { bg1, bg2, text1, text2 } = doc.data()
    return { bg1, bg2, text1, text2 }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    getData()
  }, [])

  return (
    <RootLayout>
      <div className=" min-h-screen w-full">
        <FromDesign
          text={"Home Page Edit Cusatech"}
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
                        <Link className="hover:text-green-500" to="Edit">
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
                        id="text1"
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
                        placeholder="Main Heading..."
                        value={data.text1}
                        disabled
                      />
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
                        id="text2"
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
                        placeholder="Banner Text..."
                        value={data.text2}
                        disabled
                      />
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
                            <figcaption className="mt-2 text-sm text-center text-gray-500 dark:text-gray-400">
                              Background Image 1.
                            </figcaption>
                            <Link
                              className="hover:text-green-500"
                              to="/cusatech/admin/homepageEdit/cusatech/ImageEdit/bg1"
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
                            <figcaption className="mt-2 text-sm text-center text-gray-500 dark:text-gray-400">
                              Background Image 2
                            </figcaption>
                            <Link
                              className="hover:text-green-500"
                              to="/cusatech/admin/homepageEdit/cusatech/ImageEdit/bg2"
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

export default HomepageCusatechEdit
