import React, { useState, useEffect } from "react"

import { db } from "../../../../firebase.config"
import {
  doc,
  arrayUnion,
  updateDoc,
  getDocs,
  limit,
  collection,
  query,
  where,
} from "firebase/firestore"

import { useNavigate, useLocation } from "react-router-dom"
import { toast } from "react-toastify"

//components
import Required from "../../../../components/Required Icon/Required"
import Spinner from "../../../../components/Spinner/Spinner"
import Title from "../../../../components/Title/Title"

function CreateCourseName() {
  const { pathname, state } = useLocation()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)

  // State
  const [name, setName] = useState("")
  const [data, setData] = useState({})

  const fetchDoc = async () => {
    try {
      if (state) {
        const q = query(
          collection(db, "departments"),
          where("name", "==", state),
          limit(1)
        )
        const docSnap = await getDocs(q)
        // Check if the QuerySnapshot is empty
        if (!docSnap.empty) {
          // Get the first document from the docSnap
          const firstDocument = docSnap.docs[0]

          // Extract the ID and data of the first document
          const docId = firstDocument.id
          let docData = firstDocument.data()

          docData = { ...docData, docId: docId }

          setData(docData)

          // console.log('Document ID:', docId)
          // console.log('Document data:', docData)
        } else {
          toast.warning("Something went wrong, retry select department")
          // console.log('No documents found in the collection.')
        }
      } else {
        // console.log("No state provided!")
        // toast.warning("Something went wrong, retry select department")
      }
    } catch (error) {
      console.error("An error occurred:", error)

      toast.error("An error occurred while fetching data!")
    }
  }

  useEffect(() => {
    window.scroll(0, 0)
    fetchDoc()
  }, [])
  // console.log(state)

  const canSave = Boolean(name)
  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    if (data?.docId?.length === 0) {
      toast.warning("Something went wrong, retry select department")
      setLoading(false)
      return
    }

    if (data?.courses?.includes(name)) {
      toast.warning("Course already exist")
      setLoading(false)
      return
    }

    try {
      const docRef = doc(db, "departments", data?.docId)
      await updateDoc(docRef, {
        courses: arrayUnion(name),
      })

      toast.success(name + "  Created Successfully")
      setLoading(false)

      if (pathname.toLowerCase().includes("cusatech")) {
        navigate("/cusatech/admin")
      } else {
        navigate("/admin")
      }
    } catch (error) {
      toast.error(error.message)
      setLoading(false)
    }

    setLoading(false)

    // pending also check array contain the name
  }

  return (
    <div className="">
      {loading ? (
        <>
          <Spinner />
        </>
      ) : (
        <>
          <form className="w-full">
            <Title>Department : {data?.name}</Title>

            {/* name */}
            <div className="mb-6">
              <div className="pb-2">
                <label htmlFor="name" className=" left-0  text-gray-600  ">
                  Course name
                  <Required />
                </label>
              </div>

              <input
                required
                type="text"
                placeholder="Course name"
                className=" w-full rounded p-3 text-gray-800 border-gray-500 outline-none focus-visible:shadow-none focus:border-primary"
                name="name"
                id="name"
                onChange={(e) => {
                  setName(e.target.value)
                }}
                value={name}
              />
            </div>

            {/* submit */}
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
                Create Course
              </button>
            </div>
          </form>

          {data?.courses?.length !== 0 ? (
            <div className="p-5  ">
              <h1 className="text-xl text-center font-semibold mb-2">
                Course List <br />{" "}
                <p className="text-right mb-4 mr-10 text-sm text-gray-600">
                  No of Course {data?.courses?.length}
                </p>
              </h1>

              <div className="overflow-auto rounded-lg shadow block">
                <table className="w-full ">
                  <thead className="bg-gray-50 border-b-2 border-gray-200">
                    <tr className="">
                      <th className="w-20 p-3 text-base font-semibold tracking-wide text-left">
                        No.
                      </th>
                      <th className="p-3 text-base font-semibold tracking-wide text-left">
                        Course Name
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {data?.courses?.map((item, index) => (
                      <tr className="even:bg-white odd:bg-gray-100" key={index}>
                        <td className="p-3 text-base whitespace-nowrap text-blue-500">
                          {++index}
                        </td>
                        <td className="p-3 text-base text-gray-700 whitespace-nowrap">
                          {item}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            ""
          )}
        </>
      )}
    </div>
  )
}

export default CreateCourseName
