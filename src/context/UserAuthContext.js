import React, { createContext, useContext, useEffect, useState } from "react"
import {
  // createUserWithEmailAndPassword,
  // signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth"
import { auth, db } from "./../firebase.config"

//firebase firestore

import { getDocs, collection, doc, onSnapshot } from "firebase/firestore"

// toastify
import { toast } from "react-toastify"

const userAuthContext = createContext()

export function UserAuthContextProvider({ children }) {
  const [user, setUser] = useState(null)

  // State
  const [userLoading, setUserLoading] = useState(true)

  const [enrolledCourses, setEnrolledCourses] = useState([])
  const [cusaTechEnrolledCourses, setCusaTechEnrolledCourses] = useState([])

  const [isFullUserDetails, setIsFullUserDetails] = useState(false)
  const [userDetails, setUserDetails] = useState({})

  function logOut() {
    window.location.reload(false)
    return signOut(auth)
  }
  function googleSignIn() {
    const googleAuthProvider = new GoogleAuthProvider()
    return signInWithPopup(auth, googleAuthProvider)
  }

  const getData = async (uid) => {
    try {
      const colRefCdec = collection(
        db,
        `users/${uid}/enrolledCourses/cdec/cdecCourses`
      )
      const colRefCusaTech = collection(
        db,
        `users/${uid}/enrolledCourses/cusaTech/cusaTechCourses/`
      )

      onSnapshot(colRefCdec, (querySnapshot) => {
        let results = querySnapshot.docs.map(formatCourse)
        // console.log("results")
        // console.log(results)

        setEnrolledCourses((prev) => [...results])
        setUserLoading(false)
      })

      onSnapshot(colRefCusaTech, (querySnapshot) => {
        let results = querySnapshot.docs.map(formatCourse)
        // console.log("results")
        // console.log(results)
        setCusaTechEnrolledCourses((prev) => [...results])
        setUserLoading(false)
      })
      onSnapshot(doc(db, "users", uid), (doc) => {
        setUserDetails({ ...doc.data(), uid: uid })
      })
    } catch (error) {
      toast.error("Could not fetch data")
      // console.log(error)
    }
  }

  const {
    // Common for all users
    name,
    email,
    mobile,
    gender,
    dob,
    address,
    country,
    state,
    pincode,
    photo,
    linkedIn, //  Not Mandatory
    nonCusatStudent,
    cusatFlag,
    RecognizedInstitutionFlag,

    // For (Cusat && NON-CUSAT) students

    universityRegNo, // For Cusat students = ( Not Mandatory since 1st years students may not have this ID)
    department,
    course,
    semester,
    digiLockerId,
    abcId, // Academic Bank of Credits
    idCardImg,
    // For  NON-CUSAT students

    universityName,

    // For professional users only

    aadharNo,

    highestQualification,
  } = userDetails

  const userDetailsIsFull =
    Boolean(email) &&
    Boolean(name) &&
    Boolean(mobile) &&
    Boolean(gender) &&
    Boolean(dob) &&
    Boolean(address) &&
    Boolean(country) &&
    ((Boolean(department) &&
      Boolean(course) &&
      Boolean(semester) &&
      Boolean(digiLockerId) &&
      Boolean(abcId) &&
      cusatFlag) || // Cusat
      (nonCusatStudent &&
        Boolean(universityName) &&
        Boolean(universityRegNo) &&
        Boolean(department) &&
        Boolean(course) &&
        Boolean(semester) &&
        Boolean(digiLockerId) &&
        Boolean(abcId) &&
        (!RecognizedInstitutionFlag ||
          (RecognizedInstitutionFlag && Boolean(idCardImg)))) || // non Cusat students and  Recognized Institution students
      (!nonCusatStudent &&
        Boolean(aadharNo.toString().length === 12) &&
        Boolean(highestQualification))) // professional

  // for formatting the fetchData
  function formatCourse(doc) {
    return doc.id
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentuser) => {
      // console.log("Auth", currentuser)
      if (currentuser !== null) {
        currentuser.getIdTokenResult().then((idTokenResult) => {
          currentuser.cusatFlag =
            idTokenResult.claims.cusatFlag === undefined
              ? false
              : idTokenResult.claims.cusatFlag
          currentuser.admin =
            idTokenResult.claims.admin === undefined
              ? false
              : idTokenResult.claims.admin

          setUser(currentuser)
          // console.log(currentuser.cusatFlag)
          // console.log(currentuser.admin)
        })

        getData(currentuser.uid) // fetch enrolled  courses  list

        // console.log("getData(currentuser.uid) ")
        // fetch enrolled  courses  list
      }
    })

    if (user) {
      return () => {
        unsubscribe()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <userAuthContext.Provider
      value={{
        user,
        logOut,
        googleSignIn,
        userLoading,
        enrolledCourses,
        userDetails,
        cusaTechEnrolledCourses,
        userDetailsIsFull,
      }}
    >
      {children}
    </userAuthContext.Provider>
  )
}

export function useUserAuth() {
  return useContext(userAuthContext)
}
