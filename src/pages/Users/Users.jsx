//faculty template
import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
//css
// import "./CoursesPageStyles.css"

//firebase firestore
import { db } from "../../firebase.config"
import {
  onSnapshot,
  collection,
  query,
  orderBy,
  limit,
  where,
  getCountFromServer,
} from "firebase/firestore"

//components
import Spinner from "../../components/Spinner/Spinner"
import "react-toastify/dist/ReactToastify.css"
import RootLayout from "../../components/SideBar/RootLayout"
import Select from "react-select"
import Title from "../../components/Title/Title"

function Users() {
  // State

  const [loading, setLoading] = useState(false)

  const [data, setData] = useState([])

  const [selectedOption, setSelectedOption] = useState({
    value: "email",
    label: "Email",
  })

  const [search, setSearch] = useState("")

  const [NoOFuser, SetNoOFuser] = useState(0)
  // collection ref
  const colRef = collection(db, "users")

  // for formatting the fetchData
  function formatCourse(doc) {
    const {
      name,
      email,
      photo,
      cusatFlag,
      admin,
      mobile,
      department,
      universityRegNo,
    } = doc.data()

    return {
      DocId: doc.id,
      email,
      photo,
      cusatFlag,
      name,
      admin,
      mobile,
      department,
      universityRegNo,
    }
  }

  const CountFromServer = async () => {
    const querySnapshot = await getCountFromServer(colRef)
    const documentCount = querySnapshot.data().count
    SetNoOFuser(documentCount)
  }

  //fetch Data from server
  const fetchData = (state, query, transform = formatCourse) => {
    onSnapshot(query, (querySnapshot) => {
      let results = querySnapshot.docs.map(transform)
      // console.log("results")

      // console.log(results)
      state(results)
      setLoading(false)
    })
  }

  useEffect(() => {
    if (search !== null) {
      setLoading(true)
      let searchQuery
      if (selectedOption) {
        searchQuery = query(
          colRef,
          where(`${selectedOption.value}`, ">=", search),
          // where(`${selectedOption.value}`, "<=", search + `${search}\uf8ff`),
          orderBy(`${selectedOption.value}`),
          limit(5)
        )
      } else {
        searchQuery = query(colRef, orderBy("name"), limit(4))
      }
      fetchData(setData, searchQuery)
    }
  }, [search, selectedOption])

  const [Path, setPath] = useState("")
  useEffect(() => {
    CountFromServer()
    let location = window.location.href.split("/")[3]
    if (location.toLocaleLowerCase() === "cusatech") {
      setPath(`cusatech/admin`)
    } else {
      setPath("admin")
    }
  }, [])

  const options = [
    { value: "universityRegNo", label: "University Register Number" },
    { value: "email", label: "Email" },
    { value: "name", label: "Name" },
    { value: "mobile", label: "Phone Number" },
  ]

  return (
    <RootLayout>
      <div>
        <section className="pt-20  lg:pt-[120px] overflow-hidden pb-10 lg:pb-20">
          <div className="container">
            <div className="w-full px-4 flex justify-center">
              <div className="">
                <div className="text-center">
                  <span className="font-bold text-4xl text-green-500 mb-4 block">
                    Users List
                  </span>
                  <div className="flex">
                    {/* component */}
                    {/* This is an example component */}
                    <div className="pt-2 w-[500px] flex-1 relative mx-auto text-gray-600">
                      <input
                        className="border-2 border-gray-300 bg-white h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none"
                        type="search"
                        name="search"
                        placeholder="Search"
                        onChange={(e) => setSearch(e.target.value)}
                        id="default-search"
                        required
                      />
                      <button
                        type="submit"
                        className="absolute right-0 top-0 mt-5 mr-4"
                      >
                        <svg
                          className="text-gray-600 h-4 w-4 fill-current"
                          xmlns="http://www.w3.org/2000/svg"
                          xmlnsXlink="http://www.w3.org/1999/xlink"
                          version="1.1"
                          id="Capa_1"
                          x="0px"
                          y="0px"
                          viewBox="0 0 56.966 56.966"
                          style={{
                            enableBackground: "new 0 0 56.966 56.966",
                          }}
                          xmlSpace="preserve"
                          width="512px"
                          height="512px"
                        >
                          <path d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z" />
                        </svg>
                      </button>
                    </div>
                    <div className="w-[300px] mt-[8px] ml-2 ">
                      {" "}
                      <Select
                        value={selectedOption}
                        onChange={setSelectedOption}
                        options={options}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {loading ? (
              <Spinner />
            ) : data && data.length > 0 ? (
              <div className="p-5 mt-10">
                <h1 className="text-xl font-serif font-semibold mb-6">
                  Total No Of Users: {NoOFuser}
                </h1>
                <div className="overflow-auto rounded-lg shadow hidden md:block">
                  <table className="w-full ">
                    <thead className="bg-gray-50 border-b-2 border-gray-200">
                      <tr className="">
                        <th className="w-20 p-3 text-sm font-semibold tracking-wide text-left">
                          No.
                        </th>
                        <th className="p-3 text-sm font-semibold tracking-wide text-left">
                          Photo
                        </th>
                        <th className="p-3 text-sm font-semibold tracking-wide text-left">
                          Student Type
                        </th>
                        <th className="p-3 text-sm font-semibold tracking-wide text-left">
                          Name
                        </th>
                        <th className="w-24 p-3 text-sm font-semibold tracking-wide text-left">
                          Email
                        </th>
                        <th className="w-24 p-3 text-sm font-semibold tracking-wide text-left">
                          Mobile
                        </th>

                        <th className="w-24 p-3 text-sm font-semibold tracking-wide text-left">
                          Department
                        </th>
                        <th className="w-24 p-3 text-sm font-semibold tracking-wide text-left">
                          University Register Number
                        </th>
                        <th className="w-24 p-3 text-sm font-semibold tracking-wide text-left">
                          Details
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                      {data.map((item, index) => (
                        <tr
                          key={item.DocId}
                          className="even:bg-white odd:bg-gray-100"
                        >
                          <td className="p-3 text-sm whitespace-nowrap text-blue-500">
                            {++index}
                          </td>
                          <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                            {item.photo ? (
                              <img
                                className="w-16 h-16 rounded-full"
                                src={item.photo}
                                alt=""
                              />
                            ) : (
                              "Photo Not Available"
                            )}
                          </td>
                          <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                            {item.name}
                          </td>
                          <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
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
                            {item.email}
                          </td>
                          <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                            {item.mobile ? item.mobile : "Not Available"}
                          </td>
                          <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                            {item.department
                              ? item.department
                              : "Not Available"}
                          </td>
                          <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                            {item.universityRegNo
                              ? item.universityRegNo
                              : "Not Available"}
                          </td>
                          <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                            <Link to={`/${Path}/User/block/${item.DocId}`}>
                              <button
                                // id={item.DocId}
                                // onClick={handleClick(item.DocId)}
                                className={`bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow`}
                              >
                                View Details
                              </button>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="container my-64 h-5/6 w-11/12 flex text-5xl font-bold justify-center items-center">
                <Title>Data not available</Title>
              </div>
            )}
          </div>
        </section>
      </div>
    </RootLayout>
  )
}

export default Users
