import React, { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { db } from "../../../../firebase.config"
import {
  collection,
  getDocs,
  query,
  orderBy,
  updateDoc,
  doc,
  documentId,
  where,
  getDoc,
} from "firebase/firestore"
import { useParams } from "react-router-dom"

//XLSX
import * as XLSX from "xlsx"

//pdf
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

import Sidebar2 from "../../SideBar2"
import Spinner from "../../../../components/Spinner/Spinner"
import RootLayout from "../../../../components/SideBar/RootLayout"

function ReportCusaTech() {
  const { batch, courseScheduleId } = useParams()
  // State
  const [loading, setLoading] = useState(true)
  const [course, setCourses] = useState([])
  const [courseDetails, setCourseDetails] = useState({})
  const [users, setUsers] = useState([])

  const [afterGraded, setAfterGraded] = useState([])
  const [facultyData, setFacultyData] = useState([])

  // Fetch all docs enrolled user details
  const fetchData = async () => {
    window.scroll(0, 0)

    // collection ref
    const colRef = collection(
      db,
      `/AcademicYear/${batch}/cusaTech/${courseScheduleId}/students`
    )
    //console.log(`/AcademicYear/${batch}/cdec/${courseScheduleId}/students `)

    //query
    const q = query(colRef, orderBy("enrolledAt", "desc"))

    try {
      setLoading(true)
      const querySnapshot = await getDocs(q)
      const results = querySnapshot.docs.map(formatCourse)
      // console.log("results")
      // console.log(results)
      setCourses(results)
    } catch (error) {
      console.error("Error fetching data: ", error)
    } finally {
      setLoading(false)
    }
  }

  // return array list of doc id
  const getUsersDocID = async (courseArg) => {
    const refs = []
    await courseArg?.map((item) => refs.push(item.userId))

    return refs
  }

  // fetch Course title
  const fetchTitle = async () => {
    const docRef = doc(db, `/AcademicYear/${batch}/cusaTech`, courseScheduleId)

    try {
      const docSnap = await getDoc(docRef)
      // console.table(docSnap.data())
      const FacultyIds = docSnap.data().CourseFaculty
      setCourseDetails(docSnap.data())

      if (FacultyIds) {
        try {
          const snapshot = await getDocs(
            query(
              collection(db, "faculty"),
              where(documentId(), "in", FacultyIds)
            )
          )

          let faculty = []
          snapshot.docs.forEach((doc) => {
            faculty.push({ ...doc.data(), DocId: doc.id })
          })

          // console.log(faculty)
          setFacultyData(faculty)
        } catch (error) {
          // console.log(error.message)
        }
      }
    } catch (error) {
      // console.log(error)
    }
  }

  useEffect(() => {
    fetchData()

    fetchTitle()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const fetchUsers = async () => {
      const arrayList = await getUsersDocID(course)

      // console.log(arrayList)
      // console.log("arrayList")

      arrayList.map((item) => fetchSingleDoc(item))

      const roots = await arrayUniqueByKey(users, "DocId")

      // console.log(roots)
      // console.log("roots")

      combineObj()
    }

    fetchUsers()
    // console.log("users")

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [course])

  useEffect(() => {
    combineObj()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [users, course])

  // for formatting the fetchData
  function formatCourse(doc) {
    const { userId, grade } = doc.data()

    return { userId, grade }
  }

  // for formatting the fetchData
  function formatUser(doc) {
    let {
      name,
      email,
      mobile,
      gender,
      dob,
      address,
      country,
      state,
      pincode,
      photo,
      linkedIn,
      nonCusatStudent,
      cusatFlag,
      universityRegNo,
      department,
      course,
      semester,
      digiLockerId,
      abcId,
      universityName,
      aadharNo,
      highestQualification,
    } = doc.data()

    linkedIn = Empty(linkedIn)
    universityRegNo = Empty(universityRegNo)
    department = Empty(department)
    course = Empty(course)
    semester = Empty(semester)
    digiLockerId = Empty(digiLockerId)
    abcId = Empty(abcId)
    universityName = Empty(universityName)
    aadharNo = Empty(aadharNo)
    highestQualification = Empty(highestQualification)

    return {
      DocId: doc.id,
      name,
      email,
      mobile,
      gender,
      dob,
      address,
      country,
      state,
      pincode,
      photo,
      linkedIn,
      nonCusatStudent,
      cusatFlag,
      universityRegNo,
      department,
      course,
      semester,
      digiLockerId,
      abcId,
      universityName,
      aadharNo,
      highestQualification,
    }
  }

  const Empty = (data) => {
    return data ? data : "Not Available"
  }

  const fetchSingleDoc = async (docId) => {
    if (users.find((e) => e.DocId === docId)) {
      // do nothing
    } else {
      const docRef = doc(db, "users", docId)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        // console.log(formatUser(docSnap))

        if (users.find((e) => e.DocId === docSnap.id)) {
          // do nothing
        } else {
          setUsers((prev) => [...prev, formatUser(docSnap)])
        }
      } else {
        // doc.data() will be undefined in this case
        // console.log("No such document!")
      }
    }
  }

  // combine objects course && users  the fetchData
  function combineObj() {
    //https://stackoverflow.com/questions/46849286/merge-two-array-of-objects-based-on-a-key

    const arr1 = course
    const arr2 = users

    let merged = []

    for (let i = 0; i < arr1.length; i++) {
      merged.push({
        ...arr1[i],
        ...arr2.find((itmInner) => itmInner.DocId === arr1[i].userId),
      })
    }

    merged.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0))

    // setCombine(merged)
    setAfterGraded(JSON.parse(JSON.stringify(merged)))
  }

  // https://stackoverflow.com/questions/15125920/how-to-get-distinct-values-from-an-array-of-objects-in-javascript#:~:text=return%20object%20with%20all%20properties%20unique%20by%20key

  function arrayUniqueByKey(array, key) {
    const arrayUnique = [
      ...new Map(array.map((item) => [item[key], item])).values(),
    ]

    return new Promise((resolve) => {
      resolve(arrayUnique)
    })
  }

  // export to excel

  //console.log(exportexcel)
  const handleOnExport = async () => {
    let excel = JSON.parse(JSON.stringify(afterGraded))

    const courseInfo = [
      ["Course Name", courseDetails.CourseName],
      ["Course Code", courseDetails.CourseCode],
      ["Department", courseDetails.CourseDepartment],
      ["No of Cusat student", courseDetails.noOfStdCusat],
      ["No of non Cusat student", courseDetails.noOfStdNonCusat],
    ]

    facultyData.forEach((item, index) => {
      courseInfo.push([
        "faculty " + (index + 1),
        "Name:" + item.name + "   Email:" + item.email,
      ])
    })

    await excel.map((item) => {
      delete item.DocId
      delete item.photo
      delete item.userId

      item.Mobile_Number = item.mobile
      delete item.mobile

      item.Gender = item.gender
      delete item.gender

      item.Address = item.address
      delete item.address

      item.State = item.state
      delete item.state

      item.Country = item.country
      delete item.country

      item.linkedIn_Profile = item.linkedIn
      delete item.linkedIn

      item.Aadhar_Number = item.aadharNo
      delete item.aadharNo

      item.Highest_qualification = item.highestQualification
      delete item.highestQualification

      item.University_name = item.universityName
      delete item.universityName

      item.University_register_number = item.universityRegNo
      delete item.universityRegNo

      item.Department = item.department
      delete item.department

      item.Course = item.course
      delete item.course

      item.Semester = item.semester
      delete item.semester

      item.DigiLocker_ID = item.digiLockerId
      delete item.digiLockerId

      item.ABC_ID = item.abcId
      delete item.abcId

      item.Date_of_birth = new Date(item?.dob?.seconds * 1000)
        .toJSON()
        .slice(0, 10)
        .split("-")
        .reverse()
        .join("/")
      delete item.dob

      item.cusatFlag ? (item.cusatFlag = "Yes") : (item.cusatFlag = "No")
      item.nonCusatStudent
        ? (item.nonCusatStudent = "Yes")
        : (item.nonCusatStudent = "No")

      item.Non_cusat_student = item.nonCusatStudent
      delete item.nonCusatStudent
      item.Cusat_student = item.cusatFlag
      delete item.cusatFlag
      item.Name = item.name
      delete item.name
      item.Email = item.email
      delete item.email

      item.Grade = item.grade === ("N" || "n") ? "Not Graded" : item.grade
      delete item.grade

      return item
    })

    // console.log(excel)

    var wb = XLSX.utils.book_new()
    var ws = XLSX.utils.json_to_sheet(excel, {
      header: [
        "Cusat_student",
        "Non_cusat_student",
        "University_register_number",
        "Name",
        "Email",
        "Mobile_Number",
        "Grade",
        "Department",
        "Semester",
        "DigiLocker_ID",
        "ABC_ID",
        "Date_of_birth",
        "Address",
        "State",
        "Country",
        "Aadhar_Number",
        "Highest_qualification",
      ], // ordered cols
    })
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1")

    const secondWorksheet = XLSX.utils.aoa_to_sheet([
      ["Field Name", "Value"],
      ...courseInfo,
    ])

    // Add the second worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, secondWorksheet, "Course Details")

    XLSX.writeFile(
      wb,
      `${batch}-${courseDetails.CourseName}-${courseDetails.CourseCode}.xlsx`
    )
  }

  // pdf file export
  const handleOnPrint = async () => {
    let pdf = JSON.parse(JSON.stringify(afterGraded))

    await pdf.map((item) => {
      delete item.DocId
      item.cusatFlag ? (item.cusatFlag = "Yes") : (item.cusatFlag = "No")
      item.nonCusatStudent
        ? (item.nonCusatStudent = "Yes")
        : (item.nonCusatStudent = "No")

      item.Grade = item.grade === ("N" || "n") ? "Not Graded" : item.grade
      delete item.grade

      return item
    })
    let info = []
    pdf.forEach((e) => {
      info.push([
        e.cusatFlag,
        e.nonCusatStudent,
        e.universityRegNo,
        e.name,
        e.email,
        e.mobile,
        e.Grade,
      ])
    })
    // console.log(info)

    const head = [
      [
        "Cusat student",
        "Non cusat student",
        "University register no",
        "Name",
        "Email",
        "Mobile",
        "Grade",
      ],
    ]

    const doc = new jsPDF("landscape")

    // // jsPDF 1.4+ uses getWidth, <1.4 uses .width
    // var pageSize = doc.internal.pageSize
    // var pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth()
    // var text = doc.splitTextToSize("sdfawf, lfnaiuwf nucdaiouwdfnaouwfnaio DNOudqn", pageWidth - 35, {})
    // doc.text(text, 14, 30)

    doc.setFontSize(24)
    doc.text(`Report`, 90, 10)
    doc.setFontSize(18)
    doc.text(`Course name : ${courseDetails.CourseName}`, 14, 22)
    doc.setTextColor(100)
    doc.setFontSize(14)
    doc.text(`batch : ${batch}`, 14, 30)
    doc.text(`Course name : ${courseDetails.CourseCode}`, 14, 37)

    autoTable(doc, {
      head: head,
      body: [...info],
      startY: 50,
      theme: "grid",
      // showHead: 'firstPage',
    })
    //  doc.text(text, 14, doc.lastAutoTable.finalY - 10)

    doc.save(
      `${batch} - ${courseDetails.CourseName} - ${courseDetails.CourseCode}`
    )
  }

  const gradeText = (char) => {
    char = char.toUpperCase()
    switch (char) {
      case "N":
        return {
          className:
            "text-xs font-semibold inline-block py-auto px-2 uppercase rounded text-stone-600 bg-stone-200 uppercase last:mr-0 mr-1",
          text: "Not Graded",
        }

      case "F":
        return {
          className:
            "text-xs font-semibold inline-block py-auto px-2 uppercase rounded text-red-600 bg-red-200 uppercase last:mr-0 mr-1",
          text: "Failed",
        }

      default:
        return {
          className:
            "text-xs font-semibold inline-block py-auto px-2 uppercase rounded text-green-600 bg-green-200 uppercase last:mr-0 mr-1",
          text: char,
        }
      // code block
    }
  }

  return (
    <RootLayout>
      {loading ? (
        <Spinner />
      ) : course && course.length > 0 ? (
        <div className="p-5 mt-10  ">
          {courseDetails && (
            <div className="w-full">
              <h1 className="text-3xl  text-center font-semibold mb-6">
                {courseDetails.CourseName}
              </h1>

              <p className="text-xl child:font-serif  text-left font-semibold mb-6">
                <ul className="mt-2">
                  <li>Course Code: {courseDetails.CourseCode}</li>
                  <li className="mt-2">
                    Total Students : {courseDetails.NoOfStd}
                  </li>
                  <li className="mt-2">
                    Cusat Students : {courseDetails.noOfStdCusat}
                  </li>
                  <li className="mt-2">
                    Non Cusat Students : {courseDetails.noOfStdNonCusat}
                  </li>
                </ul>
              </p>
            </div>
          )}

          <div className="overflow-auto rounded-lg shadow hidden md:block">
            <table className="w-full ">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr className="">
                  <th className="w-20 p-3 text-sm font-semibold tracking-wide text-left">
                    No.
                  </th>
                  <th className=" w-24 px-3 text-sm font-semibold tracking-wide text-left">
                    Cusat/
                    <br />
                    Non Cusat
                  </th>
                  <th className=" w-24 px-3 text-sm font-semibold tracking-wide text-left">
                    University Register No
                  </th>
                  <th className="p-3 text-sm font-semibold tracking-wide text-left">
                    Name
                  </th>
                  <th className="p-3 text-sm font-semibold tracking-wide text-left">
                    Email
                  </th>
                  <th className="p-3 text-sm font-semibold tracking-wide text-left">
                    Phone
                  </th>
                  <th className="w-44 p-3 text-sm font-semibold tracking-wide text-left">
                    Grade
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {afterGraded &&
                  afterGraded.map((item, index) => (
                    <tr key={index} className="even:bg-white odd:bg-gray-100">
                      <td className="p-3 text-sm whitespace-nowrap text-blue-500">
                        {++index}
                      </td>
                      <td className="p-3  w-24 text-sm text-gray-700 whitespace-nowrap">
                        {item.cusatFlag ? (
                          <span className="p-1.5 text-xs font-medium uppercase tracking-wider text-green-800 bg-green-200 rounded-lg bg-opacity-50">
                            Cusat
                          </span>
                        ) : (
                          <span className="p-1.5 text-xs font-medium uppercase tracking-wider text-blue-800 bg-blue-200 rounded-lg bg-opacity-50">
                            NON Cusat
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                        {item.universityRegNo}
                      </td>
                      <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                        {item.name ? item.name : "Not Available"}
                      </td>
                      <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                        {item.email}
                      </td>
                      <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                        {item.mobile}
                      </td>
                      <td
                        className={`p-3 text-sm text-gray-700 whitespace-nowrap flex justify-center items-center ${
                          gradeText(item.grade).className
                        }`}
                      >
                        {gradeText(item.grade).text}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end mt-8 p-4">
            <button
              onClick={handleOnPrint}
              className="bg-transparent mr-3 hover:bg-red-500 text-red-700 font-semibold hover:text-white py-2 px-4 border border-red-500 hover:border-transparent rounded-full"
            >
              Export to PDF
            </button>

            <button
              onClick={handleOnExport}
              className="bg-transparent hover:bg-green-500 text-green-700 font-semibold hover:text-white py-2 px-4 border border-green-500 hover:border-transparent rounded-full"
            >
              Export to Excel
            </button>
          </div>
        </div>
      ) : (
        <div>
          {courseDetails && (
            <div className="w-full ">
              <h1 className="text-3xl  text-center font-semibold mb-6 mt-16">
                {courseDetails.CourseName}
              </h1>

              <p className="text-xl  child:font-serif  text-left font-semibold mb-6">
                <ul className="ml-4 mt-2">
                  <li>Course Code: {courseDetails.CourseCode}</li>
                </ul>
              </p>
            </div>
          )}
          <h1 className="text-5xl font-serif font-semibold mb-6 flex justify-center items-center h-screen w-full  -mt-20">
            Records empty
          </h1>
        </div>
      )}
    </RootLayout>
  )
}

export default ReportCusaTech
