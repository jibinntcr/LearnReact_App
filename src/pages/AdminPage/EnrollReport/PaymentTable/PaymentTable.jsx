import React from "react"
import PaymentTableRow from "./PaymentTableRow"

function PaymentTable({ data }) {
  return (
    <table className="w-full border-collapse bg-white text-left text-sm text-gray-500 ">
      <thead className="bg-gray-50">
        <tr>
          <th scope="col" className="px-6 py-4 font-semibold text-gray-900">
            User information
          </th>
          <th scope="col" className="px-6 py-4 font-semibold text-gray-900">
            Course information
          </th>
          <th scope="col" className="px-6 py-4 font-semibold text-gray-900">
            Faculty
          </th>
          <th scope="col" className="px-6 py-4 font-semibold text-gray-900">
            Course by
          </th>
          <th scope="col" className="px-6 py-4 font-semibold text-gray-900">
            Batch
          </th>
          <th scope="col" className="px-6 py-4 font-semibold text-gray-900">
            Date & Time
          </th>
          <th scope="col" className="px-6 py-4 font-semibold text-gray-900">
            Payment information
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100 border-t border-gray-100">
        {data.map((item, index) => (
          <PaymentTableRow key={index} TrData={item} />
        ))}
      </tbody>
    </table>
  )
}

export default PaymentTable
