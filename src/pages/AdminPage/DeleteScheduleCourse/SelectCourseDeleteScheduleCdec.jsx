import React, { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { db } from "../../../firebase.config"
import {
  collection,
  getDocs,
  query,
  orderBy,
  deleteDoc,
  doc,
  onSnapshot,
  limit,
} from "firebase/firestore"

import { confirmAlert } from "react-confirm-alert" // Import
import "react-confirm-alert/src/react-confirm-alert.css" // Import css

import Sidebar2 from "../SideBar2"
import Spinner from "../../../components/Spinner/Spinner"

import { getStorage, ref, deleteObject } from "firebase/storage"

function SelectCourseDeleteScheduleCdec() {
  const { batch } = useParams()

  // const storage = getStorage()

  // State
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState([])

  // collection ref
  const colRef = collection(db, `/AcademicYear/${batch}/cdec`)
  //query
  const q = query(colRef)

  // for format the fetchData
  function formatCourse(doc) {
    const { CourseName, createdAt } = doc.data()

    return { DocId: doc.id, CourseName, createdAt }
  }

  const fetchData = () => {
    window.scroll(0, 0)

    getDocs(q)
      .then((snapshot) => {
        let results = []
        snapshot.docs.forEach((doc) => {
          results.push({ ...doc.data(), DocId: doc.id })
        })
        // console.log(results)
        setData(results)
        setLoading(false)
      })
      .catch((err) => {
        // console.log(err.message)
        setLoading(false)
      })

    onSnapshot(colRef, (querySnapshot) => {
      setLoading(true)
      let results = querySnapshot.docs.map(formatCourse)
      // console.log("results")
      // console.log(results)
      setData((prev) => [...results])
      setLoading(false)
    })
  }

  useEffect(() => {
    window.scroll(0, 0)

    // collection ref

    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const DeleteConfirm = (e, title, imageLocation) => {
    const docId = e.target.id

    confirmAlert({
      title: "Delete " + title,
      message: "To confirm click yes ",
      buttons: [
        {
          label: "Yes",
          onClick: () => onClickDelete(docId, imageLocation),
        },
        {
          label: "No",
          onClick: () => {
            toast.error("Delete cancelled")
          },
        },
      ],
    })
  }

  //event delete
  const onClickDelete = async (docId, fileName) => {
    window.scroll(0, 0)

    // console.log(fileName)

    // Create a reference to the image to delete
    //  const storageRef = ref(storage, 'events/' + fileName)

    const docRef = doc(db, `/AcademicYear/${batch}/cdec/`, docId)

    try {
      // await deleteObject(storageRef)// Delete the file
      await deleteDoc(docRef) // delete doc from db
      toast.success("course deleted successfully")
    } catch (error) {
      toast.error("Could not delete" + error.message)
      // console.log(error)
    }
  }

  return (
    <Sidebar2
      mainContent={
        loading ? (
          <Spinner />
        ) : data && data.length > 0 ? (
          <div className="p-5 mt-10  ">
            <h1 className="text-xl font-serif font-semibold mb-6">
              {" "}
              Total no of Courses: {data.length}
            </h1>

            <div className="overflow-auto rounded-lg shadow hidden md:block">
              <table className="w-full ">
                <thead className="bg-gray-50 border-b-2 border-gray-200">
                  <tr className="">
                    <th className="w-20 p-3 text-sm font-semibold tracking-wide text-left">
                      No.
                    </th>
                    <th className="p-3 text-sm font-semibold tracking-wide text-left">
                      Name
                    </th>
                    <th className="w-24 p-3 text-sm font-semibold tracking-wide text-left">
                      Delete
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {data.map((item, index) => (
                    <tr
                      key={item.DocId}
                      className="even:bg-white odd:bg-gray-100"
                    >
                      <td className="p-3 text-sm whitespace-nowrap text-blue-500">
                        {++index}
                      </td>
                      <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                        {item.CourseName}
                      </td>
                      <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                        <button
                          id={item.DocId}
                          onClick={(e) =>
                            DeleteConfirm(e, item?.title, item?.imageLocation)
                          }
                          className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div>
            <h1 className="text-5xl font-serif font-semibold mb-6 flex justify-center items-center h-screen w-full  -mt-20">
              Records empty
            </h1>
          </div>
        )
      }
    />
  )
}

export default SelectCourseDeleteScheduleCdec
