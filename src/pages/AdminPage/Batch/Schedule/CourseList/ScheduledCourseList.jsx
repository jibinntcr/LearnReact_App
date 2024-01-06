import React, { useEffect, useState } from "react"
import { db } from "../../../../../firebase.config"
import {
  getDocs,
  collection,
  query,
  limit,
  orderBy,
  startAfter,
  getCountFromServer,
} from "firebase/firestore"
import Spinner from "../../../../../components/Spinner/Spinner"
import ScheduledCourseCard from "./ScheduledCourseCard"
import RootLayout from "../../../../../components/SideBar/RootLayout"
import LoadMoreButton from "../../../../../components/Button/LoadMoreButton"

import PageLimit from "../../../../../const/PaginationData"
import { useParams } from "react-router-dom"

function ScheduledCourseList() {
  const { batch } = useParams()
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])
  const [lastVisible, setLastVisible] = useState(null)
  const [hasMore, setHasMore] = useState(true)
  const [dataCount, setDataCount] = useState(0)
  const [templateId, setTemplateId] = useState([])

  const colRef = collection(db, "courses/CDEC/cdecChildren")

  const fetchId = async () => {
    try {
      const ScheduledRef = collection(db, `/AcademicYear/${batch}/cdec`)
      const academicYearsCoursesSnapshot = await getDocs(ScheduledRef)
      if (academicYearsCoursesSnapshot.size === 0) {
        console.log("No documents found.")
      } else {
        academicYearsCoursesSnapshot.forEach((doc) => {
          setTemplateId((prevValues) => [...prevValues, doc.data().templateId])
        })
      }
    } catch (error) {
      console.error("Error fetching id:", error)
    }
  }

  // const getBatch = async () => {
  //   await new Promise(async (resolve, reject) => {
  //     try {
  //       const initial_query = query(
  //         colRef,
  //         //where("HomePageDisplayStatus", "==", true),
  //         orderBy("createdAt", "desc"),
  //         limit(PageLimit.CdecScheduledCourseLimit)
  //       )

  //       getDocs(initial_query)
  //         .then((data) => {
  //           setLoading(false)
  //           updateState(data)
  //         })
  //         .catch((error) => {
  //           //setError(error);
  //           setLoading(false)
  //         })
  //       setLoading(false)
  //       window.scroll(0, 0) // scroll to top
  //       try {
  //         const querySnapshot = await getCountFromServer(colRef)
  //         const documentCount = querySnapshot.data().count
  //         // console.log("TotalCount:", documentCount)
  //         setDataCount(documentCount)
  //         return documentCount
  //       } catch (error) {
  //         console.error("Error getting document count:", error)
  //         return 0
  //       }
  //     } catch (error) {
  //       //toast.error("Could not fetch data")
  //     }
  //   })
  // }

  function formatCourse(doc) {
    const {
      CourseCode,
      CourseImage,
      CourseName,
      CourseDepartment,
      CourseDescription,
      CourseFees,
      CourseFaculty,
      CourseDuration,
      CourseStatus,
      createdAt,
    } = doc.data()
    return {
      DocId: doc.id,
      CourseCode,
      CourseImage,
      CourseName,
      CourseDepartment,
      CourseDescription,
      CourseFees,
      CourseFaculty,
      CourseDuration,
      CourseStatus,
      createdAt,
    }
  }

  useEffect(() => {
    fetchId()
    // console.log("b:", batch)
  }, [batch])

  useEffect(() => {
    //  getBatch()
  }, [templateId])

  const updateState = (collection, transform = formatCourse) => {
    const isCollectionEmpty = collection.size === 0

    if (!isCollectionEmpty) {
      const dataDoc = collection.docs.map(transform)
      const lastDoc = collection.docs[collection.docs.length - 1]
      setData((prevData) => {
        const existingIds = prevData.map((item) => item.DocId)
        const updatedData = dataDoc.map((item) => ({
          ...item,
          scheduledstatus: templateId.includes(item.DocId),
        }))
        // console.log("UpdatedData:", updatedData)
        const filteredNewData = updatedData.filter(
          (item) => !existingIds.includes(item.DocId)
        )
        return [...prevData, ...filteredNewData]
      })
      setLastVisible(lastDoc)
    } else {
      // console.log("No More Doc To Fetch")
    }
    setLoading(false)
  }

  const getBatch = async () => {
    try {
      const querySnapshot = await getCountFromServer(colRef)
      const documentCount = querySnapshot.data().count
      // console.log("TotalCount:", documentCount)
      setDataCount(documentCount)
    } catch (error) {
      console.error("Error getting document count:", error)
    }
  }

  useEffect(() => {
    getBatch()
  }, [])

  const fetchMore = () => {
    // const colRef = collection(db, `/AcademicYear/${batch}/cdec`)
    setLoading(true)
    let moreData = ""
    if (lastVisible === null) {
      moreData = query(
        colRef,
        orderBy("createdAt", "desc"),

        limit(PageLimit.CdecScheduledCourseLimit)
      )
    } else {
      moreData = query(
        colRef,
        orderBy("createdAt", "desc"),
        startAfter(lastVisible),
        limit(PageLimit.CdecScheduledCourseLimit)
      )
    }

    getDocs(moreData).then((data) => {
      updateState(data)
    })
  }

  useEffect(() => {
    if (data.length === dataCount && lastVisible !== null) {
      setHasMore(false)
    } else {
      setHasMore(true)
    }

    // console.log(data)
  }, [data])

  return (
    <RootLayout>
      <div>
        {/* Course Section 2 */}
        {loading ? (
          <Spinner />
        ) : data && data.length > 0 ? (
          <section className="pt-20  lg:pt-[120px] overflow-hidden pb-10 lg:pb-20">
            <div className="container">
              <div className="flex flex-wrap justify-center -mx-4">
                <div className="w-full px-4">
                  <div className="text-center mx-auto mb-[60px]  max-w-[510px]">
                    <span className="font-semibold text-3xl text-green-500 mb-2 block">
                      Scheduled Courses
                    </span>
                  </div>
                </div>
              </div>
              {/* {showing spinner while fetching data} */}

              <div className="flex flex-wrap mx-4 justify-center overflow-y-scroll">
                {data.map((item) => (
                  <ScheduledCourseCard
                    className="p-2  mb-3"
                    urlLink={`/admin/CDEC/Course/${item.DocId}`}
                    key={item.DocId}
                    CourseNameInSingleLine={false}
                    NoOfStd={item.NoOfStd}
                    CourseCode={item.CourseCode}
                    CourseImage={
                      item.thumbnailImage
                        ? item.thumbnailImage
                        : item.CourseImage
                    }
                    CourseName={item.CourseName}
                    CourseDepartment={item.CourseDepartment}
                    CourseDescription={item.CourseDescription}
                    CourseFees={item.CourseFees}
                    DocId={item.DocId}
                    CourseFaculty={item.CourseFaculty} // need to change
                    CourseDuration={item.CourseDuration}
                    CourseStatus={item.CourseStatus}
                    Scheduledstatus={item.scheduledstatus}
                  />
                ))}
              </div>

              {
                <>
                  <LoadMoreButton onClick={fetchMore} disabled={!hasMore} />
                </>
              }

              {/* {showing spinner while fetching data} */}
            </div>
          </section>
        ) : (
          <div className="h-screen w-[1300px] flex justify-center items-center">
            <button
              className="text-gray-900 bg-gradient-to-r from-teal-200 to-lime-200 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-200 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-teal-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
              type="button"
              onClick={fetchMore}
              disabled={!hasMore}
            >
              Click to Start
            </button>
          </div>
        )}
      </div>
    </RootLayout>
  )
}

export default ScheduledCourseList
