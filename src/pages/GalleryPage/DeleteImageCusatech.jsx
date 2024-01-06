import React, { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { db } from "../../firebase.config"
import {
  collection,
  getDocs,
  query,
  orderBy,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore"

import { confirmAlert } from "react-confirm-alert" // Import
import "react-confirm-alert/src/react-confirm-alert.css" // Import css

import Spinner from "../../components/Spinner/Spinner"

import { getStorage, ref, deleteObject } from "firebase/storage"
import RootLayout from "../../components/SideBar/RootLayout"

function DeleteImageCusatech() {
  const storage = getStorage()

  // State
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState([])

  // collection ref
  const colRef = collection(db, "gallery")
  //query
  const q = query(colRef, orderBy("createdAt", "desc"))

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
      let results = querySnapshot.docs.map(formatEvents)
      // console.log("results")
      // console.log(results)
      setData((prev) => [...results])
      setLoading(false)
    })
  }

  useEffect(() => {
    fetchData()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // for formatting the fetchData
  function formatEvents(doc) {
    const { img, createdAt } = doc.data()

    return { DocId: doc.id, img, createdAt }
  }

  function getFilenameFromDownloadURL(downloadURL) {
    const parts = downloadURL.split("/")
    const filenameWithQuery = parts[parts.length - 1]
    const filename = filenameWithQuery.split("?")[0]
    const decodedFilename = decodeURIComponent(filename)
    return decodedFilename.split("/")[1]
  }

  const DeleteConfirm = (e, title) => {
    let id = e.target.id

    // console.log("docID",id)
    const filename = getFilenameFromDownloadURL(title)

    // console.log("fileName:",filename)

    confirmAlert({
      title: "Do you really want to remove this Image?",
      message: "To confirm click yes ",
      buttons: [
        {
          label: "Yes",
          onClick: () => onClickDelete(e.target.id, filename),
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

  //Image delete
  const onClickDelete = async (docId, fileName) => {
    window.scroll(0, 0)

    // console.log(fileName)

    // Create a reference to the image to delete
    const storageRef = ref(storage, "gallery/" + fileName)

    const docRef = doc(db, "gallery", docId)

    try {
      await deleteObject(storageRef) // Delete the file
      await deleteDoc(docRef) // delete doc from db
      toast.success("Image deleted successfully")
    } catch (error) {
      toast.error("Could not delete" + error.message)
      // console.log(error)
    }
  }

  return (
    <RootLayout>
      {loading ? (
        <Spinner />
      ) : data && data.length > 0 ? (
        <div className="p-5 mt-10  ">
          <h1 className="text-xl font-serif font-semibold mb-6">
            {" "}
            Total no of Images: {data.length}
          </h1>

          <div className="overflow-auto rounded-lg shadow hidden md:block">
            <table className="w-full ">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr className="">
                  <th className="w-20 p-3 text-sm font-semibold tracking-wide text-left">
                    No.
                  </th>
                  <th className="p-3 text-sm font-semibold tracking-wide text-left">
                    Image
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
                      <img
                        className="max-h-40 max-w-xs"
                        src={item.img}
                        alt="GalleryImage"
                      />
                    </td>

                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                      <button
                        id={item.DocId}
                        onClick={(e) => DeleteConfirm(e, item?.img)}
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
        <div className="flex justify-center min-h-screen items-center text-2xl font-semibold">
          {"No records found"}
        </div>
      )}
    </RootLayout>
  )
}

export default DeleteImageCusatech
