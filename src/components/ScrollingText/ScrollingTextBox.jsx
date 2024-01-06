import React, { useState, useEffect } from "react"
import ScrollingText from "./ScrollingText"

import { doc, getDoc } from "firebase/firestore"
import { db } from "../../firebase.config"

function ScrollingTextBox() {
  const [scrollingText, setScrollingText] = useState([])

  useEffect(() => {
    const fetchScrollingText = async () => {
      try {
        // Assuming 'docRef' is the reference to the document you want to fetch
        const documentSnapshot = await getDoc(doc(db, "current", "doc"))

        if (documentSnapshot.exists()) {
          const data = documentSnapshot.data()

          if (data.scrollingText) {
            setScrollingText(data.scrollingText)
            console.log(data.scrollingText)
          }
        }
      } catch (error) {
        console.error("Error fetching document:", error.message)
      }
    }

    fetchScrollingText()
  }, [])

  return  scrollingText && scrollingText.length > 0 ? (
    <div className="my-5 bg-green-100 font-medium p-3 w-screen">
      <ScrollingText data={scrollingText} />
    </div>
  )
  
: (
    <></>
  )
}

export default ScrollingTextBox
