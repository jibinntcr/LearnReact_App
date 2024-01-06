import React, { useEffect, useState, useRef } from "react"

//css
import "./CoursesPageStyles.css"

import Spinner from "../../components/Spinner/Spinner"
import Card5 from "../../components/Card5/CourseCard"
import LoadMoreButton from "../Button/LoadMoreButton"

// toastify
import { toast } from "react-toastify"

//context
import { useUserAuth } from "../../context/UserAuthContext"

import PageLimit from "../../const/PaginationData"
import { Link } from "react-router-dom"
import CdecHomePageCoursesBox from "./CdecHomePageCoursesBox"
import CusatechHomePageCoursesBox from "./CusatechHomePageCoursesBox"

function CombinedHomepageCourseBox() {
  const childRef = useRef(null)
  const { user, enrolledCourses, userDetails, cusaTechEnrolledCourses } =
    useUserAuth()
  // loading state
  const [loading, setLoading] = useState(false)
  const [cdecLoading, setCdecLoading] = useState(false)
  const [cusatechLoading, setCusatechLoading] = useState(false)

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
        userDetails?.RecognizedInstitutionFlag
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

  return (
    <div>
      <>
        <CdecHomePageCoursesBox
          setCdecCourseData={setCdecCourseData}
          setCdecLoading={setCdecLoading}
        />
        <CusatechHomePageCoursesBox
          setCusatechCourseData={setCusatechCourseData}
          setCusatechLoading={setCusatechLoading}
        />

        {loading ? (
          <Spinner />
        ) : combinedCourseData && combinedCourseData.length > 0 ? (
          <section className="pt-20  lg:pt-[120px] overflow-hidden pb-10 lg:pb-20 flex flex-wrap justify-center">
            <div className="container">
              <div className="flex flex-wrap justify-center -mx-4">
                <div className="w-full px-4">
                  <div className="text-center mx-auto mb-[60px] lg:mb-20 max-w-[510px]">
                    <span className="font-semibold text-lg text-green-500 mb-2 block">
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

              <div className="flex flex-wrap  mx-4 justify-center">
                {combinedCourseData.map((item) => (
                  <Card5
                    className="p-2  mb-3"
                    urlLink={item.urlLink}
                    key={item.DocId}
                    CourseNameInSingleLine={false}
                    NoOfStd={item.NoOfStd}
                    CourseCode={item.CourseCode}
                    CourseImage={item.CourseImage}
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
              <Link to="/courses">
                <LoadMoreButton />
              </Link>
            </div>
          </section>
        ) : null}
      </>
    </div>
  )
}

export default CombinedHomepageCourseBox
