import React from "react"
import { MdAccessTimeFilled } from "react-icons/md"
// import { BsPeople, BsChat } from "react-icons/bs"

function UsersCard({photo,name,phone,email}) {



  return (
      <div className="p-2  " >
        {/* <!-- Card --> */}
        <div className="w-60 p-2 bg-white rounded-xl transform transition-all hover:-translate-y-2 duration-300 shadow-lg hover:shadow-2xl">
          {/* <!-- Image --> */}
          <img className="h-40 object-cover rounded-xl" src={photo} alt="url error" />

          <div className="p-2">
            <div className=" ">
              {/* <!-- Heading --> */}

              <p className="flex items-center justify-end">
                <MdAccessTimeFilled className=" mr-1 " />{" "}
                {''}
              </p>
              <h2
                className="font-bold text-lg my-2">
                {name}
              </h2>
            </div>
            <p className="text-sm text-gray-600 line-clamp-3">
              {phone}
            </p>
            <p className="text-sm text-gray-600 line-clamp-3">
            {email}
            </p>
          </div>
        </div>
        {/* <!-- Card --> */}
      </div>
  )
}



export default UsersCard
