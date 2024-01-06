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

function CreateBatchForm() {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  // fech faculty data from db
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    BatchName: "",
  })

  const { BatchName } = formData

  const onMutate = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value.trim(),
    }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const formDataCopy = {
      batchName: `batch${BatchName}`,
      createdAt: serverTimestamp(),
      noOfCourses: {
        cdec: 0,
        cusatech: 0,
        total: 0,
      },
      noOfStd: {
        cusat: 0,
        noncusat: 0,
        total: 0,
      },
    }

    try {
      const docRef = doc(db, "AcademicYear", `batch${BatchName}`)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        toast.warning(`Already exist ${BatchName}`)
      } else {
        const docRef = doc(db, "AcademicYear", `batch${BatchName}`)

        try {
          await setDoc(docRef, formDataCopy)
          if (pathname.toLowerCase().includes("cusatech")) {
            navigate("/cusatech/admin")
          } else {
            navigate("/admin")
          }
        } catch (error) {
          toast.error("Something went wrong")
        }

        // console.log("No such document!")
      }

      setLoading(false)
    } catch (error) {
      toast.error("Could not fetch data")
    }
  }

  const canSave = Boolean(BatchName)

  return (
    <div className="">
      {loading ? (
        <Spinner />
      ) : (
        <>
          <form className="w-full ">
            {/* Batch Name */}
            <div className="mb-6">
              <div className="pb-2">
                {" "}
                <label htmlFor="BatchName" className=" left-0  text-gray-600  ">
                  Batch Name
                </label>
              </div>

              <input
                required
                type="text"
                placeholder="Batch Name"
                className=" w-full rounded p-3 text-gray-800 border-gray-500 outline-none focus-visible:shadow-none focus:border-primary"
                name="BatchName"
                id="BatchName"
                value={BatchName}
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
                Create Batch
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  )
}

export default CreateBatchForm
