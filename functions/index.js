const functions = require("firebase-functions")

const admin = require("firebase-admin")

admin.initializeApp()

// Using Cloud Firestore
admin.firestore.FieldValue.serverTimestamp()

// auth trigger (new user signup) // admin
exports.newUserSignUp = functions.auth.user().onCreate((user) => {
  if (user.email === "msn@cusat.ac.in") {
    return admin
      .firestore()
      .collection("users")
      .doc(user.uid)
      .set({
        name: user.displayName,
        email: user.email,

        admin: true,
      })
      .then(() => {
        return admin.auth().setCustomUserClaims(user.uid, {
          admin: true,
        })
      })
      .catch((err) => {
        return err
      })
  }

  // for background triggers you must return a value/promise

  const cusatemail = user.email.slice(-11)
  if (cusatemail === "cusat.ac.in") {
    return admin
      .firestore()
      .collection("users")
      .doc(user.uid)
      .set({
        name: user.displayName,
        email: user.email,
        // moblie: user.phoneNumber,
        cusatFlag: true,
      })
      .then(() => {
        return admin.auth().setCustomUserClaims(user.uid, {
          cusatFlag: true,
        })
      })
      .catch((err) => {
        return err
      })
  } else {
    return admin
      .firestore()
      .collection("users")
      .doc(user.uid)
      .set({
        name: user.displayName,
        email: user.email,
        cusatFlag: false,
      })
      .then(() => {
        return admin.auth().setCustomUserClaims(user.uid, {
          cusatFlag: false,
        })
      })
      .catch((err) => {
        return err
      })
  }
})

// auth trigger (user deleted)
exports.userDeleted = functions.auth.user().onDelete((user) => {
  const doc = admin.firestore().collection("users").doc(user.uid)
  return doc.delete()
})

// exports.addDefaultUserRole = functions.auth.user().onCreate((user) => {

//     let uid = user.uid

//     //add custom claims
//     return admin.auth().setCustomUserClaims(uid, {
//         isAdmin: true
//     })
//         .then(() => {
//             //Interesting to note: we need to re-fetch the userRecord, as the user variable **does not** hold the claim
//             return admin.auth().getUser(uid)
//         })
//         .then(userRecord => {
//             console.log(uid)
//             console.log(userRecord.customClaims.isAdmin)
//             return null
//         })
// })

// http callable function
exports.sayHello = functions.https.onCall((data, context) => {
  if (context.auth !== undefined) {
    return `Hello ${data.name} , ${context.auth}`
  } else {
    return `Hello`
  }
})

// http callable function (Enroll Courses - cdec)

exports.enrollCourseCdec = functions.https.onCall(async (data, context) => {
  let errorReturn = null

  // check request is made by logged in user
  if (context.auth !== undefined) {
    const batch = data.batch || "error"
    const courseDocid = data.courseDocid || "error"
    const scheduleCourseDocid = data.scheduleCourseDocid || "error"
    // const courseName = data.courseName || "error"
    const uid = context.auth.uid
    const cusatFlag = context.auth.token.cusatFlag

    const courseRef = admin
      .firestore()
      .collection("AcademicYear")
      .doc(batch)
      .collection("cdec")
      .doc(scheduleCourseDocid)
      .collection("students")
      .doc(uid)
    const userRef = admin
      .firestore()
      .collection("users")
      .doc(uid)
      .collection("enrolledCourses")
      .doc("cdec")
      .collection("cdecCourses")
      .doc(scheduleCourseDocid)
    const scheduleCourseRef = admin
      .firestore()
      .collection("AcademicYear")
      .doc(batch)
      .collection("cdec")
      .doc(scheduleCourseDocid)
    const enrollCollectionRef = admin.firestore().collection("enroll")
    const userDocRef = admin.firestore().collection("users").doc(uid)
    const batchDocRef = admin.firestore().collection("AcademicYear").doc(batch)

    if (
      batch !== "error" ||
      courseDocid !== "error" ||
      courseDocid !== "error" ||
      scheduleCourseDocid !== "error"
    ) {
      //context.auth.token.cusatFlag === true &&

      //Course📕 doc
      const scheduleCourse = await scheduleCourseRef.get()
      const userDoc = await userDocRef.get()
      const batchDoc = await batchDocRef.get()
      const CourseFacultyName = await fetchFileNames(
        scheduleCourse.data().CourseFaculty
      )

      console.log(batchDoc)

      // check if user is already enrolled
      if (userRef.exists) {
        throw new functions.https.HttpsError(
          "failed-precondition",
          "You are already enrolled"
        )
      } else {
        // check if user is a cusat student
        if (cusatFlag === true) {
          // check if enrollment cusat students for this course is  full
          if (
            scheduleCourse.data().noOfStdLimitCusat >=
            scheduleCourse.data().noOfStdCusat
          ) {
            await new Promise(async (resolve, reject) => {
              try {
                // add doc into course
                const docSnap1 = await courseRef.set({
                  userId: uid,
                  grade: "N",
                  gradepoint: 0,
                  gradestatus: "Not Completed",
                  mark: 0,
                  remark: "",
                  credit: "N",
                  courseDocid: courseDocid,
                  scheduleCourseDocid: scheduleCourseDocid,
                  batch: batch,
                  enrolledAt: admin.firestore.FieldValue.serverTimestamp(),
                })

                // add doc into user
                const docSnap = await userRef.set({
                  courseBy: "cdec",
                  batch: batch,
                  courseDocid: courseDocid,
                  scheduleCourseDocid: scheduleCourseDocid,

                  createdAt: admin.firestore.FieldValue.serverTimestamp(),
                  test: ` batch = ${batch} , courseDocid = ${courseDocid} , scheduleCourseDocid = ${scheduleCourseDocid} , uid = ${uid}`,
                })

                // add doc into enroll
                const docSnap3 = await enrollCollectionRef.add({
                  cusatFlag: true,
                  courseBy: "cdec",
                  batch: batch,
                  templateId: scheduleCourse.data().templateId,
                  scheduleId: scheduleCourseDocid,
                  userName: userDoc.data().name,
                  userEmail: userDoc.data().email,
                  userId: uid,
                  courseCode: scheduleCourse.data().CourseCode,
                  courseName: scheduleCourse.data().CourseName,
                  cash: 0,
                  totalCash: 0,
                  gst: "0%",
                  createdAt: admin.firestore.FieldValue.serverTimestamp(),
                  FacultyId: scheduleCourse.data().CourseFaculty,
                  FacultyName: CourseFacultyName,
                  department: scheduleCourse.data().CourseDepartment,
                  test: ` batch = ${batch} , courseDocid = ${courseDocid} ,department ${
                    scheduleCourse.data().CourseDepartment
                  } , scheduleCourseDocid = ${scheduleCourseDocid} , uid = ${uid}`,
                })

                // update enrolled count in course doc
                const updateCount = await scheduleCourseRef.update({
                  noOfStdCusat: admin.firestore.FieldValue.increment(1),
                  NoOfStd: admin.firestore.FieldValue.increment(1),
                })

                const updateCountBatchDoc = await batchDocRef.update({
                  noOfStd: {
                    noncusat: batchDoc.data().noOfStd.noncusat,
                    cusat: admin.firestore.FieldValue.increment(1),
                    total: admin.firestore.FieldValue.increment(1),
                  },
                })

                console.log(docSnap)
                console.log(docSnap1)
                console.log(docSnap3)
                console.log(updateCount)
                console.log(updateCountBatchDoc)

                resolve("sai")
                // reject(errorReturn = new functions.https.HttpsError('failed-precondition', ""))
              } catch (error) {
                errorReturn = error.message
                console.log(error.message)
              }
            })
              .then(() => {
                return "success"
              })
              .catch((error) => {
                errorReturn = error.message
                console.log(error.message)
              })
          } else {
            throw new functions.https.HttpsError(
              "failed-precondition",
              "Enrollment is closed"
            )
          }
        } else {
          // enroll Courses for non cusat students

          // check if enrollment non cusat students   for this course is  full
          if (
            scheduleCourse.data().noOfStdLimitNonCusat >=
            scheduleCourse.data().noOfStdNonCusat
          ) {
            // 💲 payment gateway integration
            throw new functions.https.HttpsError(
              "failed-precondition",
              "You are not a CUSAT student"
            )
          } else {
            throw new functions.https.HttpsError(
              "failed-precondition",
              "Enrollment is closed"
            )
          }
        }

        if (errorReturn) {
          throw new functions.https.HttpsError(
            "failed-precondition",
            errorReturn
          )
        }

        return ` batch = ${batch} , courseDocid = ${courseDocid} , scheduleCourseDocid = ${scheduleCourseDocid} , uid = ${uid}`
      }
    }
  } else {
    if (!context.auth) {
      // Throwing an HttpsError so that the client gets the error details.
      throw new functions.https.HttpsError(
        "failed-precondition",
        "Unauthenticated"
      )
    }
  }
})

// http callable function (Enroll Courses - cdec)

exports.enrollCourseCusatech = functions.https.onCall(async (data, context) => {
  let errorReturn = null

  // check request is made by logged in user
  if (context.auth !== undefined) {
    const batch = data.batch || "error"
    const courseDocid = data.courseDocid || "error"
    const scheduleCourseDocid = data.scheduleCourseDocid || "error"
    // const courseName = data.courseName || "error"
    const uid = context.auth.uid
    const cusatFlag = context.auth.token.cusatFlag

    const courseRef = admin
      .firestore()
      .collection("AcademicYear")
      .doc(batch)
      .collection("cusaTech")
      .doc(scheduleCourseDocid)
      .collection("students")
      .doc(uid)
    const userRef = admin
      .firestore()
      .collection("users")
      .doc(uid)
      .collection("enrolledCourses")
      .doc("cusaTech")
      .collection("cusaTechCourses")
      .doc(scheduleCourseDocid)
    const scheduleCourseRef = admin
      .firestore()
      .collection("AcademicYear")
      .doc(batch)
      .collection("cusaTech")
      .doc(scheduleCourseDocid)

    const enrollCollectionRef = admin.firestore().collection("enroll")
    const userDocRef = admin.firestore().collection("users").doc(uid)
    const batchDocRef = admin.firestore().collection("AcademicYear").doc(batch)

    if (
      batch !== "error" ||
      courseDocid !== "error" ||
      courseDocid !== "error" ||
      scheduleCourseDocid !== "error"
    ) {
      //context.auth.token.cusatFlag === true &&

      //Course📕 doc
      const scheduleCourse = await scheduleCourseRef.get()
      const userDoc = await userDocRef.get()
      const batchDoc = await batchDocRef.get()
      const CourseFacultyName = await fetchFileNames(
        scheduleCourse.data().CourseFaculty
      )
      console.log(scheduleCourse.data().CourseFaculty)

      // check if user is already enrolled
      if (userRef.exists) {
        throw new functions.https.HttpsError(
          "failed-precondition",
          "You are already enrolled"
        )
      } else {
        // check if user is a cusat student
        if (cusatFlag === true) {
          // check if enrollment cusat students for this course is  full
          if (
            scheduleCourse.data().noOfStdLimitCusat >=
            scheduleCourse.data().noOfStdCusat
          ) {
            await new Promise(async (resolve, reject) => {
              try {
                // add doc into course
                const docSnap1 = await courseRef.set({
                  userId: uid,
                  grade: "N",
                  gradepoint: 0,
                  gradestatus: "Not Completed",
                  mark: 0,
                  remark: "",
                  credit: "N",
                  courseDocid: courseDocid,
                  scheduleCourseDocid: scheduleCourseDocid,
                  batch: batch,
                  enrolledAt: admin.firestore.FieldValue.serverTimestamp(),
                })

                // add doc into user
                const docSnap = await userRef.set({
                  batch: batch,
                  courseBy: "cusaTech",
                  courseDocid: courseDocid,
                  scheduleCourseDocid: scheduleCourseDocid,
                  createdAt: admin.firestore.FieldValue.serverTimestamp(),
                  test: ` batch = ${batch} , courseDocid = ${courseDocid} , scheduleCourseDocid = ${scheduleCourseDocid} , uid = ${uid}`,
                })

                // add doc into enroll
                const docSnap3 = await enrollCollectionRef.add({
                  cusatFlag: true,
                  courseBy: "cusaTech",
                  batch: batch,
                  templateId: scheduleCourse.data().templateId,
                  scheduleId: scheduleCourseDocid,
                  userName: userDoc.data().name,
                  userEmail: userDoc.data().email,
                  userId: uid,
                  courseCode: scheduleCourse.data().CourseCode,
                  courseName: scheduleCourse.data().CourseName,
                  cash: 0,
                  totalCash: 0,
                  gst: "0%",
                  createdAt: admin.firestore.FieldValue.serverTimestamp(),
                  FacultyId: scheduleCourse.data().CourseFaculty,
                  FacultyName: CourseFacultyName,
                  department: scheduleCourse.data().CourseDepartment,

                  test: ` batch = ${batch} , courseDocid = ${courseDocid} ,,department ${
                    scheduleCourse.data().CourseDepartment
                  }, scheduleCourseDocid = ${scheduleCourseDocid} , uid = ${uid}`,
                })

                // update enrolled count in course doc
                const updateCount = await scheduleCourseRef.update({
                  noOfStdCusat: admin.firestore.FieldValue.increment(1),
                  NoOfStd: admin.firestore.FieldValue.increment(1),
                })

                const updateCountBatchDoc = await batchDocRef.update({
                  noOfStd: {
                    noncusat: batchDoc.data().noOfStd.noncusat,
                    cusat: admin.firestore.FieldValue.increment(1),
                    total: admin.firestore.FieldValue.increment(1),
                  },
                })

                console.log(docSnap)
                console.log(docSnap1)
                console.log(docSnap3)
                console.log(updateCount)
                console.log(updateCountBatchDoc)

                resolve("sai")
                // reject(errorReturn = new functions.https.HttpsError('failed-precondition', ""))
              } catch (error) {
                errorReturn = error.message
                console.log(error.message)
              }
            })
              .then(() => {
                return "success"
              })
              .catch((error) => {
                errorReturn = error.message
              })
          } else {
            throw new functions.https.HttpsError(
              "failed-precondition",
              "Enrollment is closed"
            )
          }
        } else {
          // enroll Courses for non cusat students

          // check if enrollment non cusat students   for this course is  full
          if (
            scheduleCourse.data().noOfStdLimitNonCusat >=
            scheduleCourse.data().noOfStdNonCusat
          ) {
            // 💲 payment gateway integration
            throw new functions.https.HttpsError(
              "failed-precondition",
              "You are not a CUSAT student"
            )
          } else {
            throw new functions.https.HttpsError(
              "failed-precondition",
              "Enrollment is closed"
            )
          }
        }

        if (errorReturn) {
          throw new functions.https.HttpsError(
            "failed-precondition",
            errorReturn
          )
        }

        return ` batch = ${batch} , courseDocid = ${courseDocid} , scheduleCourseDocid = ${scheduleCourseDocid} , uid = ${uid}`
      }
    }
  } else {
    if (!context.auth) {
      // Throwing an HttpsError so that the client gets the error details.
      throw new functions.https.HttpsError(
        "failed-precondition",
        "Unauthenticated"
      )
    }
  }
})

//payment
// full price - cdec
exports.paymentFullCdec = functions.https.onCall(async (data, context) => {
  let errorReturn = null

  // check request is made by logged in user
  if (context.auth !== undefined) {
    const batch = data.batch || "error"
    const courseDocid = data.courseDocid || "error"
    const scheduleCourseDocid = data.scheduleCourseDocid || "error"
    const paymentImage = data.paymentImage || "error"

    const uid = context.auth.uid
    const pendingCollectionRef = admin.firestore().collection("enrollPending")

    const scheduleCourseRef = admin
      .firestore()
      .collection("AcademicYear")
      .doc(batch)
      .collection("cdec")
      .doc(scheduleCourseDocid)
    const userDocRef = admin.firestore().collection("users").doc(uid)
    const gstDocRef = admin.firestore().collection("current").doc("doc")

    if (
      batch !== "error" ||
      courseDocid !== "error" ||
      courseDocid !== "error" ||
      scheduleCourseDocid !== "error" ||
      paymentImage !== "error"
    ) {
      //context.auth.token.cusatFlag === true &&

      //Course📕 doc
      const scheduleCourse = await scheduleCourseRef.get()
      const userDoc = await userDocRef.get()
      const gstDoc = await gstDocRef.get()
      const gst = gstDoc.data().GstValue

      // check if user is already enrolled
      if (scheduleCourse.data().pending) {
        if (scheduleCourse.data().pending.includes(uid)) {
          throw new functions.https.HttpsError(
            "failed-precondition",
            "You are already enrolled"
          )
        }
      } else {
        if (
          scheduleCourse.data().noOfStdLimitNonCusat >=
          scheduleCourse.data().noOfStdNonCusat
        ) {
          await new Promise(async (resolve, reject) => {
            try {
              // add doc into user
              const docSnap = await pendingCollectionRef.add({
                courseBy: "cdec",
                batch: batch,
                category: "fullPrice",
                courseDocid: courseDocid,
                scheduleCourseDocid: scheduleCourseDocid,
                userName: userDoc.data().name,
                userEmail: userDoc.data().email,
                userMobile: userDoc.data().mobile,
                courseCode: scheduleCourse.data().CourseCode,
                courseName: scheduleCourse.data().CourseName,
                cash: scheduleCourse.data().CourseFees,
                totalCash:
                  scheduleCourse.data().CourseFees +
                  (scheduleCourse.data().CourseFees * gst) / 100,
                gst: `${gst}%`,

                paymentImage: paymentImage,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                uid: uid,
              })
              const updatePending = await scheduleCourseRef.update({
                pending: admin.firestore.FieldValue.arrayUnion(uid),
              })
              console.log(updatePending)
              console.log(docSnap)

              resolve("sai")
            } catch (error) {
              errorReturn = error.message
              console.log(error.message)
            }
          })
            .then(() => {
              return "success"
            })
            .catch((error) => {
              errorReturn = error.message
              console.log(error.message)
            })
        } else {
          // no of limit exceeded
          throw new functions.https.HttpsError(
            "failed-precondition",
            "no of limit exceeded"
          )
        }

        if (errorReturn) {
          throw new functions.https.HttpsError(
            "failed-precondition",
            errorReturn
          )
        }

        return ` batch = ${batch} , courseDocid = ${courseDocid} , scheduleCourseDocid = ${scheduleCourseDocid} , uid = ${uid}`
      }
    } else {
      throw new functions.https.HttpsError(
        "failed-precondition",
        "Data parameters are wrong."
      )
    }
  } else {
    if (!context.auth) {
      // Throwing an HttpsError so that the client gets the error details.
      throw new functions.https.HttpsError(
        "failed-precondition",
        "Unauthenticated"
      )
    }
  }
})
// full price - cusatech

exports.paymentFullCusatech = functions.https.onCall(async (data, context) => {
  let errorReturn = null

  // check request is made by logged in user
  if (context.auth !== undefined) {
    const batch = data.batch || "error"
    const courseDocid = data.courseDocid || "error"
    const scheduleCourseDocid = data.scheduleCourseDocid || "error"
    const paymentImage = data.paymentImage || "error"

    const uid = context.auth.uid
    const pendingCollectionRef = admin.firestore().collection("enrollPending")

    const scheduleCourseRef = admin
      .firestore()
      .collection("AcademicYear")
      .doc(batch)
      .collection("cusaTech")
      .doc(scheduleCourseDocid)
    const userDocRef = admin.firestore().collection("users").doc(uid)
    const gstDocRef = admin.firestore().collection("current").doc("doc")

    if (
      batch !== "error" ||
      courseDocid !== "error" ||
      courseDocid !== "error" ||
      scheduleCourseDocid !== "error" ||
      paymentImage !== "error"
    ) {
      //context.auth.token.cusatFlag === true &&

      //Course📕 doc
      const scheduleCourse = await scheduleCourseRef.get()
      const userDoc = await userDocRef.get()
      const gstDoc = await gstDocRef.get()
      const gst = gstDoc.data().GstValue

      // check if user is already enrolled
      if (scheduleCourse.data().pending) {
        if (scheduleCourse.data().pending.includes(uid)) {
          throw new functions.https.HttpsError(
            "failed-precondition",
            "You are already enrolled"
          )
        }
      } else {
        if (
          scheduleCourse.data().noOfStdLimitNonCusat >=
          scheduleCourse.data().noOfStdNonCusat
        ) {
          await new Promise(async (resolve, reject) => {
            try {
              // add doc into user
              const docSnap = await pendingCollectionRef.add({
                courseBy: "cusatech",
                batch: batch,
                category: "fullPrice",
                courseDocid: courseDocid,
                scheduleCourseDocid: scheduleCourseDocid,
                userName: userDoc.data().name,
                userEmail: userDoc.data().email,
                userMobile: userDoc.data().mobile,
                courseCode: scheduleCourse.data().CourseCode,
                courseName: scheduleCourse.data().CourseName,
                cash: scheduleCourse.data().CourseFees,
                totalCash:
                  scheduleCourse.data().CourseFees +
                  (scheduleCourse.data().CourseFees * gst) / 100,
                gst: `${gst}%`,

                paymentImage: paymentImage,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                uid: uid,
              })
              const updatePending = await scheduleCourseRef.update({
                pending: admin.firestore.FieldValue.arrayUnion(uid),
              })
              console.log(updatePending)
              console.log(docSnap)

              resolve("sai")
            } catch (error) {
              errorReturn = error.message
              console.log(error.message)
            }
          })
            .then(() => {
              return "success"
            })
            .catch((error) => {
              errorReturn = error.message
              console.log(error.message)
            })
        } else {
          // no of limit exceeded
          throw new functions.https.HttpsError(
            "failed-precondition",
            "no of limit exceeded"
          )
        }

        if (errorReturn) {
          throw new functions.https.HttpsError(
            "failed-precondition",
            errorReturn
          )
        }

        return ` batch = ${batch} , courseDocid = ${courseDocid} , scheduleCourseDocid = ${scheduleCourseDocid} , uid = ${uid}`
      }
    } else {
      throw new functions.https.HttpsError(
        "failed-precondition",
        "Data parameters are wrong."
      )
    }
  } else {
    if (!context.auth) {
      // Throwing an HttpsError so that the client gets the error details.
      throw new functions.https.HttpsError(
        "failed-precondition",
        "Unauthenticated"
      )
    }
  }
})

exports.getUserDetails = functions.https.onCall(async (data, context) => {
  try {
    const uid = data.uid
    if (!uid) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Missing user UID"
      )
    }

    const userSnapshot = await admin
      .firestore()
      .collection("users")
      .doc(uid)
      .get()
    if (!userSnapshot.exists) {
      throw new functions.https.HttpsError("not-found", "User not found")
    }

    const userRecord = admin
      .auth()
      .getUser(uid)
      .then((userRecord) => {
        // User details
        console.log("User details:", userRecord.toJSON())
        return userRecord.toJSON()
      })
      .catch((error) => {
        console.error("Error fetching user:", error)
      })

    // const userData = userSnapshot.data();
    return userRecord
  } catch (error) {
    console.error("Error fetching user data:")
    throw new functions.https.HttpsError("internal", "Error fetching user data")
  }

  //return data
})

exports.enableDisableUser = functions.https.onCall(async (data, context) => {
  const { uid } = data
  // const uid = Number(data.uid);
  const status = data.disabled

  try {
    await admin.auth().updateUser(uid, {
      disabled: status,
    })
    return {
      success: true,
      message: `User ${status ? "disabled" : "enabled"} successfully`,
    }
  } catch (error) {
    console.error("Error updating user:", error)
    return {
      success: false,
      message: `User Updation failed due to ${error},check your settings!`,
    }
  }
})

// Function to fetch faculty  name from a document
const getFileNameFromDocument = async (docId) => {
  const docRef = admin.firestore().collection("faculty").doc(docId)
  const snapshot = await docRef.get()
  if (snapshot.exists) {
    const data = snapshot.data()
    const fileName = data.name // Assuming 'name' is the field name
    if (fileName) {
      return fileName
    } else {
      throw new Error(`Document ${docId} does not contain a file name.`)
    }
  } else {
    throw new Error(`Document ${docId} does not exist.`)
  }
}

// Function to fetch file names for an array of document IDs
const fetchFileNames = async (documentIds) => {
  const fileNameArray = []

  console.log(documentIds)

  for (const docId of documentIds) {
    try {
      const fileName = await getFileNameFromDocument(docId)
      fileNameArray.push(fileName)
    } catch (error) {
      console.error(error.message)
    }
  }

  return fileNameArray
}
