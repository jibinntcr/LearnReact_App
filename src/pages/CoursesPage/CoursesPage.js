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
  where,
  getCountFromServer,
} from "firebase/firestore"

//components
import Spinner from "../../components/Spinner/Spinner"
import Footer from "../../components/Footer/Footer"
import Card5 from "../../components/Card5/CourseCard"
import LoadMoreButton from "../../components/Button/LoadMoreButton"

// toastify
import { toast } from "react-toastify"

//context
import { useUserAuth } from "../../context/UserAuthContext"

import PageLimit from "../../const/PaginationData"

function CoursesPage(
  { setCdecCourseData, setCdecLoading, setCdecHasMore },
  ref
) {
  const { user, enrolledCourses, userDetails } = useUserAuth()

  // State
  const [loading, setLoading] = useState(true)

  const [courseData, setCourseData] = useState([])

  const [batch, setBatch] = useState([])

  const [lastVisible, setLastVisible] = useState("")
  // const [lastVisibleFlag, setLastVisibleFlag] = useState(false)

  const [hasMore, setHasMore] = useState(true)
  const [count, setCount] = useState(0)
  const [remainingPage, setRemainingPage] = useState(
    PageLimit.CdecCoursePageLimit
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
    const colRef = collection(db, `/AcademicYear/${batch[index]}/cdec`)

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
    const colRef = collection(db, `/AcademicYear/${batch[index]}/cdec`)
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
      setRemainingPage(PageLimit.CdecCoursePageLimit)
      lastVisibleFlag = true

      if (lastVisible !== "") {
        // Construct a query with orderBy, startAfter, and limit
        q = query(
          colRef,
          orderBy("scheduleAt", "desc"),
          startAfter(lastVisible),
          limit(PageLimit.CdecCoursePageLimit)
        )
      } else {
        // Construct a query with orderBy and limit
        q = query(
          colRef,
          orderBy("scheduleAt", "desc"),
          limit(PageLimit.CdecCoursePageLimit)
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
    setCdecCourseData(courseData)
  }, [courseData])

  useEffect(() => {
    setCdecLoading(loading)
  }, [loading])
  useEffect(() => {
    setCdecHasMore(hasMore)
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
      thumbnailImage,
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
      thumbnailImage,
      InstitutionalStudentPricing,
      CusatStudentsCourseFees,
      CurriculumCourse,
      urlLink: `/courses/${batch[index]}/${doc.id}`,
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

  const fetchMore = () => {
    if (!hasMore) return
    fetchDocs(count)
  }

  return (
    <></>
    // <div>
    //   <>
    //     {/* Course section 2 */}

    //     {loading ? (
    //       <Spinner />
    //     ) : courseData && courseData.length > 0 ? (
    //       <section className="pt-20  lg:pt-[120px] overflow-hidden pb-10 lg:pb-20 flex flex-wrap justify-center">
    //         <div className="container">
    //           <div className="flex flex-wrap justify-center -mx-4">
    //             <div className="w-full px-4">
    //               <div className="text-center mx-auto mb-[60px] lg:mb-20 max-w-[510px]">
    //                 <span className="font-semibold text-2xl text-green-500 mb-2 block">
    //                   Courses
    //                 </span>
    //                 <h2 className=" font-bold text-3xl sm:text-4xl md:text-[40px] text-dark mb-4 ">
    //                   Courses we offer
    //                 </h2>

    //                 <p className="text-base text-body-color">
    //                   There are many variations of passages of Lorem Ipsum
    //                   available but the majority have suffered alteration in
    //                   some form.
    //                 </p>
    //               </div>
    //             </div>
    //           </div>

    //           <div className="flex flex-wrap mx-4 justify-center">
    //             {courseData.map((item) => (
    //               <Card5
    //                 className="p-2  mb-3"
    //                 urlLink={item.urlLink}
    //                 key={item.DocId}
    //                 CourseNameInSingleLine={false}
    //                 NoOfStd={item.NoOfStd}
    //                 CourseCode={item.CourseCode}
    //                 CourseImage={
    //                   item.thumbnailImage
    //                     ? item.thumbnailImage
    //                     : item.CourseImage
    //                 }
    //                 CourseName={item.CourseName}
    //                 CourseBatch={item.batch}
    //                 CourseDepartment={item.CourseDepartment}
    //                 CourseDescription={item.CourseDescription}
    //                 CourseFees={fund(
    //                   item.CourseFees,
    //                   item.DocId,
    //                   item.CourseStatus,
    //                   item?.CurriculumCourse,
    //                   item?.CusatStudentsCourseFees,
    //                   item?.InstitutionalStudentPricing
    //                 )}
    //                 DocId={item.DocId}
    //                 CourseFaculty={item.CourseFaculty}
    //                 CourseDuration={item.CourseDuration}
    //               />
    //             ))}
    //           </div>
    //           <LoadMoreButton onClick={fetchMore} disabled={!hasMore} />
    //         </div>
    //       </section>
    //     ) : (
    //       <section className="pt-20  lg:pt-[120px] overflow-hidden pb-10 lg:pb-20 flex flex-wrap justify-center">
    //         <div className="container">
    //           <div className="w-full px-4">
    //             <div className="text-center mx-auto mb-[60px] lg:mb-20 max-w-[510px]">
    //               <span className="font-semibold text-3xl text-green-500 mb-2 block">
    //                 Courses
    //               </span>
    //             </div>
    //           </div>
    //           <div className="flex justify-center h-96  items-center text-2xl font-semibold">
    //             {"No Courses were found"}
    //           </div>
    //         </div>
    //       </section>
    //     )}
    //   </>

    //   <Footer />
    // </div>
  )
}

export default forwardRef(CoursesPage)
