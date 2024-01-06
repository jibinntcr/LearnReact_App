import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react"

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
  getCountFromServer,
} from "firebase/firestore"

// toastify
import { toast } from "react-toastify"

//context
import { useUserAuth } from "../../context/UserAuthContext"

import PageLimit from "../../const/PaginationData"

function CusaTechCoursesPage(
  { setCusatechCourseData, setCusatechLoading, setCusatechHasMore },
  ref
) {
  const { user, cusaTechEnrolledCourses, userDetails } = useUserAuth()

  // State
  const [loading, setLoading] = useState(true)

  const [courseData, setCourseData] = useState([])

  const [batch, setBatch] = useState("")

  const [lastVisible, setLastVisible] = useState("")

  const [hasMore, setHasMore] = useState(true)
  const [count, setCount] = useState(0)
  const [remainingPage, setRemainingPage] = useState(
    PageLimit.CusaTechCoursePageLimit
  )
  const [index, setIndex] = useState(-1)

  useImperativeHandle(ref, () => ({
    childFunction: () => {
      fetchMore()
    },
  }))

  // ----------------------------------------------------------------------

  // array index of collection

  const fetchCollectionArray = async () => {
    window.scroll(0, 0) // scroll to top

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
        reject()
      }
    })
  }

  const fetchCollectionSize = async () => {
    // Construct a reference to the collection within the current batch
    const colRef = collection(db, `/AcademicYear/${batch[index]}/cusaTech`)

    // Fetch the count of documents in the collection
    const snapshot = await getCountFromServer(colRef)

    // Update the state with the fetched count
    setCount(snapshot.data().count)
    // console.log("count" + snapshot.data().count)

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

    if (countPara < remainingPage) {
      // Decrease the remainingPage count based on fetched count
      setRemainingPage(remainingPage - countPara)

      if (lastVisible !== "") {
        // Construct a query with orderBy and startAfter using lastVisible cursor
        q = query(
          colRef,
          orderBy("scheduleAt", "desc"),
          startAfter(lastVisible)
        )
      } else {
        // Construct a query with only orderBy, no startAfter
        q = query(colRef, orderBy("scheduleAt", "desc"))
      }

      // Reset count and lastVisible
      setCount(0)
      setLastVisible("")
      // Increment index for the next batch
      setIndex(index + 1)
    } else {
      // If remainingPage is greater than or equal to countPara
      // Decrease the remainingPage count based on fetched count
      setCount(countPara - remainingPage)
      // console.log("debugger")
      setRemainingPage(PageLimit.CusaTechCoursePageLimit)
      lastVisibleFlag = true

      if (lastVisible !== "") {
        // Construct a query with orderBy, startAfter, and limit
        q = query(
          colRef,
          orderBy("scheduleAt", "desc"),
          startAfter(lastVisible),
          limit(PageLimit.CusaTechCoursePageLimit)
        )
      } else {
        // Construct a query with orderBy and limit
        q = query(
          colRef,
          orderBy("scheduleAt", "desc"),
          limit(PageLimit.CusaTechCoursePageLimit)
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
      setHasMore(false)
      setLoading(false)
    }
  }, [index])

  useEffect(() => {
    fetchCollectionArray()
  }, [])
  // ----------------------------------------------------------------------
  // passing data to parent component
  useEffect(() => {
    setCusatechCourseData(courseData)
  }, [courseData])
  useEffect(() => {
    setCusatechLoading(loading)
  }, [loading])
  useEffect(() => {
    setCusatechHasMore(hasMore)
  }, [hasMore])
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
      InstitutionalStudentPricing,
      CusatStudentsCourseFees,
      CurriculumCourse,
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
      InstitutionalStudentPricing,
      CusatStudentsCourseFees,
      CurriculumCourse,
      urlLink: `/cusatech/courses/${batch[index]}/${doc.id}`,
    }
  }

  const fund = (
    rs,
    DocId,
    CourseStatus,
    CurriculumCourse,
    CusatStudentsCourseFees,
    InstitutionalStudentPricing
  ) => {
    if (user && cusaTechEnrolledCourses.includes(DocId)) {
      return "Enrolled"
    }
    CourseStatus = parseInt(CourseStatus)

    switch (CourseStatus) {
      case 2:
        return "Upcoming"
      case 3:
        return "Enrollment closed"
      case 4:
        return "Canceled"
      case 5:
        return "Completed"
      default:
        return funds(
          rs,
          CurriculumCourse,
          CusatStudentsCourseFees,
          InstitutionalStudentPricing
        )
    }
  }

  const funds = (
    rs,
    CurriculumCourse,
    CusatStudentsCourseFees,
    InstitutionalStudentPricing
  ) => {
    if (user) {
      if (user.cusatFlag === true) {
        if (CurriculumCourse) {
          return "Enroll"
        } else {
          let rt = CusatStudentsCourseFees?.toString().replace(
            /\B(?=(\d{3})+(?!\d))/g,
            ","
          )
          if (rt === undefined) return "Enroll"
          return (rt = "₹" + rt)
        }
      } else if (
        user.cusatFlag === false &&
        userDetails &&
        userDetails?.RecognizedInstitutionFlag
      ) {
        let rt = InstitutionalStudentPricing?.toString().replace(
          /\B(?=(\d{3})+(?!\d))/g,
          ","
        )
        // if (rt === undefined) return "Enroll"
        return (rt = "₹" + rt)
      } else if (user.cusatFlag === false) {
        let rt = rs?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")

        return (rt = "₹" + rt)
      }
    } else return "Enroll"
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
      setIndex(index + 1)
      // console.log("No Document To Fetch!")
    }
  }

  const fetchMore = () => {
    debugger
    if (!hasMore) return
    fetchDocs(count)
  }

  return <></>
}

export default forwardRef(CusaTechCoursesPage)
