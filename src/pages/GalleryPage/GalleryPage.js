import React, { useEffect, useState } from "react"
import { db } from "../../firebase.config"
import {
  getDocs,
  collection,
  query,
  limit,
  orderBy,
  startAfter,
  getCountFromServer,
} from "firebase/firestore"
import Spinner from "../../components/Spinner/Spinner"
import Footer from "../../components/Footer/Footer"
import LoadMoreButton from "../../components/Button/LoadMoreButton"

// import WSPGallery from "../../components/Gallery/WSPGallery";
// import "./GalleryPageStyles.css";
import PageLimit from "../../const/PaginationData"
import ImageGallery from "react-image-gallery"
//CSS
import "react-image-gallery/styles/css/image-gallery.css"

function GalleryPage({ limitValue }) {
  const colRef = collection(db, "gallery")
  // const PAGE_SIZE = 1;

  const [loading, setLoading] = useState(true)
  const [data, setData] = useState([])

  // const [ImageData,setImageData] = useState([]);

  const [lastVisible, setLastVisible] = useState(null)
  const [hasMore, setHasMore] = useState(true)
  const [dataCount, setDataCount] = useState(0)

  function FormatDoc(doc) {
    const { img } = doc.data()
    return { id: doc.id, img }
  }

  // getting count of total docs
  const getDocumentCount = async () => {
    try {
      const querySnapshot = await getCountFromServer(colRef)
      const documentCount = querySnapshot.data().count
      // console.log("TotalCount:", documentCount)
      setDataCount(documentCount)
      return documentCount
    } catch (error) {
      console.error("Error getting document count:", error)
      return 0
    }
  }

  useEffect(() => {
    setLoading(true)
    const initialQuery = query(
      colRef,
      orderBy("createdAt", "desc"),
      limit(limitValue ? limitValue : PageLimit.GalleryLimit)
    )
    getDocs(initialQuery).then((data) => {
      updateState(data)
    })
    getDocumentCount()
  }, [])

  useEffect(() => {
    // console.log("newData", data)

    // console.log("data len:", data.length)

    if (data.length === dataCount) {
      setHasMore(false)
    } else {
      setHasMore(true)
    }
  }, [data])

  const fetchMore = () => {
    if (lastVisible) {
      const moreDataQuery = query(
        colRef,
        orderBy("createdAt", "desc"),
        startAfter(lastVisible),
        limit(limitValue ? limitValue : PageLimit.GalleryLimit)
      )
      getDocs(moreDataQuery).then((data) => {
        updateState(data)
      })
    }
  }

  const updateState = (collection, transform = FormatDoc) => {
    const isCollectionEmpty = collection.size === 0
    if (!isCollectionEmpty) {
      const dataDoc = collection.docs.map(transform)
      // console.log("dataDoc",dataDoc);
      const lastDoc = collection.docs[collection.docs.length - 1]
      setData((prevData) => {
        const existingIds = prevData.map((item) => item.id)
        //const existingIds = new Set(prevData.map(item => item.id));
        // console.log("existingIds:",existingIds);

        //const filteredNewData = dataDoc.filter((item) => !existingIds.includes(item.id));
        const filteredNewData = dataDoc
          .filter((item) => !existingIds.includes(item.id))
          .map((item) => ({
            id: item.id,
            original: item.img,
            thumbnail: item.img,
          }))
        // console.log("filteredNewData", filteredNewData)
        return [...prevData, ...filteredNewData]
      })

      setLastVisible(lastDoc)
      setLoading(false)
    } else {
      // console.log("No Data to Fetch!")
    }
    setLoading(false)
  }

  return (
    <div>
      <section className="pt-20 lg:pt-[120px] overflow-hidden pb-10 lg:pb-20 w-full">
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
            {/* <WSPGallery galleryImages={data} /> */}
            <ImageGallery items={data} />
            <LoadMoreButton onClick={fetchMore} disabled={!hasMore} />
          </div>
        ) : (
          <div className="flex justify-center h-96 items-center text-2xl font-semibold">
            {"No images were found"}
          </div>
        )}
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default GalleryPage
