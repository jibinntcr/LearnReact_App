

import bgimage from "../../assets/images/p4.jpg"

function Card6(props) {

  // const dispatch = useDispatch()


  return (
    <div
      className="max-w-sm my-3 bg-white rounded-lg border border-gray-200 shadow-md  "
      onClick={() => (props)}
    >
      <img
        className="rounded-t-lg  w-full object-cover "
        src={bgimage}
        alt=""
      />

      <div className="p-5">
        <a href="https://www.example.com">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 ">
            Noteworthy technology acquisitions 2021
          </h5>
        </a>
        <p className="mb-3 font-normal text-gray-700 line-clamp-2">
          Here are the biggest enterprise technology acquisitions of 2021 so
          far, in reverse chronological order.
        </p>
        <button className="inline-flex items-center py-2 px-3 text-sm font-medium text-center className='text-white bg-green-500  rounded-md hover:text-black hover:bg-green-400' ">
          Read more
          <svg
            aria-hidden="true"
            className="ml-2 -mr-1 w-4 h-4"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
              clipRule="evenodd"
            ></path>
          </svg>
        </button>
      </div>
    </div>
  )
}

export default Card6
