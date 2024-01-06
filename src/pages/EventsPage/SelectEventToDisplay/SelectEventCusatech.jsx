import React, { useState, useEffect } from "react"
import {
  collection,
  getDocs,
  query,
  onSnapshot,
  orderBy,
  doc,
  updateDoc,
} from "firebase/firestore"
import { toast } from "react-toastify"
import "react-confirm-alert/src/react-confirm-alert.css"
import Sidebar from "../../../components/SideBar/SideBarCusatech"
import Spinner from "../../../components/Spinner/Spinner"
import Switch from "react-switch"
import { db } from "../../../firebase.config"

function SelectEventCusatech() {
  // State
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState([])
  const [switchStatus, setSwitchStatus] = useState({})

  const colRef = collection(db, "events")
  //query
  const q = query(colRef, orderBy("createdAt", "desc"))

  function formatCourse(doc) {
    const { title, description, HomePageDisplayStatus } = doc.data()
    return { DocId: doc.id, title, description, HomePageDisplayStatus }
  }

  const fetchData = () => {
    getDocs(q)
      .then((snapshot) => {
        let results = snapshot.docs.map(formatCourse)
        setData(results)

        const initialSwitchStatus = {}
        results.forEach((item) => {
          initialSwitchStatus[item.DocId] = item.HomePageDisplayStatus || false
        })
        setSwitchStatus(initialSwitchStatus)

        setLoading(false)
      })
      .catch((err) => {
        // console.log(err.message)
        setLoading(false)
      })

    onSnapshot(colRef, (querySnapshot) => {
      setLoading(true)
      let results = querySnapshot.docs.map(formatCourse)
      setData(results)

      setLoading(false)
    })
  }

  useEffect(() => {
    fetchData()
  }, [])

  // console.log(switchStatus)

  const handleChange = (docId) => {
    // console.log(docId)
    setSwitchStatus((prevStatus) => ({
      ...prevStatus,
      [docId]: !prevStatus[docId],
    }))
    UpdateState(docId)
  }

  const UpdateState = (targetDocId) => {
    const sts = !switchStatus[targetDocId]
    // console.log("docID:", targetDocId)

    let data = {
      HomePageDisplayStatus: Boolean(sts),
    }
    // console.log("status:", data)

    const docRef = doc(db, "events", targetDocId)
    try {
      updateDoc(docRef, data)
        .then((docRef) => {
          toast.success("Updated!")
        })
        .catch((error) => {
          // console.log(error)
        })
    } catch (e) {
      toast.error("Something Went Wrong!")
    }
  }

  return (
    <Sidebar
      mainContent={
        loading ? (
          <Spinner />
        ) : data && data.length > 0 ? (
          <div className="p-5 mt-10">
            {/* <h1 className="text-xl font-serif font-semibold mb-6">
            Total no of Courses: {data.length}
          </h1> */}
            <div className="overflow-auto rounded-lg shadow hidden md:block">
              <table className="w-full">
                <thead className="bg-gray-50 border-b-2 border-gray-200">
                  <th className="p-3 text-sm text-gray-700 whitespace-nowrap"></th>
                  <th className="p-3 text-sm text-gray-700 whitespace-nowrap">
                    Event Name
                  </th>
                  <th className="p-3 text-sm text-gray-700 whitespace-nowrap">
                    Event Description
                  </th>
                  <th className="p-3 text-sm text-gray-700 whitespace-nowrap"></th>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data.map((item, index) => (
                    <tr key={index} className="even:bg-white odd:bg-gray-100">
                      <td className="p-3 text-sm whitespace-nowrap text-blue-500">
                        {++index}
                      </td>
                      <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                        {item.title}
                      </td>
                      <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                        {item.description}
                      </td>
                      <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                        <Switch
                          id={`HomePageDisplayStatus_${item.DocId}`}
                          onChange={() => handleChange(item.DocId)}
                          checked={switchStatus[item.DocId]}
                        />
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

export default SelectEventCusatech
