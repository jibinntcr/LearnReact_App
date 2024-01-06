//faculty template
import React, { useEffect, useState } from "react"
// import { Link, useNavigate } from "react-router-dom"
//css
// import "./CoursesPageStyles.css"

//firebase firestore
import { db } from "../../../firebase.config"
import { getDocs, collection, query, limit } from "firebase/firestore"

//components
import Spinner from "../../../components/Spinner/Spinner"

// import banner from "../../assets/images/banner-bg.jpg"
import FacultyCard from "./FacultyCard"

// toastify
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import RootLayout from "../../../components/SideBar/RootLayout"
import Title from "../../../components/Title/Title"

function ViewFaculty() {
  // State
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState([])

  const [Search, setSearch] = useState("")

  // collection ref
  const colRef = collection(db, "faculty")
  //query
  const q = query(colRef, limit(100))

  // for formating the fetchData
  function formatCourse(doc) {
    const {
      name,
      phone,
      photo,
      email,
      linkedin,
      designation,
      cv,
      affiliation,
      department,
      createdAt,
      iqacUrl,
      GoogleScholarLink,
    } = doc.data()

    return {
      DocId: doc.id,
      phone,
      email,
      photo,
      name,
      designation,
      department,
      linkedin,
      cv,
      affiliation,
      iqacUrl,
      GoogleScholarLink,
      createdAt,
    }
  }

  //fetch Data from server
  const fetchData = (state, query, transform = formatCourse) => {
    getDocs(query)
      .then((snapshot) => {
        const results = snapshot.docs.map(transform)
        //  results.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds) // sort by createdAt
        // console.log(results)
        state(results)
        setLoading(false)
      })
      .catch((err) => {
        // console.log(err.message)
        toast.error("Data fetching failed")
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchData(setData, q)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <RootLayout>
      {/* Course Secion 2 */}
      {loading ? (
        <Spinner />
      ) : data && data.length > 0 ? (
        <section className="pt-20  lg:pt-[120px] overflow-hidden pb-10 lg:pb-20">
          <div className="container">
            <div className="flex flex-wrap justify-center -mx-4">
              <div className="w-full px-4">
                <div className="text-center mx-auto mb-[60px]  max-w-[510px]">
                  <Title>Faculty Details</Title>
                  <form>
                    <label
                      htmlFor="default-search"
                      className="mb-2 text-sm font-medium text-gray-900 sr-only "
                    >
                      Search
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg
                          className="w-4 h-4 text-gray-500 "
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 20 20"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                          />
                        </svg>
                      </div>
                      <input
                        type="search"
                        onChange={(e) => setSearch(e.target.value)}
                        id="default-search"
                        className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 "
                        placeholder="Search here!"
                        required
                      />
                    </div>
                  </form>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap mx-4 justify-center">
              {data
                .filter((item) => {
                  return Search.toLowerCase() === ""
                    ? true
                    : item.name.toLowerCase().includes(Search.toLowerCase())
                })
                .map((item) => (
                  <FacultyCard
                    className="p-2 mb-3"
                    urlLink={`/admin/Faculty/FacultyDetails/${item.DocId}`}
                    key={item.DocId}
                    CourseNameInSingleLine={false}
                    photo={item.photo}
                    name={item.name}
                    phone={item.phone}
                    designation={item.designation}
                    department={item.department}
                    DocId={item.DocId}
                    cv={item.cv} // need to change
                    linkedin={item.linkedin}
                    email={item.email}
                    iqacUrl={item.iqacUrl}
                    GoogleScholarLink={item.GoogleScholarLink}
                  />
                ))}

              {/* <div className="load-courses-btn">Load More Courses</div> */}
            </div>
          </div>
        </section>
      ) : (
        "Data not available"
      )}
    </RootLayout>
  )
}

export default ViewFaculty
