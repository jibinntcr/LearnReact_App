// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getFunctions } from "firebase/functions"
import { getStorage } from "firebase/storage"

import { getFirestore } from 'firebase/firestore'
import { getAuth } from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBGN0Tl-cH_I9VOcYjs7PZoM_Jf6otZLB8",
    authDomain: "cusat-tech.firebaseapp.com",
    projectId: "cusat-tech",
    storageBucket: "cusat-tech.appspot.com",
    messagingSenderId: "806390102448",
    appId: "1:806390102448:web:1f982a14a2caec70d9fe75",
    measurementId: "G-44L97LWDE1"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)
export const auth = getAuth(app)
export const storage = getStorage(app)
const functions = getFunctions(app)

export default app