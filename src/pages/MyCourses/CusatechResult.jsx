import React, { useEffect, useState } from "react"

//firebase firestore
import { db } from "../../firebase.config"
import {
  getDocs,
  collection,
  doc,
  getDoc,
  query,
  orderBy,
} from "firebase/firestore"

//components
import Spinner from "../../components/Spinner/Spinner"
import Footer from "../../components/Footer/Footer"

// toastify
import { toast } from "react-toastify"

//context
import { useUserAuth } from "../../context/UserAuthContext"
import { Link } from "react-router-dom"

function CusatechResult({ setCusatech }) {
  const { user } = useUserAuth()

  // State
  const [loading, setLoading] = useState(true)

  const [courseDetails, setCourseDetails] = useState([])
  const [cdecList, setCdecList] = useState([])
  const [cdecListWithGrade, setCdecListWithGrade] = useState([])
  const [grade, setGrade] = useState([])
  const [mergedDetails, setMergedDetails] = useState([])
  const [text, setText] = useState("Loading...")

  useEffect(() => {
    setCusatech(mergedDetails)
  }, [mergedDetails])

  const getData = async () => {
    window.scroll(0, 0) // scroll to top

    try {
      const colRef = collection(
        db,
        `/users/${user.uid}/enrolledCourses/cusaTech/cusaTechCourses/`
      )
      const q = query(colRef, orderBy("createdAt", "desc"))
      const querySnapshot = await getDocs(q)

      const results = querySnapshot.docs.map(formatUserCourse)
      // console.log("results")
      setCdecList(results)
    } catch (error) {
      toast.error("Could not fetch data")
      toast.error(error)
    }
  }

  const fetchSingleDoc = async (batch, scheduleCourseDocid) => {
    if (
      grade.find((item) => item.scheduleCourseDocid === scheduleCourseDocid)
    ) {
      // do nothing
    } else {
      const docRef = doc(
        db,
        `AcademicYear/${batch}/cusaTech/${scheduleCourseDocid}/students`,
        user.uid
      )
      const docCourseRef = doc(
        db,
        `AcademicYear/${batch}/cusaTech`,
        scheduleCourseDocid
      )
      const docSnap = await getDoc(docRef)
      const docCourseSnap = await getDoc(docCourseRef)
      // console.log(`AcademicYear/${batch}/cusaTech/${scheduleCourseDocid}`)

      if (docSnap.exists() && docCourseSnap.exists()) {
        // console.log(docCourseSnap.data())

        if (courseDetails.find((e) => e.DocId === docCourseSnap.id)) {
          // do nothing
        } else {
          setCourseDetails((prev) => [...prev, formatCourse(docCourseSnap)])
        }

        if (
          grade.find(
            (e) => e.scheduleCourseDocid === docSnap.data().scheduleCourseDocid
          )
        ) {
          // do nothing
        } else {
          setGrade((prev) => [...prev, formatGrade(docSnap)])
        }
      } else {
        // doc.data() will be undefined in this case
        // console.log("No such document!")
      }
    }
  }

  function arrayUniqueByKey(array, key) {
    const arrayUnique = [
      ...new Map(array.map((item) => [item[key], item])).values(),
    ]

    return new Promise((resolve) => {
      resolve(arrayUnique)
    })
  }

  function combineObj(
    array1,
    array1Key,
    array2,
    array2Key,
    outState,
    sortField
  ) {
    //https://stackoverflow.com/questions/46849286/merge-two-array-of-objects-based-on-a-key

    const arr1 = array1
    const arr2 = array2

    let merged = []

    for (let i = 0; i < arr1.length; i++) {
      merged.push({
        ...arr1[i],
        ...arr2.find(
          (itmInner) =>
            itmInner.scheduleCourseDocid === arr1[i].scheduleCourseDocid
        ),
      })
    }

    // merged.sort((a, b) => (a.sortField > b.sortField) ? 1 : ((b.sortField > a.sortField) ? -1 : 0))

    outState(merged)
    //setAfterGraded(JSON.parse(JSON.stringify(merged)))
  }

  setTimeout(() => {
    setText("Please enroll courses")
  }, 5000)

  useEffect(() => {
    setLoading(true)
    combineObj(
      grade,
      "scheduleCourseDocid",
      cdecList,
      "scheduleCourseDocid",
      setCdecListWithGrade,
      "batch"
    )
    // console.log("grade")
    // console.log(grade)
    // console.log("cdecList")
    // console.log(cdecList)
    // console.log("cdecListWithGrade")
    // console.log(cdecListWithGrade)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grade, cdecList])

  useEffect(() => {
    setLoading(true)
    combineObj(
      cdecListWithGrade,
      "scheduleCourseDocid",
      courseDetails,
      "scheduleCourseDocid",
      setMergedDetails,
      "batch"
    )
    // console.log("cdecListWithGrade")
    // console.log(cdecListWithGrade)
    // console.log("courseDetails")
    // console.log(courseDetails)
    // console.log("mergedDetails")
    // console.table(mergedDetails)

    setLoading(false)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cdecListWithGrade, courseDetails])

  useEffect(() => {
    setLoading(true)
    getData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const fetchUsers = async () => {
      //  getGrade()
      var arrayList = cdecList.map((item) => ({
        batch: item?.batch,
        scheduleCourseDocid: item?.scheduleCourseDocid,
      }))

      // console.log(arrayList)
      // console.log("arrayList")

      arrayList.map((item) =>
        fetchSingleDoc(item?.batch, item?.scheduleCourseDocid)
      )

      const roots = await arrayUniqueByKey(grade, "scheduleCourseDocid")

      // console.log(roots)
      // console.log("roots")

      // combineObj()
    }

    fetchUsers()
    // console.log("users")

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cdecList])

  function formatCourse(doc) {
    const {
      CourseName,
      CourseStatus,
      CourseCode,
      CourseDepartment,
      totalMark,
    } = doc.data()

    return {
      CourseName,
      CourseStatus,
      scheduleCourseDocid: doc.id,
      CourseCode,
      CourseDepartment,
      totalMark,
      courseBy: "cusatech",
    }
  }
  function formatGrade(doc) {
    const {
      scheduleCourseDocid,
      grade,
      gradepoint,
      gradestatus,
      mark,
      remark,
      credit,
      enrolledAt,
    } = doc.data()

    return {
      scheduleCourseDocid,
      grade,
      gradepoint,
      gradestatus,
      mark,
      remark,
      credit,
      enrolledAt,
    }
  }

  function formatUserCourse(doc) {
    const { batch, courseBy, createdAt, scheduleCourseDocid } = doc.data()

    return { DocId: doc.id, batch, courseBy, createdAt, scheduleCourseDocid }
  }

  const status = (cs) => {
    cs = parseInt(cs)

    switch (cs) {
      case 1:
        return "Enroll"
      case 2:
        return "Upcoming"
      case 3:
        return "Enrollment closed"
      case 4:
        return "Canceled"
      case 5:
        return "Completed"
      default:
        return "Enroll"
    }
  }

  return (
    <></>
    // <div>
    //   <>
    //     {" "}
    //     {loading ? (
    //       <Spinner />
    //     ) : mergedDetails && mergedDetails.length > 0 ? (
    //       <>
    //         <div
    //           className="bg-gray-100 overflow-x-auto mx-auto"
    //           style={{
    //             display: "flex",
    //             alignItems: "center",

    //             flexDirection: "row",
    //           }}
    //         >
    //           <div className="p-5  ">
    //             <div className="overflow-x-auto  rounded-lg shadow hidden md:block">
    //               <table className="w-full justify-start">
    //                 <thead className="bg-gray-50 border-b-2 border-gray-200">
    //                   <tr className="">
    //                     <th className="w-20 p-3 text-sm font-semibold tracking-wide text-left">
    //                       No.
    //                     </th>
    //                     <th className="p-3 text-sm font-semibold tracking-wide text-left">
    //                       Batch
    //                     </th>
    //                     <th className="w-24 p-3 text-sm font-semibold tracking-wide text-left">
    //                       Course Department
    //                     </th>
    //                     <th className="w-24 p-3 text-sm font-semibold tracking-wide text-left">
    //                       Course Name
    //                     </th>
    //                     <th className="w-32 p-3 text-sm font-semibold tracking-wide text-left">
    //                       Course Code
    //                     </th>
    //                     <th className="w-32 p-3 text-sm font-semibold tracking-wide text-left">
    //                       Course Status
    //                     </th>
    //                     <th className="w-32 p-3 text-sm font-semibold tracking-wide text-left">
    //                       Course Grade
    //                     </th>
    //                     <th className="w-32 p-3 text-sm font-semibold tracking-wide text-left">
    //                       Grade Point
    //                     </th>
    //                     <th className="w-32 p-3 text-sm font-semibold tracking-wide text-left">
    //                       Grade Status
    //                     </th>
    //                     <th className="w-32 p-3 text-sm font-semibold tracking-wide text-left">
    //                       Mark
    //                     </th>
    //                     <th className="w-32 p-3 text-sm font-semibold tracking-wide text-left">
    //                       Credit
    //                     </th>
    //                     <th className="w-64 p-3 text-sm font-semibold tracking-wide text-left">
    //                       Remark
    //                     </th>
    //                   </tr>
    //                 </thead>
    //                 <tbody className="divide-y divide-gray-100">
    //                   {mergedDetails.map((item, index) => (
    //                     <tr
    //                       key={index}
    //                       className="even:bg-white odd:bg-gray-100"
    //                     >
    //                       <td className="p-3 text-sm whitespace-nowrap text-blue-500">
    //                         {++index}
    //                       </td>
    //                       <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
    //                         {item.batch?.slice(5)}
    //                       </td>

    //                       <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
    //                         {item.CourseDepartment}
    //                       </td>
    //                       <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
    //                         {item.CourseName}
    //                       </td>
    //                       <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
    //                         {item.CourseCode}
    //                       </td>
    //                       <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
    //                         {item?.CourseStatus
    //                           ? status(item.CourseStatus)
    //                           : "Not Available"}
    //                       </td>
    //                       <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
    //                         {item?.grade}
    //                       </td>
    //                       <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
    //                         {Boolean(item?.gradepoint)
    //                           ? item.gradepoint
    //                           : "Not Available"}
    //                       </td>
    //                       <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
    //                         {item?.gradestatus
    //                           ? item.gradestatus
    //                           : "Not Available"}
    //                       </td>
    //                       <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
    //                         {Boolean(item?.mark)
    //                           ? item.mark +
    //                             (item?.totalMark && "/" + item.totalMark)
    //                           : "Not Available"}
    //                       </td>
    //                       <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
    //                         {Boolean(item?.credit)
    //                           ? item.credit
    //                           : "Not Available"}
    //                       </td>
    //                       <td className="p-3 text-sm text-gray-700n whitespace-nowrap">
    //                         <textarea
    //                           cols="300"
    //                           rows="5"
    //                           value={
    //                             Boolean(item?.remark)
    //                               ? item.remark
    //                               : "Not Available"
    //                           }
    //                         ></textarea>
    //                       </td>
    //                     </tr>
    //                   ))}
    //                 </tbody>
    //               </table>
    //             </div>
    //             <div className="flex flex-col items-center justify-center">
    //               {mergedDetails.map((item, index) => (
    //                 <div className="grid  grid-cols-1 sm:grid-cols-2 my-2 gap-4 md:hidden">
    //                   <div className="bg-white space-y-3 p-4 rounded-lg shadow">
    //                     <div className="flex flex-col items-start space-x-2 text-sm">
    //                       <div className="text-sm text-gray-700">
    //                         &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;
    //                         &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
    //                         &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
    //                         &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
    //                         &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
    //                       </div>
    //                       <div>
    //                         <p className="text-blue-500 font-bold hover:underline mb-1">
    //                           #{++index}
    //                         </p>
    //                       </div>
    //                       <div className="text-sm text-gray-700">
    //                         <span className="font-semibold">Batch : </span>{" "}
    //                         {item.batch?.slice(5)}
    //                       </div>
    //                       <div className="text-sm text-gray-700">
    //                         <span className="font-semibold">
    //                           {" "}
    //                           Course Department :{" "}
    //                         </span>{" "}
    //                         {item.CourseDepartment}
    //                       </div>
    //                       <div className="text-sm text-gray-700">
    //                         <span className="font-semibold">
    //                           {" "}
    //                           Course Name :{" "}
    //                         </span>{" "}
    //                         {item.CourseName}
    //                       </div>

    //                       <div className="text-sm text-gray-700">
    //                         <span className="font-semibold">
    //                           {" "}
    //                           Course Code :{" "}
    //                         </span>{" "}
    //                         {item.CourseCode}
    //                       </div>
    //                       <div className="text-sm text-gray-700">
    //                         <span className="font-semibold">
    //                           {" "}
    //                           Course Status :{" "}
    //                         </span>{" "}
    //                         {item?.CourseStatus
    //                           ? status(item.CourseStatus)
    //                           : "Not Available"}
    //                       </div>
    //                       <div className="text-sm text-gray-700 ">
    //                         <span className="font-semibold"> Grade : </span>{" "}
    //                         &nbsp; &nbsp;
    //                         {item?.grade}
    //                       </div>
    //                       <div className="text-sm text-gray-700 ">
    //                         <span className="font-semibold">
    //                           {" "}
    //                           Grade Point :{" "}
    //                         </span>{" "}
    //                         &nbsp; &nbsp;
    //                         {Boolean(item?.gradepoint)
    //                           ? item.gradepoint
    //                           : "Not Available"}
    //                       </div>
    //                       <div className="text-sm text-gray-700 ">
    //                         <span className="font-semibold">
    //                           {" "}
    //                           Grade Status :{" "}
    //                         </span>{" "}
    //                         &nbsp; &nbsp;
    //                         {Boolean(item?.gradestatus)
    //                           ? item.gradestatus
    //                           : "Not Available"}
    //                       </div>
    //                       <div className="text-sm text-gray-700 ">
    //                         <span className="font-semibold"> Mark : </span>{" "}
    //                         &nbsp; &nbsp;
    //                         {Boolean(item?.mark)
    //                           ? item.mark +
    //                             (item?.totalMark && "/" + item.totalMark)
    //                           : "Not Available"}
    //                       </div>
    //                       <div className="text-sm text-gray-700 ">
    //                         <span className="font-semibold"> Credit : </span>{" "}
    //                         &nbsp; &nbsp;
    //                         {Boolean(item?.credit)
    //                           ? item.credit
    //                           : "Not Available"}
    //                       </div>
    //                       <div className="text-sm text-gray-700 ">
    //                         <span className="font-semibold"> Remark : </span>{" "}
    //                         &nbsp; &nbsp;
    //                         <textarea
    //                           name=""
    //                           id=""
    //                           cols="30"
    //                           rows="8"
    //                           value={
    //                             Boolean(item?.remark)
    //                               ? item.remark
    //                               : "Not Available"
    //                           }
    //                         ></textarea>
    //                       </div>
    //                     </div>
    //                   </div>
    //                 </div>
    //               ))}
    //             </div>
    //           </div>
    //         </div>
    //       </>
    //     ) : (
    //       <div className="my-24 text-4xl font-bold  text-center italic  flex flex-col">
    //         <div className="">{text}</div>
    //       </div>
    //     )}
    //   </>

    //   <Footer />
    // </div>
  )
}

export default CusatechResult
