import React, { useState, useEffect } from "react"
import Sidebar from "../../../components/SideBar/SideBarCusatech"
import FromDesign from "../../../components/NewForms/FormDesign"

//firebase firestore
import { db } from "../../../firebase.config"
import { getDoc, doc, updateDoc } from "firebase/firestore"

import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
import Spinner from "../../../components/Spinner/Spinner"
import RootLayout from "../../../components/SideBar/RootLayout"

function CusatechHomePageEdit() {
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)

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
      //console.log("Document data:", docSnap.data())
      // setData(formatDoc(docSnap))
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
      setData((prevState) => ({
        ...prevState,
        [e.target.id]: boolean ?? e.target.value,
      }))
    }
  }

  let canSave = Boolean(text1) && Boolean(text2)

  const onSubmit = async (e) => {
    e.preventDefault()

    setLoading(true)
    // Store image in firebase

    const formDataCopy = {
      ...data,
    }

    updateDoc(docRef, formDataCopy)
      .then(() => {
        toast.success("Updation successfully")
        setLoading(false)
        navigate(-1)
      })
      .catch((err) => {
        setLoading(false)
        toast.error(err.message)
      })
  }

  const maxLengthFortext1 = 50
  const remainingCharactersFortext1 = maxLengthFortext1 - text1.length

  const maxLengthFortext2 = 256
  const remainingCharactersFortext2 = maxLengthFortext2 - text2.length

  return (
    <RootLayout>
      <div className=" min-h-screen w-full">
        <FromDesign
          text={"Edit Cusatech Home Page text"}
          formJsx={
            <>
              {loading ? (
                <>
                  <Spinner />
                </>
              ) : (
                <form className="w-full ">
                  <div className="mb-6">
                    <ul className="list-decimal">
                      <li className="mb-2 text-3xl"></li>
                    </ul>
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
                        value={text1}
                        onChange={onMutate}
                        maxLength={50}
                      ></textarea>

                      <p className="my-3 text-gray-500">
                        {remainingCharactersFortext1} characters remaining (up
                        to {maxLengthFortext1} characters)
                      </p>
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
                        onChange={onMutate}
                        value={text2}
                        maxLength={256}
                      />
                      <p className="my-3 text-gray-500">
                        {remainingCharactersFortext2} characters remaining (up
                        to {maxLengthFortext2} characters)
                      </p>
                    </div>

                    <div>
                      <button
                        type="submit"
                        onClick={onSubmit}
                        className={
                          "w-full text-gray-900  bg-green-400 rounded-lg border border-primary text-lg p-3 transition ease-in-out duration-500"
                        }
                      >
                        Save Changes
                      </button>
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

export default CusatechHomePageEdit
