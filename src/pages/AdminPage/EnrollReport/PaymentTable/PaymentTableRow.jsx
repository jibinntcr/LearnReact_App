import { format } from "date-fns"
import { HiOutlineClock, HiOutlineCalendar } from "react-icons/hi"

function PaymentTableRow({ TrData }) {
  // console.log(TrData?.createdAt)
  let date = new Date(TrData?.createdAt.seconds * 1000)
  // console.log(date, "date")

  const formattedDate = format(date, "dd/MM/yyyy")
  const formattedTime = format(date, "HH:mm:ss")
  return (
    <tr className="even:hover:bg-blue-100 odd:hover:bg-blue-100 even:bg-gray-200 odd:bg-white">
      <th className="flex gap-3 px-6 py-4 font-normal text-gray-900">
        <div className="text-sm">
          <div className="font-medium text-gray-700  mb-2">
            {TrData?.userName}
          </div>
          <div className="text-gray-450 mb-2">{TrData?.userEmail}</div>
          {TrData?.cusatFlag ? (
            <span className="p-1.5 my-2 text-xs font-medium uppercase tracking-wider text-green-800 bg-green-200 rounded-lg bg-opacity-50">
              Cusat Student
            </span>
          ) : (
            <span className="p-1.5 my-2 text-xs font-medium uppercase tracking-wider text-blue-800 bg-blue-200 rounded-lg bg-opacity-50">
              NON Cusat Student
            </span>
          )}
        </div>
      </th>
      <td className="px-6 py-4 flex-col">
        <div className="text-sm">
          <div className="font-medium text-gray-500 mb-2">
            Name :{TrData?.courseName}
          </div>
          <div className="font-medium text-gray-500 mb-2">
            Code :{TrData?.courseCode}
          </div>
          {TrData?.department && (
            <div className="font-medium text-gray-500 mb-2">
              Department :{TrData?.department}
            </div>
          )}
        </div>
      </td>
      <td className="px-6 py-4 flex-col">
        <div className="text-sm">
          {TrData?.FacultyName?.map((element, index) => (
            <div className="font-medium text-gray-500 mb-2" key={index}>
              {" "}
              {element}
            </div>
          ))}
        </div>
      </td>
      <td className="px-6 py-4 flex-col">
        {TrData?.courseBy === "cdec" ? (
          <span className="p-1.5 my-2 text-xs font-medium uppercase tracking-wider text-green-800 bg-green-200 rounded-lg bg-opacity-50">
            Cdec
          </span>
        ) : (
          <span className="p-1.5 my-2 text-xs font-medium uppercase tracking-wider text-blue-800 bg-blue-200 rounded-lg bg-opacity-50">
            Cusatech
          </span>
        )}
      </td>
      <td className="px-6 py-4">{TrData?.batch.slice(5)}</td>
      <td className="px-6 py-4">
        <div className="text-sm">
          <div className="font-medium text-gray-500 mb-2 flex gap-3">
            <HiOutlineCalendar />

            {formattedDate}
          </div>
          <div className="text-gray-500 mb-2 flex gap-3">
            {" "}
            <HiOutlineClock />
            {formattedTime}
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm">
          <div className="font-medium text-gray-500 mb-2">
            Cash :{TrData?.cash}
          </div>
          <div className="text-gray-500 mb-2">GST % :{TrData?.gst}</div>
          <div className="text-gray-500">Total cash : {TrData?.totalCash}</div>
        </div>
      </td>
    </tr>
  )
}

export default PaymentTableRow
