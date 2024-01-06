import React, { useState, useEffect } from "react"

import { v4 } from "uuid"
import { db } from "../../../../firebase.config"
import {
  doc,
  arrayUnion,
  updateDoc,
  addDoc,
  collection,
  getDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore"

import Spinner from "../../../../components/Spinner/Spinner"
import { useLocation, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

import Required from "../../../../components/Required Icon/Required"

function CreateScrollingTextForm() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "", // data type changed
    hyperlinkText: "",
    hyperlink: "",
  })

  const { title, hyperlink, hyperlinkText } = formData
  const canSave = Boolean(title) && Boolean(hyperlink) && Boolean(hyperlinkText)
  const onMutate = (e) => {
    // Text/Booleans
    if (!e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.id]: e.target.value,
      }))
    }
  }

  const onSubmit = async (e) => {
    window.scroll(0, 0)

    e.preventDefault()

    setLoading(true)

    const docRef = doc(db, "current", "doc")

    const formDataCopy = {
      ...formData,
      createdAt: Timestamp.fromDate(new Date()),
      id: v4(),
    }

    try {
      await updateDoc(docRef, {
        scrollingText: arrayUnion(formDataCopy),
      })

      toast.success(" Created Successfully")
      setLoading(false)

      navigate("/admin")
    } catch (error) {
      toast.error(error.message)
      setLoading(false)
    }

    console.log(formDataCopy)

    setLoading(false)
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
                Title
                <Required />
              </label>
            </div>

            <input
              type="text"
              placeholder="title"
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
              <label
                htmlFor="HyperlinkText"
                className=" left-0  text-gray-600  "
              >
                Hyperlink Text
                <Required />
              </label>
            </div>

            <input
              type="text"
              placeholder="Event HyperlinkText"
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
              name="hyperlinkText"
              id="hyperlinkText"
              onChange={onMutate}
              value={hyperlinkText}
            />
          </div>

          <div className="mb-6">
            <div className="pb-2">
              <label htmlFor="hyperlink" className=" left-0  text-gray-600  ">
                Hyperlink
                <Required />
              </label>
            </div>

            <input
              type="text"
              placeholder="Hyperlink"
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
              name="hyperlink"
              id="hyperlink"
              onChange={onMutate}
              value={hyperlink}
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
              Create Scrolling text
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

export default CreateScrollingTextForm
