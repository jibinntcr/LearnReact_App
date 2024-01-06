import React, { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { db } from "../../../firebase.config"
import {
  doc,
  onSnapshot,
  updateDoc
} from "firebase/firestore"

import { confirmAlert } from "react-confirm-alert" // Import
import "react-confirm-alert/src/react-confirm-alert.css" // Import css


import Spinner from "../../../components/Spinner/Spinner"

import Title from "../../../components/Title/Title"
import RootLayout from "../../../components/SideBar/RootLayout"

function DeleteScrollingText() {
  // State
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState([])



  useEffect(() => {
    const fetchScrollingText = async () => {
      try {
        // Assuming 'docRef' is the reference to the document you want to fetch
        const unSub = await onSnapshot(doc(db, "current", "doc"),(doc) => {
            console.log("Current data: ", doc.data());
            const data = doc.data()
            if (data.scrollingText) {
                setData(data.scrollingText)
                console.log(data.scrollingText)
              }
        });

        setLoading(false)
      } catch (error) {
        console.error("Error fetching document:", error.message)
      }
    }
    fetchScrollingText()
  }, [])

  const DeleteConfirm = (e, title)  => {
    const docId = e.target.id

    confirmAlert({
      title: "Delete " + title,
      message: "To confirm click yes ",
      buttons: [
        {
          label: "Yes",
          onClick: () =>
            onClickDelete(docId),
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

  function removeItemById(inputArray, idToRemove) {
    // Use filter to create a new array with items that do not match the given ID
    const newArray = inputArray.filter(item => item.id !== idToRemove);
    
    return newArray;
}

 
  const onClickDelete = async (docId) => {
    window.scroll(0, 0)


   const newArray=  removeItemById(data, docId)


   const docRef = doc(db, "current", "doc");

const updateData = {
  scrollingText: newArray
};
   



try {
  await updateDoc(docRef, updateData);
  toast.success("Scrolling text deleted successfully");
  setData(newArray)
} catch (error) {
  toast.error("Could not delete" + error.message);
}

  }



  return (
    <RootLayout>
      {loading ? (
        <Spinner />
      ) : data && data.length > 0 ? (

        <div className="p-5 mt-10  ">
          <Title>Delete Scrolling text</Title>
          <h1 className="text-xl font-serif font-semibold mb-6">
            {" "}
            Total no of Scrolling text: {data.length}
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
                      {item.title}
                    </td>
                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                      <button
                        id={item.id}
                        onClick={(e) =>
                          DeleteConfirm(
                            e,
                            item?.title,
                            item?.id,
                    
                          )
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
        <div className="flex justify-center min-h-screen items-center text-2xl font-semibold">
     
          {"No Scrolling Text found"}
        </div>
      )}
    </RootLayout>
  )
}

export default DeleteScrollingText