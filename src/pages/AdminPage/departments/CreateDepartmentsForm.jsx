import React, { useState, useEffect } from "react"

import { db } from "../../../firebase.config"
import {
  doc,
  arrayUnion,
  updateDoc,
  addDoc,
  collection,
  getDoc,
} from "firebase/firestore"

import { useNavigate, useLocation } from "react-router-dom"
import { toast } from "react-toastify"

//components
import Required from "../../../components/Required Icon/Required"
import Spinner from "../../../components/Spinner/Spinner"

function CreateDepartmentsForm() {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)

  // State
  const [name, setName] = useState("")
  const [departmentsList, setDepartmentsList] = useState([])
  // const [list, setList] = useState([])

  const docRef = doc(db, "departments", "list")

  useEffect(() => {
    window.scroll(0, 0)
  }, [])

  const canSave = Boolean(name)
  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const formData = {
      name: name,
      courses: [],
    }

    try {
      await addDoc(collection(db, "departments"), formData)
      await updateDoc(docRef, {
        names: arrayUnion(name),
      })

      toast.success(name + " Department Created Successfully")
      setLoading(false)

      if (pathname.toLowerCase().includes("cusatech")) {
        navigate("/cusatech/admin")
      } else {
        navigate("/admin")
      }
    } catch (error) {
      toast.error(error.message)
      setLoading(false)
    }

    setLoading(false)

    // pending also check array contain the name
  }

  const fetchDepartments = async () => {
    const docRef = doc(db, "departments", "list")

    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const array = docSnap.data().names

      setDepartmentsList(array)
      setLoading(false)
    } else {
      // doc.data() will be undefined in this case
      toast.error("Something went wrong !")
    }
  }

  useEffect(() => {
    fetchDepartments()
  }, [])

  return (
    <div className="">
      {loading ? (
        <>
          <Spinner />
        </>
      ) : (
        <>
          <form className="w-full">
            {/* name */}
            <div className="mb-6">
              <div className="pb-2">
                <label htmlFor="name" className=" left-0  text-gray-600  ">
                  Department / School name
                  <Required />
                </label>
              </div>

              <input
                required
                type="text"
                placeholder="Department / School name "
                className=" w-full rounded p-3 text-gray-800 border-gray-500 outline-none focus-visible:shadow-none focus:border-primary"
                name="name"
                id="name"
                onChange={(e) => {
                  setName(e.target.value)
                }}
                value={name}
              />
            </div>

            {/* submit */}
            <div>
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
                Create Department
              </button>
            </div>
          </form>
          <div className="p-5  ">
            <h1 className="text-xl text-center font-semibold mb-2">
              {" "}
              Department List <br />{" "}
              <p className="text-right mb-4 mr-10 text-sm text-gray-600">
                No of Department : {departmentsList?.length}
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
                      Department name
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {departmentsList?.map((item, index) => (
                    <tr className="even:bg-white odd:bg-gray-100" key={index}>
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
  )
}

export default CreateDepartmentsForm
