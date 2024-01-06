import React, { useEffect, useState } from "react"
import { db } from "../../../../firebase.config"
import {
  getDocs,
  collection,
  query,
  limit,
  orderBy,
  startAfter,
  getCountFromServer,
} from "firebase/firestore"
import Spinner from "../../../../components/Spinner/Spinner"
import Card5 from "../../../../components/Card5/Card5"
import RootLayout from "../../../../components/SideBar/RootLayout"
import LoadMoreButton from "../../../../components/Button/LoadMoreButton"
import PageLimit from "../../../../const/PaginationData"

function CusatechAllCourses() {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState([])
  const [lastVisible, setLastVisible] = useState(null)
  const [hasMore, setHasMore] = useState(true)
  const [dataCount, setDataCount] = useState(0)

  const colRef = collection(db, "courses/CUSATECH/cusatechChildren")

  function formatCourse(doc) {
    const {
      CourseCode,
      NoOfStd,
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
      NoOfStd,
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

  const getDocumentCount = async () => {
    try {
      const querySnapshot = await getCountFromServer(colRef)
      const documentCount = querySnapshot.data().count
      // console.log("TotalCount:", documentCount)
      setDataCount(documentCount)
      return documentCount
    } catch (error) {
      console.error("Error getting document count:", error)
      return 0
    }
  }
  let initial_query = query(
    colRef,
    orderBy("createdAt", "desc"),
    limit(PageLimit.CusaTechAdminPageCourseListLimit)
  )

  useState(() => {
    getDocumentCount()
    setLoading(true)
    getDocs(initial_query).then((data) => {
      updateState(data)
    })
  }, [])

  const updateState = (collection, transform = formatCourse) => {
    const isCollectionEmpty = collection.size === 0

    if (!isCollectionEmpty) {
      const dataDoc = collection.docs.map(transform)
      const lastDoc = collection.docs[collection.docs.length - 1]
      setData((prevData) => {
        const existingIds = prevData.map((item) => item.DocId)
        const filteredNewData = dataDoc.filter(
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

  const fetchMore = () => {
    let moreData = query(
      colRef,
      orderBy("createdAt", "desc"),
      startAfter(lastVisible),
      limit(PageLimit.CusaTechAdminPageCourseListLimit)
    )
    getDocs(moreData).then((data) => {
      updateState(data)
    })
  }

  useEffect(() => {
    // console.log("Data:", data.length)
    // console.log("datacount:", dataCount)
    if (data.length === dataCount) {
      setHasMore(false)
    } else {
      setHasMore(true)
    }
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
                      CUSATECH Courses
                    </span>
                  </div>
                </div>
              </div>
              {/* {showing spinner while fetching data} */}

              <div className="flex flex-wrap mx-4 justify-center overflow-y-scroll">
                {data.map((item) => (
                  <Card5
                    className="p-2  mb-3"
                    urlLink={`/cusatech/admin/CUSATECH/Course/${item.DocId}`}
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
          "Data not available"
        )}
        {/* Pagination buttons */}
      </div>
    </RootLayout>
  )
}

export default CusatechAllCourses
