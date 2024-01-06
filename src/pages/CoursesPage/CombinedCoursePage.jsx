import React, { useState, useEffect, useRef } from "react"
//components
import Spinner from "../../components/Spinner/Spinner"
import Footer from "../../components/Footer/Footer"
import Card5 from "../../components/Card5/CourseCard"
import LoadMoreButton from "../../components/Button/LoadMoreButton"

//context
import { useUserAuth } from "../../context/UserAuthContext"
import CoursesPage from "./CoursesPage"
import CusaTechCoursesPage from "./CusaTechCoursesPage"

function CombinedCoursePage() {
  const childRef = useRef(null)
  const { user, enrolledCourses, userDetails, cusaTechEnrolledCourses } =
    useUserAuth()
  // loading state
  const [loading, setLoading] = useState(false)
  const [cdecLoading, setCdecLoading] = useState(false)
  const [cusatechLoading, setCusatechLoading] = useState(false)

  // fetch more state
  const [hasMore, setHasMore] = useState(false)
  const [cdecHasMore, setCdecHasMore] = useState(false)
  const [cusatechHasMore, setCusatechHasMore] = useState(false)

  // course state
  const [cdecCourseData, setCdecCourseData] = useState([])
  const [cusatechCourseData, setCusatechCourseData] = useState([])
  const [combinedCourseData, setCombinedCourseData] = useState([])

  const fund = (
    rs,
    DocId,
    CourseStatus,
    CurriculumCourse,
    CusatStudentsCourseFees,
    InstitutionalStudentPricing
  ) => {
    if (
      user &&
      (enrolledCourses.includes(DocId) ||
        cusaTechEnrolledCourses.includes(DocId))
    ) {
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
          return (rt = "₹" + rt)
        }
      } else if (
        user.cusatFlag === false &&
        userDetails &&
        userDetails?.RecognizedInstitutionFlag === true
      ) {
        let rt = InstitutionalStudentPricing?.toString().replace(
          /\B(?=(\d{3})+(?!\d))/g,
          ","
        )
        if (rt === undefined) return "Enroll"

        return (rt = "₹" + rt)
      } else if (user.cusatFlag === false) {
        let rt = rs?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")

        return (rt = "₹" + rt)
      }
    } else return "Enroll"
  }

  const fetchMoreCourse = () => {
    if (cdecHasMore || cusatechHasMore) {
      childRef.current.childFunction()
    }
  }

  // combined fetch course data
  useEffect(() => {
    setCombinedCourseData([...cdecCourseData, ...cusatechCourseData])
  }, [cdecCourseData, cusatechCourseData])

  // combined fetch loading
  useEffect(() => {
    if (cdecLoading || cusatechLoading) {
      setLoading(true)
    } else {
      setLoading(false)
    }
  }, [cdecLoading, cusatechLoading])

  // combined fetch more
  useEffect(() => {
    if (cdecHasMore || cusatechHasMore) {
      setHasMore(true)
    } else {
      setHasMore(false)
    }
  }, [cdecHasMore, cusatechHasMore])

  console.log(combinedCourseData)

  return (
    <div>
      <>
        <CusaTechCoursesPage
          setCusatechCourseData={setCusatechCourseData}
          setCusatechLoading={setCusatechLoading}
          setCusatechHasMore={setCusatechHasMore}
          ref={childRef}
        />
        <CoursesPage
          setCdecCourseData={setCdecCourseData}
          setCdecLoading={setCdecLoading}
          setCdecHasMore={setCdecHasMore}
          ref={childRef}
        />

        {/* Course section 2 */}

        {loading ? (
          <Spinner />
        ) : combinedCourseData && combinedCourseData.length > 0 ? (
          <section className="pt-20  lg:pt-[120px] overflow-hidden pb-10 lg:pb-20 flex flex-wrap justify-center">
            <div className="container">
              <div className="flex flex-wrap justify-center -mx-4">
                <div className="w-full px-4">
                  <div className="text-center mx-auto mb-[60px] lg:mb-20 max-w-[510px]">
                    <span className="font-semibold text-2xl text-green-500 mb-2 block">
                      Courses
                    </span>
                    <h2 className=" font-bold text-3xl sm:text-4xl md:text-[40px] text-dark mb-4 ">
                      Courses we offer
                    </h2>

                    <p className="text-base text-body-color">
                      There are many variations of passages of Lorem Ipsum
                      available but the majority have suffered alteration in
                      some form.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap mx-4 justify-center">
                {combinedCourseData.map((item) => (
                  <Card5
                    className="p-2  mb-3"
                    urlLink={item.urlLink}
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
                    CourseBatch={item.batch}
                    CourseDepartment={item.CourseDepartment}
                    CourseDescription={item.CourseDescription}
                    CourseFees={fund(
                      item.CourseFees,
                      item.DocId,
                      item.CourseStatus,
                      item?.CurriculumCourse,
                      item?.CusatStudentsCourseFees,
                      item?.InstitutionalStudentPricing
                    )}
                    DocId={item.DocId}
                    CourseFaculty={item.CourseFaculty}
                    CourseDuration={item.CourseDuration}
                  />
                ))}
              </div>
              <LoadMoreButton onClick={fetchMoreCourse} disabled={!hasMore} />
            </div>
          </section>
        ) : (
          <section className="pt-20  lg:pt-[120px] overflow-hidden pb-10 lg:pb-20 flex flex-wrap justify-center">
            <div className="container">
              <div className="w-full px-4">
                <div className="text-center mx-auto mb-[60px] lg:mb-20 max-w-[510px]">
                  <span className="font-semibold text-3xl text-green-500 mb-2 block">
                    Courses
                  </span>
                </div>
              </div>
              <div className="flex justify-center h-96  items-center text-2xl font-semibold">
                {"No Courses were found"}
              </div>
            </div>
          </section>
        )}
      </>

      <Footer />
    </div>
  )
}

export default CombinedCoursePage
