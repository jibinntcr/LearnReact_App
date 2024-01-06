// fetch all docs  uid
// fetch uid user doc
// display grade dropdown
// update grade in course doc

import React, { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { db } from "../../../../firebase.config"
import {
  collection,
  query,
  orderBy,
  updateDoc,
  doc,
  onSnapshot,
  getDoc,
} from "firebase/firestore"
import { useParams, useNavigate } from "react-router-dom"

import Spinner from "../../../../components/Spinner/Spinner"
import RootLayout from "../../../../components/SideBar/RootLayout"

function GradingCusaTech() {
  const { batch, courseScheduleId } = useParams()
  // State
  const [loading, setLoading] = useState(true)
  const [course, setCourses] = useState([])
  const [courseDetails, setCourseDetails] = useState({})
  const [users, setUsers] = useState([])
  const [combine, setCombine] = useState([])
  const [afterGraded, setAfterGraded] = useState([])

  const navigate = useNavigate()

  // Fetch all docs enrolled user details
  const fetchData = async () => {
    window.scroll(0, 0)

    // collection ref
    const colRef = collection(
      db,
      `/AcademicYear/${batch}/cusaTech/${courseScheduleId}/students`
    )
    //console.log(`/AcademicYear/${batch}/cdec/${courseScheduleId}/students `)

    //query
    const q = query(colRef, orderBy("enrolledAt", "desc"))

    onSnapshot(q, (querySnapshot) => {
      setLoading(true)
      let results = querySnapshot.docs.map(formatCourse)
      // console.log("results")
      // console.log(results)
      setCourses((prev) => [...results])
      setLoading(false)
    })
  }

  // return array list of doc id
  const getUsersDocID = async (courseArg) => {
    const refs = []
    await courseArg?.map((item) => refs.push(item.userId))

    return refs
  }

  // fetch Course title
  const fetchTitle = async () => {
    const docRef = doc(db, `/AcademicYear/${batch}/cusaTech`, courseScheduleId)

    try {
      const docSnap = await getDoc(docRef)
      // console.table(docSnap.data())
      setCourseDetails(docSnap.data())
    } catch (error) {
      // console.log(error)
    }
  }

  useEffect(() => {
    fetchData()

    fetchTitle()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const fetchUsers = async () => {
      const arrayList = await getUsersDocID(course)

      // console.log(arrayList)
      // console.log("arrayList")

      arrayList.map((item) => fetchSingleDoc(item))

      const roots = await arrayUniqueByKey(users, "DocId")

      // console.log(roots)
      // console.log("roots")

      combineObj()
    }

    fetchUsers()
    // console.log("users")

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [course])

  useEffect(() => {
    combineObj()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [users, course])

  // for formatting the fetchData
  function formatCourse(doc) {
    const { userId, grade, mark, remark, credit, gradestatus, gradepoint } =
      doc.data()

    return { userId, grade, mark, remark, credit, gradestatus, gradepoint }
  }

  // for formatting the fetchData
  function formatUser(doc) {
    const { cusatFlag, email, name, universityRegNo, abcId } = doc.data()

    return { DocId: doc.id, cusatFlag, email, name, universityRegNo, abcId }
  }

  const fetchSingleDoc = async (docId) => {
    if (users.find((e) => e.DocId === docId)) {
      // do nothing
    } else {
      const docRef = doc(db, "users", docId)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        // console.log(formatUser(docSnap))

        if (users.find((e) => e.DocId === docSnap.id)) {
          // do nothing
        } else {
          setUsers((prev) => [...prev, formatUser(docSnap)])
        }
      } else {
        // doc.data() will be undefined in this case
        // console.log("No such document!")
      }
    }
  }

  // combine objects course && users  the fetchData
  function combineObj() {
    //https://stackoverflow.com/questions/46849286/merge-two-array-of-objects-based-on-a-key

    const arr1 = course
    const arr2 = users

    let merged = []

    for (let i = 0; i < arr1.length; i++) {
      merged.push({
        ...arr1[i],
        ...arr2.find((itmInner) => itmInner.DocId === arr1[i].userId),
      })
    }

    merged.sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0))

    setCombine(merged)
    setAfterGraded(JSON.parse(JSON.stringify(merged)))
  }

  // https://stackoverflow.com/questions/15125920/how-to-get-distinct-values-from-an-array-of-objects-in-javascript#:~:text=return%20object%20with%20all%20properties%20unique%20by%20key

  function arrayUniqueByKey(array, key) {
    const arrayUnique = [
      ...new Map(array.map((item) => [item[key], item])).values(),
    ]

    return new Promise((resolve) => {
      resolve(arrayUnique)
    })
  }

  // grade change

  const gradeChange = (e) => {
    const grade = e.target.value
    const userId = e.target.id
    // console.log(userId)
    // console.log(afterGraded[0])

    let temp = JSON.parse(JSON.stringify(afterGraded))

    const index = temp.findIndex((object) => {
      return object.userId === userId
    })

    temp[index].gradestatus = grade
    setAfterGraded(temp)
  }

  const UpdateArray = (idName, userId, value) => {
    let temp = JSON.parse(JSON.stringify(afterGraded))
    const index = temp.findIndex((object) => {
      return object.userId === userId
    })

    temp[index][idName] = value

    // console.log("Updated Array:", temp)
    // console.log("Name:", idName)
    setAfterGraded(temp)
  }

  // const onMutate = (e) => {
  //     const value = e.target.value;
  //     const userId = e.target.id;
  //     const idName = e.target.name;

  //     let sanitizedValue = value;

  //     if (idName === "mark" && value < 0) {
  //        sanitizedValue = Math.abs(value);
  //        toast.error("Mark Must Greater Than 0");
  //        return ;
  //     }
  //     UpdateArray(idName, userId, sanitizedValue);
  //   };

  const onMutate = (e) => {
    const value = e.target.value
    const userId = e.target.id
    const idName = e.target.name

    const pattern = /[^a-zA-Z0-9\s]/g

    if (idName === "mark" || idName === "gradepoint") {
      const numericValue = parseFloat(value)

      if (isNaN(numericValue) || numericValue < 0) {
        return
      }
      let sanitizedValue = value.replace(pattern, "")
      UpdateArray(idName, userId, sanitizedValue)
    } else {
      const sanitizedValue = value.replace(pattern, "")
      UpdateArray(idName, userId, sanitizedValue)
    }
  }

  const submit = async () => {
    setLoading(true)

    const arr1 = combine
    const arr2 = afterGraded

    let error1 = ""
    let noChangeFlag = false

    for (let i = 0; i < arr1.length; i++) {
      const docid = arr1[i].userId
      const grade1 = arr1[i].grade
      const gradestatus1 = arr1[i].gradestatus
      const gradeponint1 = arr1[i].gradepoint
      const mark1 = arr1[i].mark
      const credit1 = arr1[i].credit
      const remark1 = arr1[i].remark
      let secondObj = arr2.find((itmInner) => itmInner.DocId === docid)
      const gradestatus2 = secondObj.gradestatus
      const grade2 = secondObj.grade
      const gradeponint2 = Number(secondObj.gradepoint)
      const mark2 = Number(secondObj.mark)
      const credit2 = secondObj.credit
      const remark2 = secondObj.remark

      if (
        grade1 !== grade2 ||
        gradestatus1 !== gradestatus2 ||
        gradeponint1 !== gradeponint2 ||
        mark1 !== mark2 ||
        credit1 !== credit2 ||
        remark1 !== remark2
      ) {
        // console.log(`${grade1} !== ${grade2} || ${gradestatus1} !== ${gradestatus2}) ||
        // ${gradeponint1} !== ${gradeponint2} ||
        // ${mark1} !== ${mark2} ||
        // ${credit1} !== ${credit2} ||
        // ${remark1} !== ${remark2}`)
        const docRef = doc(
          db,
          `/AcademicYear/${batch}/cusaTech/${courseScheduleId}/students/${secondObj.DocId}`
        )

        try {
          await updateDoc(docRef, {
            gradestatus: gradestatus2,
            grade: grade2,
            mark: mark2,
            gradepoint: gradeponint2,
            credit: credit2,
            remark: remark2,
          })
        } catch (error) {
          error1 = error
          // toast.error("something went wrong")
        }
        noChangeFlag = true
      }
    }
    if (!noChangeFlag) {
      toast.warning("No change made")
    } else {
      if (error1 === "") {
        toast.success(" Updated successfully ")
        navigate("/cusatech/admin")
      } else {
        toast.error("something went wrong")
      }
    }

    setLoading(false)
  }

  return (
    <RootLayout>
      {loading ? (
        <Spinner />
      ) : course && course.length > 0 ? (
        <div className="p-5 mt-10  ">
          {courseDetails && (
            <div className="w-full">
              <h1 className="text-3xl  text-center font-semibold mb-6">
                {courseDetails.CourseName}
              </h1>
              <p className="text-xl child:font-serif  text-left font-semibold mb-6">
                <ul className="mt-2">
                  <li>Course Code: {courseDetails.CourseCode}</li>
                  <li className="mt-2">
                    Total Students : {courseDetails.NoOfStd}
                  </li>
                  <li className="mt-2">
                    Cusat Students : {courseDetails.noOfStdCusat}
                  </li>
                  <li className="mt-2">
                    Non Cusat Students : {courseDetails.noOfStdNonCusat}
                  </li>
                </ul>
              </p>
            </div>
          )}

          <div className="overflow-auto rounded-lg shadow hidden md:block">
            <table className="w-full ">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr className="">
                  <th className="w-20 p-3 text-sm font-semibold tracking-wide text-left">
                    No.
                  </th>
                  <th className=" w-24 px-3 text-sm font-semibold tracking-wide text-left">
                    Cusat/
                    <br />
                    Non Cusat
                  </th>
                  <th className="p-3 text-sm font-semibold tracking-wide text-left">
                    Name
                  </th>
                  <th className="p-3 text-sm font-semibold tracking-wide text-left">
                    Email
                  </th>
                  <th className="p-3 text-sm font-semibold tracking-wide text-left">
                    ABC ID
                  </th>
                  <th className="p-3 text-sm font-semibold tracking-wide text-left">
                    University Register No
                  </th>
                  <th className="w-44 p-3 text-sm font-semibold tracking-wide text-left">
                    Mark{" "}
                    {courseDetails?.totalMark &&
                      " / " + courseDetails?.totalMark}
                  </th>
                  <th className="w-44 p-3 text-sm font-semibold tracking-wide text-left">
                    Credit
                  </th>
                  <th className="w-44 p-3 text-sm font-semibold tracking-wide text-left">
                    Grade
                  </th>
                  <th className="w-44 p-3 text-sm font-semibold tracking-wide text-left">
                    Grade Point
                  </th>
                  <th className="w-44 p-3 text-sm font-semibold tracking-wide text-left">
                    Grade Status
                  </th>
                  <th className="w-44 p-3 text-sm font-semibold tracking-wide text-left">
                    Remarks
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {afterGraded &&
                  afterGraded.map((item, index) => (
                    <tr key={index} className="even:bg-white odd:bg-gray-100">
                      <td className="p-3 text-sm whitespace-nowrap text-blue-500">
                        {++index}
                      </td>
                      <td className="p-3  w-24 text-sm text-gray-700 whitespace-nowrap">
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
                        {item.name}
                      </td>
                      <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                        {item.email}
                      </td>
                      <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                        {item.abcId ? item.abcId : "Not Available"}
                      </td>
                      <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                        {" "}
                        {item.cusatFlag ? (
                          item.universityRegNo ? (
                            item.universityRegNo
                          ) : (
                            "Not Available"
                          )
                        ) : (
                          <span className="p-1.5 text-xs font-medium uppercase tracking-wider text-blue-800 bg-blue-200 rounded-lg bg-opacity-50">
                            NON Cusat
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                        <input
                          id={item.userId}
                          name="mark"
                          className="mark"
                          type="number"
                          value={item.mark}
                          onChange={onMutate}
                          // placeholder="Mark Of Student"
                        />
                      </td>
                      <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                        <input
                          id={item.userId}
                          name="credit"
                          className="credit"
                          type="text"
                          value={item.credit}
                          onChange={onMutate}
                          //placeholder="credit"
                        />
                      </td>
                      <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                        <input
                          id={item.userId}
                          name="grade"
                          className="grade"
                          type="text"
                          value={item.grade}
                          onChange={onMutate}
                          //placeholder="credit"
                        />
                      </td>
                      <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                        <input
                          id={item.userId}
                          name="gradepoint"
                          className="gradepoint"
                          type="text"
                          value={item.gradepoint}
                          onChange={onMutate}
                          //placeholder="credit"
                        />
                      </td>
                      <td className=" w-44 p-3 text-sm text-gray-700 whitespace-nowrap">
                        <select
                          value={item.gradestatus}
                          className="text-center font-semibold"
                          id={item.userId}
                          onChange={(e) => gradeChange(e)}
                        >
                          <option value="Not Completed">Not Completed</option>
                          <option value="completed">Completed</option>
                          <option value="Failed">Failed</option>
                        </select>
                      </td>

                      <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                        <textarea
                          rows="4"
                          className="
                                                w-full
                                                rounded
                                                p-3
                                                text-gray-800
                                                border-gray-500
                                                outline-none
                                                focus-visible:shadow-none
                                                focus:border-primary
                                                "
                          name="remark"
                          id={item.userId}
                          value={item.remark}
                          onChange={onMutate}
                        />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end mt-8 p-4">
            <button
              onClick={submit}
              className="bg-transparent hover:bg-green-500 text-green-700 font-semibold hover:text-white py-2 px-4 border border-green-500 hover:border-transparent rounded-full"
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <div>
          {courseDetails && (
            <div className="w-full ">
              <h1 className="text-3xl  text-center font-semibold mb-6 mt-16">
                {courseDetails.CourseName}
              </h1>

              <p className="text-xl child:font-serif  text-left font-semibold mb-6">
                <ul className="ml-4 mt-2">
                  <li>Course Code: {courseDetails.CourseCode}</li>
                </ul>
              </p>
            </div>
          )}
          <h1 className="text-5xl font-serif font-semibold mb-6 flex justify-center items-center h-screen w-full  -mt-20">
            Records empty
          </h1>
        </div>
      )}
    </RootLayout>
  )
}

export default GradingCusaTech
