import React, { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"

//firebase
import { db } from "../../../../firebase.config"
import { getDoc, doc } from "firebase/firestore"

//React Select
import Select from "react-select"

// toastify
import { toast } from "react-toastify"

// React icons
import { BiSelectMultiple } from "react-icons/bi"
import { IoIosCreate } from "react-icons/io"

//Components
import Title from "../../../../components/Title/Title"

import Spinner from "../../../../components/Spinner/Spinner"
import FromDesign from "../../../../components/NewForms/FormDesign"
import RootLayout from "../../../../components/SideBar/RootLayout"
import Required from "../../../../components/Required Icon/Required"

function SelectDepartment() {
  const { OfferedBy } = useParams()
  const navigate = useNavigate()

  // fech faculty data from db
  const [loading, setLoading] = useState(false)
  const [collegeDepartmentBoolean, setCollegeDepartmentBoolean] =
    useState(false)
  const [collegeDepartment, setCollegeDepartment] = useState({
    value: "department name",
    label: "department name",
  })
  const [departmentsList, setDepartmentsList] = useState({})

  const [batchList, setBatchList] = useState([]) // batchList

  function isEmptyObject(obj) {
    if (collegeDepartment?.value === "department name") {
      // console.log("first" + Object.keys(collegeDepartment).length === 0)
      return Object.keys(collegeDepartment).length === 0
    }
  }

  useEffect(() => {
    if (
      collegeDepartment.value.length === 0 ||
      collegeDepartment.value === "department name"
    ) {
      setCollegeDepartmentBoolean(false)
    } else {
      setCollegeDepartmentBoolean(true)
    }
  }, [collegeDepartment])

  useEffect(() => {
    window.scroll(0, 0)

    // fetching batchList
    const fetchDepartments = async () => {
      const docRef = doc(db, "departments", "list")

      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        const array = docSnap.data().names

        setBatchList(array)

        let options = []
        array.map((item) => {
          options.push({ value: item, label: item })
        })

        setDepartmentsList(options)
      } else {
        // doc.data() will be undefined in this case
        toast.error("Something went wrong !")
      }
    }

    fetchDepartments()
  }, [])

  const canSave = collegeDepartmentBoolean

  const onSubmit = async (e) => {
    document.body.scrollIntoView()
    setLoading(true)

    e.preventDefault()

    if (OfferedBy.toLowerCase() === "cdec")
      navigate(`/admin/Departments/${collegeDepartment.value}/CreateCours3`, {
        state: collegeDepartment.value,
      })
    else
      navigate(
        `/${OfferedBy}/admin/Departments/${collegeDepartment.value}/CreateCours3`,
        { state: collegeDepartment.value }
      )
  }

  return (
    <RootLayout>
      <Title> Create Course</Title>
      <>
        {/* step bar */}
        <div className="w-full mt-0 py-6">
          <div className="flex">
            <div className="w-1/3">
              <div className="relative mb-2">
                <div className="w-10 h-10 mx-auto bg-green-500 rounded-full text-lg text-white flex items-center">
                  <span className=" flex items-center justify-center text-white w-full">
                    <BiSelectMultiple className="text-xl" />
                  </span>
                </div>
              </div>

              <div className="text-xs font-semibold text-center md:text-base">
                Select batch
              </div>
            </div>

            <div className="w-1/3">
              <div className="relative mb-2">
                <div
                  className="absolute flex align-center items-center align-middle content-center"
                  style={{
                    width: "calc(100% - 2.5rem - 1rem)",
                    top: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <div className="w-full bg-gray-200 rounded items-center align-middle align-center flex-1">
                    <div
                      className="w-0 bg-green-300 py-1 rounded"
                      style={{ width: "33%" }}
                    ></div>
                  </div>
                </div>

                <div className="relative mb-2">
                  <div className="w-10 h-10 mx-auto bg-white text-gray-600  rounded-full text-lg flex items-center">
                    <span className=" flex items-center justify-center  w-full">
                      <IoIosCreate className="text-xl" />
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-xs text-center font-semibold md:text-base">
                Course name
              </div>
            </div>
            <div className="w-1/3">
              <div className="relative mb-2">
                <div
                  className="absolute flex align-center items-center align-middle content-center"
                  style={{
                    width: "calc(100% - 2.5rem - 1rem)",
                    top: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <div className="w-full bg-gray-200 rounded items-center align-middle align-center flex-1">
                    <div
                      className="w-0 bg-green-300 py-1 rounded"
                      style={{ width: "0%" }}
                    ></div>
                  </div>
                </div>

                <div className="relative mb-2">
                  <div className="w-10 h-10 mx-auto bg-white text-gray-600  rounded-full text-lg flex items-center">
                    <span className=" flex items-center justify-center  w-full">
                      <BiSelectMultiple className="text-xl" />
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-xs text-center font-semibold md:text-base">
                Finished
              </div>
            </div>
          </div>
        </div>
      </>

      <FromDesign
        formJsx={
          <div className="mt-0">
            {" "}
            <div className="mb-6">
              {loading ? (
                <>
                  <Spinner />
                </>
              ) : (
                <>
                  <form className="w-full">
                    <div>
                      <label htmlFor="department">
                        <div className="flex items-center">
                          <p className="block text-sm font-medium text-gray-700 md:text-base md:mb-1">
                            Department <Required /> &nbsp;{" "}
                          </p>
                        </div>
                      </label>

                      <Select
                        options={departmentsList}
                        onChange={(selectedOption) => {
                          setCollegeDepartment(selectedOption)
                        }}
                        isSearchable
                        value={collegeDepartment}
                      />
                    </div>

                    <div className="my-6">
                      <button
                        disabled={!canSave}
                        type="submit"
                        onClick={onSubmit}
                        className={
                          canSave
                            ? "w-full text-white font-semibold bg-green-400 rounded-lg border border-primary text-lg p-3 transition ease-in-out duration-500"
                            : "w-full  text-gray-400 bg-green-200 rounded-lg border border-primary text-lg p-3 transition ease-in-out duration-500"
                        }
                      >
                        Go to Step 2
                      </button>
                    </div>
                  </form>

                  <div className="p-5  ">
                    <h1 className="text-xl text-center font-semibold mb-2">
                      {" "}
                      Department List <br />{" "}
                      <p className="text-right mb-4 mr-10 text-sm text-gray-600">
                        No of batches {batchList.length}
                      </p>
                    </h1>

                    <div className="overflow-auto rounded-lg shadow block">
                      <table className="w-full ">
                        <thead className="bg-gray-50 border-b-2 border-gray-200">
                          <tr className="">
                            <th className="w-20 p-3 text-base font-semibold tracking-wide text-left">
                              No.
                            </th>
                            <th className="p-3 text-base font-semibold tracking-wide text-left">
                              Department Name
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {batchList?.map((item, index) => (
                            <tr
                              className="even:bg-white odd:bg-gray-100"
                              key={index}
                            >
                              <td className="p-3 text-base whitespace-nowrap text-blue-500">
                                {++index}
                              </td>
                              <td className="p-3 text-base text-gray-700 whitespace-nowrap">
                                {item}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        }
      />
    </RootLayout>
  )
}

export default SelectDepartment
