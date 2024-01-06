import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

//components
import Spinner from "../../components/Spinner/Spinner"
import Footer from "../../components/Footer/Footer"
import banner from "../../assets/images/banner-bg.jpg"
import Result from "./Result"
import CusatechResult from "./CusatechResult"
function CombinedResult() {
  const [text, setText] = useState("Loading...")
  const [loading, setLoadingCombined] = useState(true)
  const [cdec, setCdec] = useState([])
  const [cusatech, setCusatech] = useState([])
  const [mergedDetails, setMergedDetails] = useState([])
  useEffect(() => {
    let results = [...cdec, ...cusatech]
    results.sort((a, b) => b.enrolledAt.seconds - a.enrolledAt.seconds) // sort by createdAt

    setMergedDetails(results)

    // console.table(results)
  }, [cdec, cusatech])

  const status = (cs) => {
    cs = parseInt(cs)

    switch (cs) {
      case 1:
        return "Enroll"
      case 2:
        return "Upcoming"
      case 3:
        return "Enrollment closed"
      case 4:
        return "Canceled"
      case 5:
        return "Completed"
      default:
        return "Enroll"
    }
  }

  return (
    <div
      className="overflow-x-auto"
      style={{
        marginTop: -100,
        zIndex: -1,
      }}
    >
      <div
        style={{
          position: "relative",
          backgroundColor: "rgba(4, 9, 30)",
          width: "100%",
          height: 400,
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img
          style={{
            objectFit: "cover",
            marginTop: 200,

            width: "100%",
            opacity: 0.2,
            position: "absolute",
          }}
          src={banner}
          alt=""
        />
        <div style={{ zIndex: 1, color: "white", paddingTop: 100 }}>
          <h1 style={{ fontSize: 50 }}> Result</h1>
          <div
            style={{
              display: "flex",
              justifyContent: "space-evenly",
              paddingTop: 20,
            }}
          >
            <div>
              <Link className="hover:text-green-500 mr-1" to="/">
                Home
              </Link>
              /<Link className="hover:text-green-500 ml-1">Result</Link>
            </div>
          </div>
        </div>
      </div>

      <>
        <Result setCdec={setCdec} setLoadingCombined={setLoadingCombined} />
        <CusatechResult setCusatech={setCusatech} />
        {loading ? (
          <Spinner />
        ) : mergedDetails && mergedDetails.length > 0 ? (
          <>
            <div
              className="bg-gray-100 px-2 overflow-x-auto mx-auto"
              style={{
                display: "flex",
                alignItems: "center",

                flexDirection: "row",
              }}
            >
              <div className="p-5  ">
                {/* <h1 className="text-xl font-semibold mb-2">
                        {" "}
                        Total Enrollment Students : {data.enrollmentCount}
                    </h1> */}

                <div className="  rounded-lg shadow hidden xl:block">
                  <table className="overflow-x-auto w-full justify-start">
                    <thead className="bg-gray-50 border-b-2 border-gray-200">
                      <tr className="">
                        <th className="w-20 p-3 text-sm font-semibold tracking-wide text-left">
                          No.
                        </th>
                        <th className="p-3 text-sm font-semibold tracking-wide text-left">
                          Batch
                        </th>
                        <th className="p-3 text-sm font-semibold tracking-wide text-left">
                          Course by
                        </th>
                        <th className=" p-3 text-sm font-semibold tracking-wide text-left">
                          Course Department
                        </th>
                        <th className=" p-3 text-sm font-semibold tracking-wide text-left">
                          Course Name
                        </th>
                        <th className="w-32 p-3 text-sm font-semibold tra cking-wide text-left">
                          Course Code
                        </th>
                        <th className="w-32 p-3 text-sm font-semibold tracking-wide text-left">
                          Course Status
                        </th>
                        <th className="w-32 p-3 text-sm font-semibold tracking-wide text-left">
                          Course Grade
                        </th>

                        <th className="w-32 p-3 text-sm font-semibold tracking-wide text-left">
                          Grade Point
                        </th>

                        <th className="w-32 p-3 text-sm font-semibold tracking-wide text-left">
                          Grade Status
                        </th>
                        <th className="w-32 p-3 text-sm font-semibold tracking-wide text-left">
                          Mark
                        </th>
                        <th className="w-32 p-3 text-sm font-semibold tracking-wide text-left">
                          Credit
                        </th>
                        <th className="w-24 p-3 text-sm font-semibold tracking-wide text-left">
                          Course Department
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {mergedDetails.map((item, index) => (
                        <tr
                          key={index}
                          className="even:bg-white odd:bg-gray-100"
                        >
                          <td className="p-3 text-sm whitespace-nowrap text-blue-500">
                            {++index}
                          </td>
                          <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                            {item.batch?.slice(5)}
                          </td>
                          <td className="px-6 py-4 flex-col">
                            {item?.courseBy === "cdec" ? (
                              <span className="p-1.5 my-2 text-xs font-medium uppercase tracking-wider text-green-800 bg-green-200 rounded-lg bg-opacity-50">
                                Cdec
                              </span>
                            ) : (
                              <span className="p-1.5 my-2 text-xs font-medium uppercase tracking-wider text-blue-800 bg-blue-200 rounded-lg bg-opacity-50">
                                Cusatech
                              </span>
                            )}
                          </td>

                          <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                            {item.CourseDepartment}
                          </td>
                          <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                            {item.CourseName}
                          </td>
                          <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                            {item.CourseCode}
                          </td>
                          <td className="p-3 text-sm text-gray-700n whitespace-nowrap">
                            {item?.CourseStatus
                              ? status(item.CourseStatus)
                              : "Not Available"}
                          </td>
                          <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                            {item?.grade}
                          </td>

                          <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                            {Boolean(item?.gradepoint)
                              ? item.gradepoint
                              : "Not Available"}
                          </td>
                          <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                            {item?.gradestatus
                              ? item.gradestatus
                              : "Not Available"}
                          </td>
                          <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                            {Boolean(item?.mark)
                              ? item.mark +
                                (item?.totalMark && "/" + item.totalMark)
                              : "Not Available"}
                          </td>
                          <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
                            {Boolean(item?.credit)
                              ? item.credit
                              : "Not Available"}
                          </td>
                          <td className="p-3 text-sm text-gray-700n  w-[400px]">
                            {Boolean(item?.remark)
                              ? item.remark
                              : "Not Available "}{" "}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex flex-col items-center justify-center">
                  {mergedDetails.map((item, index) => (
                    <div className="  my-2 sm:w-[700px] xl:hidden">
                      <div className="bg-white space-y-3 p-4 rounded-lg shadow">
                        <div className="flex pt-4 flex-col items-start sm:space-y-4 space-y-1 space-x-2 sm:text-base text-sm">
                          <div>
                            <p className="text-blue-500 font-bold hover:underline mb-1">
                              #{++index}
                            </p>
                          </div>
                          <div className=" text-gray-700">
                            <span className="font-semibold">Batch : </span>{" "}
                            {item.batch?.slice(5)}
                          </div>
                          <div className=" text-gray-700">
                            <span className="font-semibold">
                              {" "}
                              Course Department :{" "}
                            </span>{" "}
                            {item.CourseDepartment}
                          </div>
                          <div className=" text-gray-700">
                            <span className="font-semibold">
                              {" "}
                              Course Name :{" "}
                            </span>{" "}
                            {item.CourseName}
                          </div>

                          <div className=" text-gray-700">
                            <span className="font-semibold">
                              {" "}
                              Course Code :{" "}
                            </span>{" "}
                            {item.CourseCode}
                          </div>
                          <div className=" text-gray-700">
                            <span className="font-semibold">
                              {" "}
                              Course Status :{" "}
                            </span>{" "}
                            {item?.CourseStatus
                              ? status(item.CourseStatus)
                              : "Not Available"}
                          </div>
                          <div className=" text-gray-700 ">
                            <span className="font-semibold"> Grade : </span>{" "}
                            &nbsp; &nbsp;
                            {item?.grade}
                          </div>
                          <div className=" text-gray-700 ">
                            <span className="font-semibold">
                              {" "}
                              Grade Point :{" "}
                            </span>{" "}
                            &nbsp; &nbsp;
                            {Boolean(item?.gradepoint)
                              ? item.gradepoint
                              : "Not Available"}
                          </div>
                          <div className=" text-gray-700 ">
                            <span className="font-semibold">
                              {" "}
                              Grade Status :{" "}
                            </span>{" "}
                            &nbsp; &nbsp;
                            {Boolean(item?.gradestatus)
                              ? item.gradestatus
                              : "Not Available"}
                          </div>
                          <div className=" text-gray-700 ">
                            <span className="font-semibold"> Mark : </span>{" "}
                            &nbsp; &nbsp;
                            {Boolean(item?.mark)
                              ? item.mark +
                                (item?.totalMark && "/" + item.totalMark)
                              : "Not Available"}
                          </div>
                          <div className=" text-gray-700 ">
                            <span className="font-semibold"> Credit : </span>{" "}
                            &nbsp; &nbsp;
                            {Boolean(item?.credit)
                              ? item.credit
                              : "Not Available"}
                          </div>
                          <div className=" text-gray-700 ">
                            <span className="font-semibold"> Remark : </span>{" "}
                            <textarea
                              name=""
                              id=""
                              cols={30}
                              className="w-full  border-2 border-gray-300 rounded-lg p-2 mt-6"
                              rows="8"
                              value={
                                Boolean(item?.remark)
                                  ? item.remark
                                  : "Not Available"
                              }
                            ></textarea>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="my-24 text-4xl font-bold  text-center italic  flex flex-col">
            <div className="">{text}</div>
          </div>
        )}{" "}
      </>

      <Footer />
    </div>
  )
}

export default CombinedResult
