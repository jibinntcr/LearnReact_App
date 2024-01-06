import RootLayout from "../../../components/SideBar/RootLayout"
import Title from "../../../components/Title/Title"
import { format } from "date-fns"
// icons
import { FaArrowRight } from "react-icons/fa"
//components
import Spinner from "../../../components/Spinner/Spinner"
import "react-toastify/dist/ReactToastify.css"
import Select from "react-select"
//faculty template
import React, { useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"
//XLSX
import * as XLSX from "xlsx"

// Date Picker
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

//toastify
import { toast } from "react-toastify"

//firebase firestore
import { db } from "../../../firebase.config"
import {
  getDocs,
  collection,
  query,
  orderBy,
  limit,
  startAfter,
  where,
  doc,
  getDoc,
  getCountFromServer,
} from "firebase/firestore"
import PaymentTable from "./PaymentTable/PaymentTable"
import LoadMoreButton from "../../../components/Button/LoadMoreButton"
import PageLimit from "../../../const/PaginationData"
import { de } from "date-fns/locale"

function EnrollReport() {
  const { pathname } = useLocation()
  var date = new Date(),
    y = date.getFullYear(),
    m = date.getMonth()
  var firstDay = new Date(y, m, 1)
  // console.log(firstDay)

  var lastDay = new Date(y, m + 1, 0)
  // console.log(lastDay)
  const [loading, setLoading] = useState(false)
  const [lastVisible, setLastVisible] = useState(null)

  const [data, setData] = useState([])
  const [hasMore, setHasMore] = useState(true)
  const [DataCount, setDataCount] = useState("")
  const [startDate, setStartDate] = useState(firstDay)
  const [endDate, setEndDate] = useState(lastDay)
  const [facultyData, setFacultyData] = useState([]) // select element format
  const [selectedFaculty, setSelectedFaculty] = useState({
    value: "",
    label: "",
  }) //  selected faculty data
  const [loadingText, setloadingText] = useState(true)

  const [departmentsList, setDepartmentsList] = useState({})
  const [selectedDepartment, setSelectedDepartment] = useState({
    value: "",
    label: "",
  })

  const [selectedOption, setSelectedOption] = useState({
    value: "createdAt",
    label: "Last added",
  })

  const [search, setSearch] = useState("")

  // collection ref
  const colRef = collection(db, "enroll")

  // for formatting the fetchData
  function formatCourse(doc) {
    const {
      userName,
      userId,
      userEmail,
      batch,
      courseName,
      courseCode,
      courseBy,
      cusatFlag,
      cash,
      gst,
      totalCash,
      scheduleId,
      createdAt,
      FacultyName,
      FacultyId,
      department,
    } = doc.data()

    return {
      id: doc.id,
      DocId: doc.id,
      userName,
      userId,
      userEmail,
      batch,
      courseName,
      courseCode,
      courseBy,
      cusatFlag,
      cash,
      gst,
      totalCash,
      scheduleId,
      createdAt,
      FacultyName,
      FacultyId,
      department,
    }
  }

  const fetchDepartments = async () => {
    const docRef = doc(db, "departments", "list")

    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const array = docSnap.data().names

      let options = []
      array.map((item) => {
        options.push({ value: item, label: item })
      })

      console.log(options)

      setDepartmentsList(options)
    } else {
      // doc.data() will be undefined in this case
      toast.error("Something went wrong !")
    }
  }

  useEffect(() => {
    fetchDepartments()
  }, [])

  const CountFromServer = async (q) => {
    const querySnapshot = await getCountFromServer(q)
    const documentCount = querySnapshot.data().count
    // SetNoOFuser(documentCount)
    setDataCount(documentCount)
    // console.log(documentCount)
  }

  // fetch Data from server
  const fetchData = async (state, query, transform = formatCourse) => {
    try {
      const querySnapshot = await getDocs(query)
      updateState(querySnapshot, true)
      //   const results = querySnapshot.docs.map(transform)
      //   console.log("results", results)
      //   state(results)
      //   setLoading(false)
    } catch (error) {
      console.error("Error fetching data:", error)
      setLoading(false)
    }
  }

  useEffect(() => {
    if (search !== null) {
      setLoading(true)
      let searchQuery
      // console.log(selectedOption.value, "==", `batch${search}`)

      if (
        selectedOption.value !== "createdAt" &&
        (search.length >= 3 || search.length === 0)
      ) {
        // console.log(selectedOption.value, "==", `batch${search}`)
        if (selectedOption.value === "batch") {
          searchQuery = query(
            colRef,

            where(selectedOption.value, "==", `batch${search}`),
            orderBy(selectedOption.value),
            limit(PageLimit.EnrollReportLimit)
          )
          CountFromServer(
            query(
              colRef,

              where(selectedOption.value, "==", `batch${search}`),
              orderBy(selectedOption.value)
            )
          )
        } else if (selectedOption.value === "date") {
          searchQuery = query(
            colRef,
            where("createdAt", ">=", startDate),
            where("createdAt", "<=", endDate),
            orderBy("createdAt"),

            limit(PageLimit.EnrollReportLimit)
          )
          CountFromServer(
            query(
              colRef,
              where("createdAt", ">", startDate),
              where("createdAt", "<=", endDate),
              orderBy("createdAt")
            )
          )
        } else if (selectedOption.value === "department") {
          searchQuery = query(
            colRef,
            where("department", "==", selectedDepartment.value),
            where("createdAt", ">=", startDate),
            where("createdAt", "<=", endDate),
            orderBy("createdAt"),

            limit(PageLimit.EnrollReportLimit)
          )

          CountFromServer(
            query(
              colRef,
              where("department", "==", selectedDepartment.value),
              where("createdAt", ">=", startDate),
              where("createdAt", "<=", endDate)
            )
          )
        } else if (selectedOption.value === "faculty") {
          if (selectedFaculty.value.length !== 0) {
            searchQuery = query(
              colRef,
              where("FacultyId", "array-contains", selectedFaculty.value),
              where("createdAt", ">=", startDate),
              where("createdAt", "<=", endDate),
              orderBy("createdAt"),
              limit(PageLimit.EnrollReportLimit)
            )

            CountFromServer(
              query(
                colRef,
                where("FacultyId", "array-contains", selectedFaculty.value),
                where("createdAt", ">=", startDate),
                where("createdAt", "<=", endDate)
              )
            )
          }
        } else {
          searchQuery = query(
            colRef,
            where(`${selectedOption.value}`, "==", search),
            orderBy(selectedOption.value),
            limit(PageLimit.EnrollReportLimit)
          )
          // console.log("orderBy" + selectedOption.value)
          CountFromServer(
            query(
              colRef,
              where(`${selectedOption.value}`, "==", search),
              orderBy(selectedOption.value)
            )
          )
        }
      } else {
        searchQuery = query(
          colRef,
          orderBy("createdAt", "desc"),
          limit(PageLimit.EnrollReportLimit)
        )
        CountFromServer(colRef)
      }
      fetchData(setData, searchQuery)
    }
  }, [
    search,
    selectedOption,
    startDate,
    endDate,
    selectedDepartment,
    selectedFaculty,
  ])

  useEffect(() => {
    setLastVisible(null)
    setData([])
  }, [selectedOption])

  useEffect(() => {
    setSelectedFaculty({ value: "", label: "" })
  }, [selectedDepartment])

  useEffect(() => {
    setLastVisible(null)
    setData([])
  }, [selectedFaculty, selectedDepartment])

  useEffect(() => {
    CountFromServer(colRef)
  }, [])

  const options = [
    { value: "batch", label: "Batch" },
    // { value: "batchDate", label: "Batch  and Date" },
    { value: "userEmail", label: "Email" },
    { value: "userName", label: "Name" },
    { value: "date", label: "Date" },
    { value: "department", label: "Department and Date" },
    { value: "faculty", label: "Faculty and Date" },

    {
      value: "createdAt",
      label: "New",
    },
  ]

  const fetchFaculty = (e) => {
    const colRef = collection(db, "faculty")
    const q = query(colRef, where("department", "==", selectedDepartment.value))

    getDocs(q)
      .then((snapshot) => {
        // console.log(snapshot.docs)
        let tempArray = []
        snapshot.docs.forEach((doc) => {
          tempArray.push({ ...doc.data(), DocId: doc.id })
        })
        // debugger
        var result = tempArray.map((item) => ({
          value: item.DocId,
          label: `${item.name} (${item.designation})`,
        }))
        // console.log(result)

        setFacultyData(result)
        setloadingText(false)
      })
      .catch((err) => {
        // toast.error("Error fetching data ")
        setloadingText(false)
      })
  }

  useEffect(() => {
    if (selectedOption.value === "faculty") {
      fetchFaculty()
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDepartment])

  const updateState = (collection, first = false) => {
    const isCollectionEmpty = collection.size === 0

    const dataDoc = collection.docs.map(formatCourse)

    console.table(dataDoc)
    // debugger
    const lastDoc = collection.docs[collection.docs.length - 1]
    if (first) {
      setData(dataDoc)
    } else {
      setData((prevData) => {
        const existingIds = prevData.map((item) => item.id)
        const filteredNewData = dataDoc.filter(
          (item) => !existingIds.includes(item.id)
        )
        return [...prevData, ...filteredNewData]
      })
    }

    if (!isCollectionEmpty) {
      setLastVisible(lastDoc)
    } else {
      setHasMore(false)
    }

    setLoading(false)
  }

  // console.log(data.length + "data.length ")

  useEffect(() => {
    if (data.length === DataCount) {
      setHasMore(false)
    } else {
      setHasMore(true)
    }
  }, [data])

  const fetchMore = () => {
    let searchQuery
    if (selectedOption.value !== "createdAt") {
      if (selectedOption.value === "batch") {
        searchQuery = query(
          colRef,
          where(selectedOption.value, "==", `batch${search}`),
          orderBy(selectedOption.value),
          startAfter(lastVisible),
          limit(PageLimit.EnrollReportLimit)
        )
      } else if (selectedOption.value === "date") {
        searchQuery = query(
          colRef,
          where("createdAt", ">=", startDate),
          where("createdAt", "<=", endDate),
          orderBy("createdAt"),
          startAfter(lastVisible),
          limit(PageLimit.EnrollReportLimit)
        )
      } else if (selectedOption.value === "department") {
        searchQuery = query(
          colRef,
          where("department", "==", selectedDepartment.value),
          where("createdAt", ">=", startDate),
          where("createdAt", "<=", endDate),
          orderBy("createdAt"),
          startAfter(lastVisible),
          limit(PageLimit.EnrollReportLimit)
        )
      } else if (selectedOption.value === "faculty") {
        searchQuery = query(
          colRef,
          where("FacultyId", "array-contains", selectedFaculty.value),
          where("createdAt", ">=", startDate),
          where("createdAt", "<=", endDate),
          orderBy("createdAt"),
          startAfter(lastVisible),
          limit(PageLimit.EnrollReportLimit)
        )
      } else {
        searchQuery = query(
          colRef,
          where(`${selectedOption.value}`, "==", search),
          orderBy(selectedOption.value),
          startAfter(lastVisible),
          limit(PageLimit.EnrollReportLimit)
        )
      }
    } else {
      searchQuery = query(
        colRef,

        orderBy("createdAt", "desc"),
        startAfter(lastVisible),
        limit(PageLimit.EnrollReportLimit)
      )
    }

    getDocs(searchQuery).then((data) => {
      // console.log(data)
      updateState(data)
    })
  }

  function arrayToStringWithSpaces(arr) {
    if (!arr || arr.length === 0) {
      return " "
    }
    return arr.join(" , ")
  }

  const handleOnExport = async () => {
    let excel = JSON.parse(JSON.stringify(data))
    console.log(excel)

    await excel.map((item) => {
      delete item.DocId
      delete item.scheduleId
      delete item.userId
      delete item.id

      item.User_Name = item.userName
      delete item.userName

      item.User_Email = item.userEmail
      delete item.userEmail

      item.Course_Name = item.courseName
      delete item.courseName

      item.Course_Code = item.courseCode
      delete item.courseCode

      item.Cash = item.cash
      delete item.cash

      item.GST = item.gst
      delete item.gst

      item.Total_Cash = item.totalCash
      delete item.totalCash
      item.Course_By = item.courseBy
      delete item.courseBy

      item.Batch = item.batch.slice(5)
      delete item.batch

      item.Date = format(item.createdAt.seconds * 1000, "dd/MM/yyyy")
      item.Time = format(item.createdAt.seconds * 1000, "HH:mm:ss")
      delete item.createdAt

      item.cusatFlag
        ? (item.Cusat_student = "Yes")
        : (item.Cusat_student = "No")

      delete item.cusatFlag

      item.Faculty_Names = arrayToStringWithSpaces(item?.FacultyName)
      item.Department = item.department
      delete item.FacultyName
      delete item.FacultyId
      delete item.department

      return item
    })

    // console.log(excel)

    var wb = XLSX.utils.book_new()
    var ws = XLSX.utils.json_to_sheet(excel, {
      header: [
        "Batch",
        "Cusat_student",
        "User_Name",
        "User_Email",
        "Course_Name",
        "Course_Code",
        "Course_By",
        "Cash",
        "GST",
        "Total_Cash",
        "Date",
        "Time",
        "Faculty_Names",
        "Department",
      ], // ordered list of keys
    })
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1")

    XLSX.writeFile(wb, `Payment Report.xlsx`)
  }

  return (
    <RootLayout>
      <div className="overflow-hidden rounded-lg m-3  mt-16 ">
        <div className="container my-8">
          <Title>Payment Information</Title>
          <div className="w-full px-4 flex justify-center">
            <div className="">
              <div className="text-center">
                <div className="flex">
                  <div className="pt-2 w-[500px] flex-1 relative mx-auto text-gray-600">
                    {selectedOption.value === "department" ||
                    selectedOption.value === "faculty" ? (
                      <>
                        <div className="w-[300px]  mt-[8px] ml-6 ">
                          <div className="pb-2">
                            <label
                              htmlFor="courseDuration"
                              className=" left-0  text-gray-600  "
                            >
                              Select Department
                            </label>{" "}
                          </div>
                          {/* department*/}
                          <Select
                            value={selectedDepartment}
                            onChange={setSelectedDepartment}
                            options={departmentsList}
                          />
                        </div>
                      </>
                    ) : (
                      <div className=" mt-6">
                        {/* search input  */}
                        <input
                          className="border-2 border-gray-300 bg-white h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none"
                          type="search"
                          name="search"
                          placeholder={
                            selectedOption.value !== "date"
                              ? "Enter at least 3 characters to search"
                              : "Disabled"
                          }
                          onChange={(e) => setSearch(e.target.value)}
                          id="default-search"
                          required
                          disabled={
                            selectedOption.value === "date" ||
                            selectedOption.value !== "createdAt"
                          }
                        />
                        <button
                          type="submit"
                          className="absolute right-0 mt-3.5 mr-4"
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
                    )}
                  </div>
                  <div className="w-[300px]  mt-[8px] ml-6 ">
                    {/* search  options  */}
                    <div className="pb-2">
                      <label
                        htmlFor="courseDuration"
                        className=" left-0  text-gray-600  "
                      >
                        Search options
                      </label>{" "}
                    </div>
                    <Select
                      value={selectedOption}
                      onChange={setSelectedOption}
                      options={options}
                    />
                  </div>
                  <Link
                    to={
                      pathname.toLowerCase().includes("cusatech")
                        ? "/cusatech/admin/Report/payment/cusatech"
                        : "/admin/Report/payment/cdec"
                    }
                    className="w-[330px] flex  items-center text-sky-700 hover:text-green-500 font-bold text-2xl mt-[7px] ml-12 "
                  >
                    Course wise Report <FaArrowRight className="ml-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
          {(selectedOption.value === "date" ||
            selectedOption.value === "department" ||
            selectedOption.value === "faculty") && (
            <div className="flex mt-16 gap-10 justify-center">
              <div className="mb-6">
                <div className="pb-2">
                  <label
                    htmlFor="StartDate"
                    className=" left-0  text-gray-600  "
                  >
                    Start Date
                  </label>{" "}
                </div>

                <DatePicker
                  className="w-full 
                              rounded
                              py-3
                              text-gray-800
                              required
                              outline-none
                              focus-visible:shadow-none
                              focus:border-primary"
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  dateFormat="dd/MM/yyyy"
                  showYearDropdown
                  scrollableMonthYearDropdown
                  showMonthDropdown
                />
              </div>

              <div className="mb-6">
                <div className="pb-2">
                  <label htmlFor="EndDate" className=" left-0  text-gray-600  ">
                    End Date
                  </label>{" "}
                </div>
                <DatePicker
                  className="w-full
                              rounded
                              py-3
                              text-gray-800
                              required
                              outline-none
                              focus-visible:shadow-none
                              focus:border-primary"
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  dateFormat="dd/MM/yyyy"
                  minDate={startDate.getTime() + 60 * 60 * 24 * 1000} // add one day
                  showYearDropdown
                  showMonthDropdown
                />
              </div>

              {selectedOption.value === "faculty" &&
                selectedDepartment.value !== "" && (
                  <div className="mb-6 -mt-2 w-[300px] ml-6">
                    <div className="pb-2">
                      <label
                        htmlFor="courseDuration"
                        className=" left-0  text-gray-600  "
                      >
                        Select professors
                      </label>{" "}
                    </div>
                    <Select
                      className="w-full
                            rounded
                            py-3
                            text-gray-800
                            required
                            outline-none
                            focus-visible:shadow-none
                            focus:border-primary"
                      options={facultyData}
                      value={selectedFaculty}
                      onChange={(selectedOption) => {
                        setSelectedFaculty(selectedOption)
                      }}
                      isSearchable
                    />
                  </div>
                )}
            </div>
          )}
        </div>

        {loading ? (
          <Spinner />
        ) : data &&
          data.length > 0 &&
          (search.length >= 3 ||
            selectedOption.value === "createdAt" ||
            selectedOption.value === "faculty" ||
            selectedOption.value === "department" ||
            selectedOption.value === "date") ? (
          <>
            <p className="text-xl my-4 font-semibold">
              {" "}
              No of documents : {DataCount}
            </p>

            <div className="flex justify-end mt-8 p-4">
              <button
                onClick={handleOnExport}
                className="bg-transparent hover:bg-green-500 text-green-700 font-semibold hover:text-white py-2 px-4 border border-green-500 hover:border-transparent rounded-full"
              >
                Export to Excel
              </button>
            </div>

            <PaymentTable data={data} />
            <LoadMoreButton onClick={fetchMore} disabled={!hasMore} />
          </>
        ) : (
          <div className="container my-64 h-5/6 w-11/12 flex text-5xl font-bold justify-center items-center">
            <Title>Data not available</Title>
          </div>
        )}
      </div>
    </RootLayout>
  )
}

export default EnrollReport
