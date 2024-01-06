// import { createContext, useContext, useEffect, useState } from "react"
// import { useCollectionData } from "react-firebase-hooks/firestore"
// //firebase firestore
// import { db } from "../firebase.config"
// import {
//     getDocs, collection,
//     doc, getDoc,

// } from 'firebase/firestore'


// // toastify
// import { toast } from 'react-toastify'
// import 'react-toastify/dist/ReactToastify.css'



// const BatchCourseContext = createContext()

// export function BatchCourseContextProvider({ children }) {

//     // State
//     const [loading, setLoading] = useState(true)

//     const [courseData, setCourseData] = useState([])
//     const [batch, setBatch] = useState("sample")
//     const [courseQuery, setCourseQuery] = useState("batch2022-2023")





//     const fetchDoc = () => {

//         let batchtemp

//         const docRef = doc(db, "current", "doc")
//         getDoc(docRef).then(docSnap => {

//             if (docSnap.exists()) {
//                 console.log("Document data:", docSnap.data())
//                 // setBatch(docSnap.data())
//                 const temp = (docSnap.data())
//                 setBatch(temp.batch)
//                 batchtemp = (temp.batch)
//                 setCourseQuery(collection(db, `AcademicYear/batch2022-2023/children`))




//             }
//             else {
//                 // doc.data() will be undefined in this case
//                 console.log("No such document!")
//             }

//         })


//         //fetch Data from server
//         const fetchData = (state, query, transform = formatCourse) => {
//             const q = collection(db, `AcademicYear/batch2022-2023/children`)

//             getDocs(q).then(snapshot => {
//                 console.log(snapshot.docs)
//                 const results = snapshot.docs.map(transform)
//                 results.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds) // sort by createdAt
//                 console.log("results")
//                 console.log(results)
//                 state(results)
//                 setLoading(false)
//             }).catch(err => {
//                 toast.error("Data fetching failed")
//                 setLoading(false)
//             })
//         }

//         fetchData(setCourseData, courseQuery)


//         // course query


//     }









//     // for formatting the fetchData
//     function formatCourse(doc) {
//         const { CourseCode, NoOfStd, CourseImage, CourseName, CourseDepartment, CourseDescription, CourseFees, CourseFaculty, CourseDuration, createdAt, AcademicYear, Semester, scheduledCourseId, noOfStdLimit, } = doc.data()

//         return { DocId: doc.id, CourseCode, NoOfStd, CourseImage, CourseName, CourseDepartment, CourseDescription, CourseFees, CourseFaculty, CourseDuration, createdAt, AcademicYear, Semester, scheduledCourseId, noOfStdLimit, }
//     }




//     useEffect(() => {

//         fetchDoc()

//         // fetchData(setCourseData, courseQuery)

//         // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, [])














//     return (
//         <BatchCourseContext.Provider
//             value={{ loading, courseData, }}
//         >
//             {children}
//         </BatchCourseContext.Provider>
//     )

// }
// export function useBatchCourse() {
//     return useContext(BatchCourseContext)
// }