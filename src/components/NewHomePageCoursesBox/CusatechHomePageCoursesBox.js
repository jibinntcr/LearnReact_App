import React, { useEffect, useState } from "react"

//css
import "./CoursesPageStyles.css"

//firebase firestore
import { db } from "../../firebase.config"
import {
  getDocs,
  collection,
  doc,
  getDoc,
  query,
  orderBy,
  limit,
  startAfter,
  where,
  getCountFromServer,
} from "firebase/firestore"

// toastify
import { toast } from "react-toastify"

import PageLimit from "../../const/PaginationData"

function CusatechHomePageCoursesBox({
  setCusatechCourseData,
  setCusatechLoading,
}) {
  // State
  const [loading, setLoading] = useState(true)

  const [courseData, setCourseData] = useState([])

  const [batch, setBatch] = useState([])

  const [lastVisible, setLastVisible] = useState("")
  // const [lastVisibleFlag, setLastVisibleFlag] = useState(false)

  const [remainingPage, setRemainingPage] = useState(4)
  const [index, setIndex] = useState(-1)

  // ----------------------------------------------------------------------
  // passing data to parent component
  useEffect(() => {
    setCusatechCourseData(courseData)
  }, [courseData])
  useEffect(() => {
    setCusatechLoading(loading)
  }, [loading])

  //-----------------------------------------------------------------------

  // array index of collection

  const fetchCollectionArray = async () => {
    await new Promise(async (resolve, reject) => {
      try {
        // Fetch data from the "current" document under the "doc" collection
        const docRef = doc(db, "current", "doc")
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
          // Retrieve batch data and initialize index for fetching

          setBatch(docSnap.data().batch) // eslint-disable-line
          setIndex(0) // start the fetchDocs
        } else {
          // console.log("No such document!")
        }
        resolve()
        // Scroll the document body into view
        document.body.scrollIntoView()
      } catch (error) {
        toast.error("Could not fetch data")
      }
    })
  }

  const fetchCollectionSize = async () => {
    // Construct a reference to the collection within the current batch
    const colRef = collection(db, `/AcademicYear/${batch[index]}/cusaTech`)

    const q = query(colRef, where("HomePageDisplayStatus", "==", true))

    // Fetch the count of documents in the collection
    const snapshot = await getCountFromServer(q)

    // If there are documents, fetch the actual docs
    if (snapshot.data().count) {
      fetchDocs(snapshot.data().count)
    } else {
      // Increment index for the next batch
      setIndex(index + 1)
    }
  }

  const fetchDocs = async (countPara) => {
    let lastVisibleFlag = false

    // Construct a reference to the collection within the current batch
    const colRef = collection(db, `/AcademicYear/${batch[index]}/cusaTech`)
    let q = ""

    // console.log(`/AcademicYear/${batch[index]}/cdec`)
    // console.log(countPara)
    // console.log(remainingPage)

    if (countPara < remainingPage) {
      // Decrease the remainingPage count based on fetched count
      setRemainingPage(remainingPage - countPara)

      if (lastVisible !== "") {
        // Construct a query with orderBy and startAfter using lastVisible cursor
        q = query(
          colRef,
          where("HomePageDisplayStatus", "==", true),
          orderBy("scheduleAt", "desc"),
          startAfter(lastVisible)
        )
      } else {
        // Construct a query with only orderBy, no startAfter
        q = query(
          colRef,
          where("HomePageDisplayStatus", "==", true),
          orderBy("scheduleAt", "desc")
        )
      }

      // Reset count and lastVisible
      // setCount(0)
      setLastVisible("")
      // Increment index for the next batch
      setIndex(index + 1)
    } else {
      // If remainingPage is greater than or equal to countPara
      // Decrease the remainingPage count based on fetched count
      // setCount(countPara - remainingPage)
      // console.log("debugger")
      setRemainingPage(PageLimit.CusaTechHomeCoursePageLimit)
      lastVisibleFlag = true

      if (lastVisible !== "") {
        // Construct a query with orderBy, startAfter, and limit
        q = query(
          colRef,
          where("HomePageDisplayStatus", "==", true),

          orderBy("scheduleAt", "desc"),
          startAfter(lastVisible),
          limit(PageLimit.CusaTechHomeCoursePageLimit)
        )
      } else {
        // Construct a query with orderBy and limit
        q = query(
          colRef,
          where("HomePageDisplayStatus", "==", true),

          orderBy("scheduleAt", "desc"),
          limit(PageLimit.CusaTechHomeCoursePageLimit)
        )
      }
    }

    // console.log(remainingPage)

    // Fetch documents using the constructed query
    const documentSnapshots = await getDocs(q)

    // Update state with fetched documents
    updateState(documentSnapshots)

    // Log data of each fetched document
    documentSnapshots.forEach((doc) => {
      // console.log(doc.data())
    })

    if (lastVisibleFlag) {
      // Update lastVisible cursor for the next batch
      setLastVisible(documentSnapshots.docs[documentSnapshots.docs.length - 1])
      lastVisibleFlag = false
    }
  }

  // useEffect hook for managing component lifecycle
  useEffect(() => {
    // Check if the index is within the valid range of batch
    if (index >= 0 && index <= batch.length) fetchCollectionSize()

    // console.log("count" + count)

    // If index exceeds batch length, set hasMore to false
    if (index >= batch.length) {
      setLoading(false)
    }
  }, [index])

  useEffect(() => {
    fetchCollectionArray()
  }, [])

  // ----------------------------------------------------------------------

  // for formatting the fetchData
  function formatCourse(doc) {
    const {
      CourseStatus,
      CourseCode,
      CourseStatusText,
      NoOfStd,
      CourseImage,
      CourseName,
      CourseDepartment,
      CourseDescription,
      CourseFees,
      CourseFaculty,
      CourseDuration,
      createdAt,
      AcademicYear,
      Semester,
      scheduledCourseId,
      noOfStdLimit,
      CurriculumCourse,
      CusatStudentsCourseFees,
      InstitutionalStudentPricing,
    } = doc.data()

    return {
      batch: batch[index],
      DocId: doc.id,
      CourseStatus,
      CourseStatusText,
      CourseCode,
      NoOfStd,
      CourseImage,
      CourseName,
      CourseDepartment,
      CourseDescription,
      CourseFees,
      CourseFaculty,
      CourseDuration,
      createdAt,
      AcademicYear,
      Semester,
      scheduledCourseId,
      noOfStdLimit,
      CurriculumCourse,
      CusatStudentsCourseFees,
      InstitutionalStudentPricing,
      urlLink: `cusatech/courses/${batch[index]}/${doc.id}`,
    }
  }

  const updateState = (collection, transform = formatCourse) => {
    const isCollectionEmpty = collection.size === 0

    if (!isCollectionEmpty) {
      const dataDoc = collection.docs.map(transform)
      setCourseData((prevData) => {
        const existingIds = prevData.map((item) => item.DocId)
        const filteredNewData = dataDoc.filter(
          (item) => !existingIds.includes(item.DocId)
        )
        return [...prevData, ...filteredNewData]
      })

      setLoading(false)
    } else {
      // console.log("No Document To Fetch!")
    }
  }

  return <></>
}

export default CusatechHomePageCoursesBox
