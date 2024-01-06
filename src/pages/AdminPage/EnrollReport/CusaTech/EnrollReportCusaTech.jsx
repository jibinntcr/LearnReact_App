import RootLayout from "../../../../components/SideBar/RootLayout"
import Title from "../../../../components/Title/Title"
import { format } from "date-fns"
//components
import Spinner from "../../../../components/Spinner/Spinner"
import "react-toastify/dist/ReactToastify.css"

//faculty template
import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

import "react-datepicker/dist/react-datepicker.css"

//XLSX
import * as XLSX from "xlsx"

//firebase firestore
import { db } from "../../../../firebase.config"
import { getDocs, collection, query, orderBy, where } from "firebase/firestore"
import PaymentTable from "../PaymentTable/PaymentTable"

function EnrollReportCusaTech() {
  const { batch, courseScheduleId } = useParams()
  const [loading, setLoading] = useState(false)

  const [data, setData] = useState([])

  const [DataCount, setDataCount] = useState("")

  // collection ref
  const colRef = collection(db, "enroll")

  // for formatting the fetchData
  function formatCourse(doc) {
    const {
      userName,
      userId,
      userEmail,
      batch,
      courseName,
      courseCode,
      courseBy,
      cusatFlag,
      cash,
      gst,
      totalCash,
      scheduleId,
      createdAt,
    } = doc.data()

    return {
      DocId: doc.id,
      userName,
      userId,
      userEmail,
      batch,
      courseName,
      courseCode,
      courseBy,
      cusatFlag,
      cash,
      gst,
      totalCash,
      scheduleId,
      createdAt,
    }
  }

  // fetch Data from server
  const fetchData = async (state, query, transform = formatCourse) => {
    try {
      const querySnapshot = await getDocs(query)

      setDataCount(querySnapshot.size)

      const results = querySnapshot.docs.map(transform)

      state(results)
      setLoading(false)
    } catch (error) {
      console.error("Error fetching data:", error)
      setLoading(false)
    }
  }

  useEffect(() => {
    const searchQuery = query(
      colRef,
      where("scheduleId", "==", courseScheduleId),
      orderBy("userName", "desc")
    )
    fetchData(setData, searchQuery)
  }, [])

  const handleOnExport = async () => {
    let excel = JSON.parse(JSON.stringify(data))
    const courseInfo = [
      data[0].courseName,
      data[0].courseCode,
      data[0].batch.slice(5),
      data[0].courseBy,
    ]

    await excel.map((item) => {
      delete item.DocId
      delete item.scheduleId
      delete item.userId
      delete item.batch
      delete item.courseBy

      item.User_Name = item.userName
      delete item.userName

      item.User_Email = item.userEmail
      delete item.userEmail

      item.Cash = item.cash
      delete item.cash

      item.GST = item.gst
      delete item.gst

      item.Total_Cash = item.totalCash
      delete item.totalCash

      item.Date = format(item.createdAt.seconds * 1000, "dd/MM/yyyy")
      item.Time = format(item.createdAt.seconds * 1000, "HH:mm:ss")
      delete item.createdAt

      item.cusatFlag
        ? (item.Cusat_student = "Yes")
        : (item.Cusat_student = "No")

      delete item.cusatFlag

      return item
    })

    // console.log(excel)

    var wb = XLSX.utils.book_new()
    var ws = XLSX.utils.json_to_sheet(excel, {
      header: [
        "Cusat_student",
        "User_Name",
        "User_Email",
        "Cash",
        "GST",
        "Total_Cash",
        "Date",
        "Time",
      ], // ordered list of keys
    })
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1")
    const secondWorksheet = XLSX.utils.aoa_to_sheet([
      ["Course Name", "Course Code", "Batch", "Course By"],
      courseInfo,
    ])

    // Add the second worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, secondWorksheet, "Course Details")

    XLSX.writeFile(
      wb,
      `Payment Report ${data[0].courseBy}-${batch}-${data[0].courseName}-${data[0].courseCode}.xlsx`
    )
  }

  return (
    <RootLayout>
      <div className="overflow-hidden rounded-lg m-3  mt-16 ">
        <div className="container my-8">
          <Title>Payment Information</Title>
        </div>

        {loading ? (
          <Spinner />
        ) : data && data.length > 0 ? (
          <>
            <p className="text-xl my-4 font-semibold">
              {" "}
              No of documents : {DataCount}
            </p>
            <div className="flex justify-end mt-8 p-4">
              <button
                onClick={handleOnExport}
                className="bg-transparent hover:bg-green-500 text-green-700 font-semibold hover:text-white py-2 px-4 border border-green-500 hover:border-transparent rounded-full"
              >
                Export to Excel
              </button>
            </div>

            <PaymentTable data={data} />
          </>
        ) : (
          <div className="container my-64 h-5/6 w-11/12 flex text-5xl font-bold justify-center items-center">
            <Title>Data is Empty</Title>
          </div>
        )}
      </div>
    </RootLayout>
  )
}

export default EnrollReportCusaTech
