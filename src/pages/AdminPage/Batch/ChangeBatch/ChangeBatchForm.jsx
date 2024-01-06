import React, { useState, useEffect } from "react"
import Select from "react-select"

import { db } from "../../../../firebase.config"
import {
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  updateDoc,
  serverTimestamp,
  addDoc,
} from "firebase/firestore"

import Spinner from "../../../../components/Spinner/Spinner"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

function ChangeBatchForm() {
  const navigate = useNavigate()

  // fech faculty data from db
  const [loading, setLoading] = useState(false)

  const [currentBatch, setCurrentBatch] = useState([]) // currentBatch
  const [batchList, setBatchList] = useState([]) // batchList
  const [selectedBatch, setSelectedBatch] = useState([]) // batchList

  // for formatting the fetchData
  function formatBatch(doc) {
    const { batchName, createdAt } = doc.data()

    return { DocId: doc.id, batchName, createdAt }
  }

  useEffect(() => {
    // get data from firebase where selected semester
    const getData = async () => {
      try {
        const colRef = collection(db, `AcademicYear`)

        const querySnapshot = await getDocs(colRef)
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

    // fetch the temp semester value from firebase
    const getId = async () => {
      // console.log("fetch the temp id")
      try {
        const docRef = doc(db, "current", "doc")
        const docSnap = await getDoc(docRef)
        // console.log(`data` + docSnap.data())
        if (docSnap.exists()) {
          //console.log("Document data:", docSnap.data().semester)

          let withbatch = []

          // withbatch.push({ value: (docSnap.data().batch), label: ((docSnap.data().batch).slice(5)) })

          var result = docSnap.data().batch.map((item) => ({
            value: item,
            label: item.slice(5),
          }))

          setCurrentBatch(result)
          setSelectedBatch(result)

          // console.log(result) // eslint-disable-line
        } else {
          // doc.data() will be undefined in this case
          // console.log("No such document!")
        }

        await getData()
        setLoading(false)
      } catch (error) {
        toast.error(error.message)
        // console.log(error.message)
      }
    }

    getId()
  }, [])

  const canSave = Boolean(selectedBatch)

  const onSubmit = async (e) => {
    setLoading(true)

    e.preventDefault()

    var result = selectedBatch.map((item) => item.value)

    try {
      // Update in firestore
      const userRef = doc(db, "current", "doc")
      await updateDoc(userRef, {
        batch: result,
      })

      toast.success(`Current Batch updated`)
      navigate("/admin")

      setLoading(false)
    } catch (error) {
      // console.log(error)
      toast.error("Could not update profile details")
      setLoading(false)
    }
  }

  return (
    <div className="mb-6">
      {loading ? (
        <>
          <Spinner />
        </>
      ) : (
        <>
          <div className="mb-6">
            <div className="pb-2">
              <label
                htmlFor="currentBatch"
                className=" left-0 text-black  text-lg font-semibold "
              >
                Current batch
              </label>{" "}
            </div>

            <Select
              id="currentBatch"
              className="w-full
                              rounded
                              py-3
                              text-gray-800
                              required
                              outline-none
                              focus-visible:shadow-none
                              focus:border-primary text-xl "
              options={currentBatch}
              // onChange={(selectedOption) => { setSelectedBatch(selectedOption) }}
              value={currentBatch}
              isDisabled={true}
              isMulti
              isSearchable
            />
          </div>

          <form className="w-full">
            <div className="my-6">
              <div className="pb-2">
                <label
                  htmlFor="batchList"
                  className=" left-0 text-black  text-lg font-semibold "
                >
                  Select another batch
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
                isMulti
                isSearchable
                value={selectedBatch}
                onChange={(selectedOption) => {
                  setSelectedBatch(selectedOption)
                }}
              />
            </div>

            <div className="my-6">
              <button
                disabled={!canSave}
                type="submit"
                onClick={onSubmit}
                className={
                  canSave
                    ? "w-full text-gray-900  bg-green-400 rounded-lg border border-primary text-lg p-3 transition ease-in-out duration-500"
                    : "w-full  text-gray-400 bg-green-200 rounded-lg border border-primary text-lg p-3 transition ease-in-out duration-500"
                }
              >
                Update Batch
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
                    <tr className="even:bg-white odd:bg-gray-100" key={index}>
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
  )
}

export default ChangeBatchForm
