import React, { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"

//firebase
import { db } from "../../../../firebase.config"
import { collection, getDocs, query, orderBy } from "firebase/firestore"

//React Select
import Select from "react-select"

// toastify
import { toast } from "react-toastify"

// React icons
import { BiSelectMultiple } from "react-icons/bi"
import { FaChalkboardTeacher } from "react-icons/fa"
import { TbReport } from "react-icons/tb"
//Components
import Title from "../../../../components/Title/Title"
import RootLayout from "../../../../components/SideBar/RootLayout"
import Spinner from "../../../../components/Spinner/Spinner"
import FromDesign from "../../../../components/NewForms/FormDesign"

function SelectBatchEnrollReport() {
  const { OfferedBy } = useParams()
  const navigate = useNavigate()

  // fech faculty data from db
  const [loading, setLoading] = useState(false)

  const [batchList, setBatchList] = useState([]) // batchList
  const [selectedBatch, setSelectedBatch] = useState([{ value: "", label: "" }]) // batchList

  // for formatting the fetchData
  function formatBatch(doc) {
    const { batchName, createdAt } = doc.data()

    return { DocId: doc.id, batchName, createdAt }
  }

  useEffect(() => {
    window.scroll(0, 0)

    // fetching batchList
    const fetchData = async () => {
      try {
        const colRef = collection(db, `AcademicYear`)
        const q = query(colRef, orderBy("createdAt", "desc"))

        const querySnapshot = await getDocs(q)
        // console.log(querySnapshot)
        const results = querySnapshot.docs.map(formatBatch)
        // results.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds) // sort by createdAt

        var result = results.map((item) => ({
          value: item.DocId,
          label: item.batchName.slice(5),
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

    if (OfferedBy.toLowerCase() === "cdec")
      navigate(`/admin/Report/payment/${selectedBatch.value}/${OfferedBy}`)
    else
      navigate(
        `/${OfferedBy}/admin/Report/payment/${selectedBatch.value}/${OfferedBy}`
      )
  }

  // pending cusatech

  return (
    <RootLayout>
      <Title> Enroll Report Course - {OfferedBy}</Title>
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

                <div className="w-10 h-10 mx-auto  bg-white rounded-full border-2 border-gray-200 text-lg text-white flex items-center">
                  <span className=" flex items-center justify-center text-white w-full">
                    <FaChalkboardTeacher className="text-xl text-gray-600" />
                  </span>
                </div>
              </div>

              <div className="text-xs font-semibold text-center md:text-base">
                Select Course{" "}
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

                <div className="w-10 h-10 mx-auto bg-white border-2 border-gray-200 rounded-full text-lg text-white flex items-center">
                  <span className=" flex items-center justify-center text-white w-full">
                    <TbReport className="text-xl text-gray-600" />
                  </span>
                </div>
              </div>

              <div className="text-xs font-semibold text-center md:text-base">
                Generate report
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
                    <div className="mb-6">
                      <div className="pb-2">
                        <label
                          htmlFor="batchList"
                          className=" left-0 text-black  text-lg font-semibold "
                        >
                          Select batch
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
                        Go to Step 2
                      </button>
                    </div>
                  </form>

                  <div className="p-5  ">
                    <h1 className="text-xl text-center font-semibold mb-2">
                      {" "}
                      Batch List <br />{" "}
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
                              Batch Name
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

export default SelectBatchEnrollReport
