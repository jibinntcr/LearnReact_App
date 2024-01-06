import PageLimit from "../../const/PaginationData"

import { db } from "../../firebase.config"
import {
  collection,
  getDocs,
  query,
  limit,
  orderBy,
  startAfter,
  getCountFromServer,
} from "firebase/firestore"
import EventCard from "./EventCard"
import React, { useEffect, useState } from "react"
import Spinner from "../../components/Spinner/Spinner"
import LoadMoreButton from "../../components/Button/LoadMoreButton"
import Footer from "../../components/Footer/Footer"
function EventsPage() {
  // State
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState([])
  const [lastVisible, setLastVisible] = useState(null)
  const [hasMore, setHasMore] = useState(true)
  const [DataCount, setDataCount] = useState("")

  // collection ref
  const colRef = collection(db, "events")

  // getting count of total docs
  const getDocumentCount = async () => {
    try {
      // Fetch the count of documents in the collection
      const snapshot = await getCountFromServer(colRef)

      setDataCount(snapshot.data().count)
    } catch (error) {
      // console.error("Error getting document count:", error)
    }
  }

  //query
  let initial_query = query(
    colRef,
    // where("HomePageDisplayStatus", "==", true),
    orderBy("createdAt", "desc"),
    limit(PageLimit.EventPage)
  )

  useEffect(() => {
    window.scroll(0, 0)
    setLoading(true)
    getDocs(initial_query).then((data) => {
      updateState(data)
    })
    getDocumentCount()
  }, [])

  const updateState = (collection) => {
    const isCollectionEmpty = collection.size === 0

    if (!isCollectionEmpty) {
      const dataDoc = collection.docs.map((doc) => ({
        ...doc.data(),
        DocId: doc.id,
      }))

      const lastDoc = collection.docs[collection.docs.length - 1]
      setData((prevData) => {
        const existingIds = prevData.map((item) => item.id)
        const filteredNewData = dataDoc.filter(
          (item) => !existingIds.includes(item.id)
        )
        return [...prevData, ...filteredNewData]
      })
      setLastVisible(lastDoc)
      setLoading(false)
    } else {
    }
    setLoading(false)
  }

  useEffect(() => {
    if (data.length === DataCount) {
      setHasMore(false)
    } else {
      setHasMore(true)
    }
  }, [data])

  const fetchMore = () => {
    let moreData = query(
      colRef,
      orderBy("createdAt", "desc"),
      startAfter(lastVisible),
      limit(PageLimit.EventPage)
    )
    getDocs(moreData).then((data) => {
      updateState(data)
    })
  }

  return (
    <>
      {loading ? (
        <Spinner />
      ) : data && data.length > 0 ? (
        <section className="pt-20 overflow-hidden lg:pt-[120px]  pb-10 lg:pb-20 flex flex-wrap justify-center ">
          <div className="container">
            <div className="flex flex-wrap justify-center -mx-4">
              <div className="w-full px-4">
                <div className="text-center mx-auto mb-[60px] lg:mb-20 max-w-[510px]">
                  <span className="font-semibold text-2xl text-green-500 mb-2 block">
                    Events
                  </span>
                  <h2
                    className="
                    font-bold
                    text-3xl
                    sm:text-4xl
                    md:text-[40px]
                    text-dark
                    mb-4
                    "
                  >
                    Upcoming Events page
                  </h2>

                  <p className="text-base text-body-color">
                    There are many variations of passages of Lorem Ipsum
                    available but the majority have suffered alteration in some
                    form.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap mx-4 justify-center">
              {data.map((item, index) => (
                <EventCard
                  className=" mb-3"
                  key={index}
                  jsDate={new Date(item.date.seconds * 1000)}
                  description={item.description}
                  DocId={item.DocId}
                  image={item.thumbnailImage ? item.thumbnailImage : item.image}
                  location={item.location}
                  title={item.title}
                />
              ))}
            </div>
            {/* {pagination} */}
            {
              <>
                <LoadMoreButton onClick={fetchMore} disabled={!hasMore} />
              </>
            }
          </div>
        </section>
      ) : (
        <section className="pt-20 overflow-hidden lg:pt-[120px]  pb-10 lg:pb-20 flex flex-wrap justify-center ">
          <div className="container">
            <div className="w-full px-4">
              <div className="text-center mx-auto mb-[60px] lg:mb-20 max-w-[510px]">
                <span className="font-semibold text-3xl text-green-500 mb-2 block">
                  Events
                </span>
              </div>
              <div className="flex justify-center h-96  items-center text-2xl font-semibold">
                {"No Events were found"}
              </div>
            </div>
          </div>
        </section>
      )}
      <Footer />
    </>
  )
}

export default EventsPage
