import React, { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import { db } from "../../firebase.config"
import {
  getDocs,
  collection,
  query,
  limit,
  orderBy,
  startAfter,
  where,
} from "firebase/firestore"
import Spinner from "../../components/Spinner/Spinner"
import Footer from "../../components/Footer/Footer"
import LoadMoreButton from "../../components/Button/LoadMoreButton"
import WSPGallery from "../../components/Gallery/WSPGallery"
import "./GalleryPageStyles.css"

function GalleryPage() {
  // State
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState([])
  const [lastVisible, setLastVisible] = useState(null)
  const [hasMore, setHasMore] = useState(true)
  const [DataCount, setDataCount] = useState("")

  // collection ref
  const colRef = collection(db, "gallery")

  const PAGE_SIZE = 1

  //query
  let initial_query = query(
    colRef,
    orderBy("createdAt", "desc"),
    limit(PAGE_SIZE)
  )

  const { pathname } = useLocation()

  // for formatting the fetchData
  function formatCourse(doc) {
    const { img, createdAt } = doc.data()
    return { createdAt, img }
  }

  useEffect(() => {
    setLoading(true)
    getDocs(initial_query).then((data) => {
      updateState(data)
    })
    setDataCount(data.length)
  }, []) // Add empty dependency array to run only once on mount

  const updateState = (collection, transform = formatCourse) => {
    const isCollectionEmpty = collection.size === 0
    if (!isCollectionEmpty) {
      const dataDoc = collection.docs.map(transform)
      const lastDoc = collection.docs[collection.docs.length - 1]
      setData((ListOFData) => {
        const newData = dataDoc.filter(
          (item) =>
            !ListOFData.some(
              (existingItem) => existingItem.DocId === item.DocId
            )
        )
        return [...ListOFData, ...newData]
      })
      setLastVisible(lastDoc)
      setLoading(false)
      setDataCount(data.length) // Move this here to update the data count after data changes.
    } else {
      setHasMore(false)
    }
    setLoading(false)
  }

  useEffect(() => {
    // console.log("newData", data)
    setDataCount(data.length)
  }, [data])

  const fetchMore = () => {
    // console.log("length:", DataCount)
    let moreData = query(
      colRef,
      orderBy("createdAt", "desc"),
      startAfter(lastVisible),
      limit(PAGE_SIZE)
    )
    getDocs(moreData).then((data) => {
      updateState(data)
    })
  }

  return (
    <div>
      <section className="pt-20  lg:pt-[120px] overflow-hidden pb-10 lg:pb-20  w-full">
        <div className="w-full">
          <div className="flex flex-wrap justify-center -mx-4">
            <div className="w-full px-4">
              <div className="text-center mx-auto mb-[60px] lg:mb-20 max-w-[510px]">
                <span className="font-semibold text-lg text-green-500 mb-2 block">
                  Gallery
                </span>
                <h2 className="font-bold text-3xl sm:text-4xl md:text-[40px] text-dark mb-4">
                  Images of Events
                </h2>
                <p className="text-base text-body-color">
                  There are many variations of passages of Lorem Ipsum available
                  but the majority have suffered alteration in some form.
                </p>
              </div>
            </div>
          </div>
        </div>
        {loading ? (
          <Spinner />
        ) : data && data.length > 0 ? (
          <div className="my-6">
            <WSPGallery galleryImages={data} />
            <LoadMoreButton onClick={fetchMore} disabled={!hasMore} />
          </div>
        ) : (
          "Data not available"
        )}
      </section>
      {/* Footer  */}
      <Footer />
    </div>
  )
}

export default GalleryPage
