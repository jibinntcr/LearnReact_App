import React, { useEffect, useState } from "react"
//firebase firestore
import { db } from "../../firebase.config"
import { doc, getDoc } from "firebase/firestore"
// css
import "../homepage/HomePageStyles.css"

//components
import Spinner from "../../components/Spinner/Spinner"
import Footer from "../../components/Footer/Footer"
import Section3 from "../../components/Section3/Section3"
import CombinedHomepageCourseBox from "../../components/NewHomePageCoursesBox/CombinedHomepageCourseBox"

function CusatechHomePage() {
  // State
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState({})

  const getData = async () => {
    const docRef = doc(db, "homepage", "cusatech")
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      setData(formatDoc(docSnap))
    } else {
    }

    setLoading(false)
  }

  function formatDoc(doc) {
    const { bg1, bg2, text1, text2 } = doc.data()
    return { bg1, bg2, text1, text2 }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    getData()
  }, [])

  return (
    <div>
      <>
        {loading ? (
          <Spinner />
        ) : (
          <div>
            <div>
              <div className="w-full h-96 sm:h-screen bg-red-100 relative">
                <div
                  className="absolute inset-0 bg-cover bg-center z-0"
                  style={{ backgroundImage: ` url(${data.bg1})` }}
                ></div>
                <div className="opacity-100  duration-300 absolute text-center inset-0 z-10 flex justify-center items-center text-xl md:text-4xl lg:text-6xl text-white font-semibold">
                  {data.text1}
                </div>
              </div>
            </div>

            {/* section2 Courses Slide*/}
            {/* {<Section2 limitValue={4} />} */}

            <CombinedHomepageCourseBox />

            {/* Section 3  // paragraph with background image    */}
            <Section3 imgUrl={data.bg2} text={data.text2} />

            {/* 
            Section 4  //Events 
            <Temp limitValue={3} /> */}

            {/* Section 9  */}
            <Footer />
          </div>
        )}
      </>
    </div>
  )
}

export default CusatechHomePage
