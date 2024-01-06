import React, { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"

//firebase
import { db } from "../../../../firebase.config"
import { collection, getDocs, orderBy, query } from "firebase/firestore"

//React Select
import Select from "react-select"

// toastify
import { toast } from "react-toastify"

//Components
import Title from "../../../../components/Title/Title"

import Spinner from "../../../../components/Spinner/Spinner"
import FromDesign from "../../../../components/NewForms/FormDesign"
import RootLayout from "../../../../components/SideBar/RootLayout"

function UpdateSelect() {
  const navigate = useNavigate()

  // fetch faculty data from db
  const [loading, setLoading] = useState(false)

  const [batchList, setBatchList] = useState([]) // batchList
  const [selectedBatch, setSelectedBatch] = useState([{ value: "", label: "" }]) // batchList

  // for formatting the fetchData
  function formatCourse(doc) {
    const { CourseName, createdAt } = doc.data()

    return { DocId: doc.id, CourseName, createdAt }
  }

  useEffect(() => {
    window.scroll(0, 0)

    // fetching batchList
    const fetchData = async () => {
      try {
        const colRef = collection(db, `/courses/CDEC/cdecChildren`)

        const q = query(colRef, orderBy("createdAt", "desc"))

        const querySnapshot = await getDocs(q)
        // console.log(querySnapshot)
        const results = querySnapshot.docs.map(formatCourse)
        // results.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds) // sort by createdAt

        var result = results.map((item) => ({
          value: item.DocId,
          label: item.CourseName,
        }))

        // console.log("result")
        // console.log(result)
        setBatchList(result)
      } catch (error) {
        toast.error(error.message)
      }
    }

    fetchData()
  }, [])

  const canSave = Boolean(selectedBatch.value)
  // console.log(selectedBatch)

  const onSubmit = async (e) => {
    document.body.scrollIntoView()
    setLoading(true)

    e.preventDefault()

    navigate(`/admin/Course/cdec/Update/${selectedBatch.value}`)
  }

  return (
    <RootLayout>
      <Title> Update Course - CDeC</Title>

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
                    <div className="mb-6">
                      <div className="pb-2">
                        <label
                          htmlFor="batchList"
                          className=" left-0 text-black  text-lg font-semibold "
                        >
                          Select course
                        </label>{" "}
                      </div>
                      <Select
                        id="batchList"
                        className="w-full
                              rounded
                              py-3
                              text-gray-800
                              required
                              outline-none
                              focus-visible:shadow-none
                              focus:border-primary
                              text-base"
                        options={batchList}
                        onChange={(selectedOption) => {
                          setSelectedBatch(selectedOption)
                        }}
                        isSearchable
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
                        go to Update page
                      </button>
                    </div>
                  </form>

                  <div className="p-5  ">
                    <h1 className="text-xl text-center font-semibold mb-2">
                      {" "}
                      Course List <br />{" "}
                      <p className="text-right mb-4 mr-10 text-sm text-gray-600">
                        No of Courses {batchList.length}
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
                              Course Name
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {batchList.map((item, index) => (
                            <tr
                              className="even:bg-white odd:bg-gray-100"
                              key={index}
                            >
                              <td className="p-3 text-base whitespace-nowrap text-blue-500">
                                {++index}
                              </td>
                              <td className="p-3 text-base text-gray-700 whitespace-nowrap">
                                {item.label}
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

export default UpdateSelect
