import React, { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { db } from "../../firebase.config"
import {
  collection,
  getDocs,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore"

import { useUserAuth } from "../../context/UserAuthContext"

import { confirmAlert } from "react-confirm-alert"
import "react-confirm-alert/src/react-confirm-alert.css"

import Spinner from "../../components/Spinner/Spinner"
import RootLayout from "../../components/SideBar/RootLayout"

import { getFunctions, httpsCallable } from "firebase/functions"

function UserAction() {
  const functions = getFunctions()

  const { user } = useUserAuth()

  const [loading, setLoading] = useState(true)
  const [data, setData] = useState([])

  const colRef = collection(db, "users")
  //const q = query(colRef, orderBy("createdAt", "desc"));

  const getUserDetails = httpsCallable(functions, "getUserDetails")

  const enableDisableUserCallable = httpsCallable(
    functions,
    "enableDisableUser"
  )

  function formatuser(doc) {
    const { name, email } = doc.data()

    return { DocId: doc.id, name, email }
  }

  const fetchData = () => {
    getDocs(colRef)
      .then((snapshot) => {
        let results = snapshot.docs.map(formatuser)
        results.forEach((item) => {
          handleGetUser(item.DocId)
        })
        setData(results)
        setLoading(false)
      })
      .catch((err) => {
        // console.log(err.message)
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleGetUser = async (id) => {
    try {
      // console.log("uid:", id);
      const userDetails = await getUserDetails({ uid: id })
      // console.log("User details:", userDetails);
      // console.log("current User:",user.uid);
    } catch (error) {
      console.error("Error fetching user details:", error.name)
    }
  }

  const toggleUserStatus = async (docId, newStatus) => {
    // const userRef = doc(db, "users", docId);

    // try {
    //   await updateDoc(userRef, { status: newStatus });
    //   fetchData();
    //   toast.success(`User ${newStatus ? "enabled" : "disabled"} successfully`);
    // } catch (error) {
    //   toast.error(`Could not ${newStatus ? "enable" : "disable"} user: ${error.message}`);
    //   console.log(error);
    // }

    try {
      const result = await enableDisableUserCallable({
        uid: docId,
        disabled: newStatus,
      })
      // console.log(result.data.message);
    } catch (error) {
      console.error("Error toggling user:", error)
    }
  }

  const EnableConfirm = (e, docId) => {
    confirmAlert({
      title: "Enable this user?",
      message: "To confirm, click yes.",
      buttons: [
        {
          label: "Yes",
          onClick: () => toggleUserStatus(docId, true),
        },
        {
          label: "No",
          onClick: () => {
            toast.error("Enable cancelled")
          },
        },
      ],
    })
  }

  const DisableConfirm = (e, docId) => {
    confirmAlert({
      title: "Disable this user?",
      message: "To confirm, click yes.",
      buttons: [
        {
          label: "Yes",
          onClick: () => toggleUserStatus(docId, false),
        },
        {
          label: "No",
          onClick: () => {
            toast.error("Disable cancelled")
          },
        },
      ],
    })
  }

  return (
    <RootLayout>
      {loading ? (
        <Spinner />
      ) : data && data.length > 0 ? (
        <div className="p-5 mt-10">
          <h1 className="text-xl font-serif font-semibold mb-6">
            Total No Of Users: {data.length}
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
                    Email
                  </th>
                  <th className="w-24 p-3 text-sm font-semibold tracking-wide text-left">
                    State
                  </th>
                  <th className="w-24 p-3 text-sm font-semibold tracking-wide text-left">
                    Action
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
                      {item.name}
                    </td>
                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                      {item.email}
                    </td>
                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                      {item.status ? "Enabled" : "Disabled"}
                    </td>
                    <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                      <button
                        id={item.DocId}
                        onClick={(e) =>
                          item.status
                            ? DisableConfirm(e, item.DocId)
                            : EnableConfirm(e, item.DocId)
                        }
                        className={`inline-flex items-center px-4 py-2 ${
                          item.status ? "bg-red-600" : "bg-green-600"
                        } hover:bg-red-700 hover:bg-green-700 text-white text-sm font-medium rounded-md`}
                      >
                        {item.status ? "Disable" : "Enable"}
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

export default UserAction
