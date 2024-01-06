import React, { useState, useEffect } from "react"
import Select from "react-select"

import { db } from "../../../../firebase.config"
import {
  setDoc,
  doc,
  getDoc,
  query,
  updateDoc,
  serverTimestamp,
  addDoc,
} from "firebase/firestore"

import Spinner from "../../../../components/Spinner/Spinner"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { toast } from "react-toastify"

function CreateGstValueForm() {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  // fech faculty data from db
  const [loading, setLoading] = useState(false)

  const [PreviousGstValue, setPreviousGstValue] = useState("")

  const [formData, setFormData] = useState({
    GstValue: "",
  })

  const { GstValue } = formData

  const onMutate = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }))
  }

  const getData = async () => {
    try {
      const docRef = doc(db, "current", `doc`)
      const docSnap = await getDoc(docRef)
      setPreviousGstValue(docSnap.data().GstValue)
    } catch (e) {
      // console.log(e)
    }
    setLoading(false)
  }

  useEffect(() => {
    setLoading(true)
    getData()
  }, [])

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const formDataCopy = {
      GstValue: Number(GstValue),
      lastUpdation: serverTimestamp(),
    }

    try {
      if (PreviousGstValue === Number(GstValue)) {
        toast.warning(`Already exist ${PreviousGstValue}`)
      } else {
        const docRef = doc(db, "current", "doc")
        try {
          await updateDoc(docRef, formDataCopy)
          if (pathname.toLowerCase().includes("cusatech")) {
            navigate("/cusatech/admin")
          } else {
            navigate("/admin")
          }
        } catch (error) {
          toast.error("Something went wrong")
        }
      }
      setLoading(false)
    } catch (error) {
      toast.error("Could not fetch data")
    }
  }

  const canSave = Boolean(GstValue)

  return (
    <div className="">
      {loading ? (
        <Spinner />
      ) : (
        <>
          <form className="w-full ">
            {/* GST Value */}
            <div className="mb-6">
              <div className="pb-2">
                {" "}
                <label htmlFor="GstValue" className=" left-0  text-gray-600  ">
                  Current GST Value: {PreviousGstValue}
                </label>
              </div>

              <input
                required
                type="text"
                placeholder="GST Value"
                className=" w-full rounded p-3 text-gray-800 border-gray-500 outline-none focus-visible:shadow-none focus:border-primary"
                name="GstValue"
                id="GstValue"
                value={GstValue}
                onChange={onMutate}
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
                Update Changes
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  )
}

export default CreateGstValueForm
