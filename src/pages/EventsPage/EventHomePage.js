import { db } from "../../firebase.config"
import {
  collection,
  getDocs,
  query,
  limit,
  orderBy,
  where,
} from "firebase/firestore"
import EventCard from "./EventCard"
import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import Spinner from "../../components/Spinner/Spinner"
import LoadMoreButton from "../../components/Button/LoadMoreButton"
import PageLimit from "../../const/PaginationData"
function EventHomePage() {
  // State
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState([])

  // collection ref
  const colRef = collection(db, "events")

  //query
  let q = query(
    colRef,
    where("HomePageDisplayStatus", "==", true),
    orderBy("createdAt", "desc"),
    limit(PageLimit.EventHomePageLimit)
  )

  useEffect(() => {
    window.scroll(0, 0)
    setLoading(true)
    getDocs(q).then((data) => {
      updateState(data)
    })
  }, [])

  const updateState = (collection) => {
    const isCollectionEmpty = collection.size === 0

    if (!isCollectionEmpty) {
      const dataDoc = collection.docs.map((doc) => ({
        ...doc.data(),
        DocId: doc.id,
      }))
      setData(dataDoc)
      setLoading(false)
    } else {
    }
    setLoading(false)
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
                  <span className="font-semibold text-lg text-green-500 mb-2 block">
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
                    Upcoming Events
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
                  image={item.image}
                  location={item.location}
                  title={item.title}
                />
              ))}
            </div>
            {/* {pagination} */}
            {
              <Link to="/events">
                <LoadMoreButton />
              </Link>
            }
          </div>
        </section>
      ) : (
        ""
      )}
    </>
  )
}

export default EventHomePage
