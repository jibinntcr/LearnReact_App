
import React from 'react'
import { Link } from 'react-router-dom'
import { MdLocationOn } from 'react-icons/md'

function EventCard({ title, jsDate, description, DocId, image, location }) {
    return (


        <div className="w-full md:w-1/2 lg:w-1/3 px-4">
            <Link className="events" to={`/events/${DocId}`} >
                <div className="max-w-[370px] mx-auto mb-10">




                    <div className="rounded overflow-hidden mb-8">
                        <img
                            src={image}
                            alt={title}
                            className="w-full"
                        />
                    </div>
                    <div>
                        {jsDate && <span
                            className="
                         bg-green-500
                         rounded
                         inline-block
                         text-center
                         py-1
                         px-4
                         text-xs
                         leading-loose
                         font-semibold
                         text-white
                         mb-5
                         "
                        >



                            {

                                `  ${jsDate.toJSON().slice(0, 10).split('-').reverse().join('/')} -
  ${(jsDate).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}`}
                        </span>}
                        <h3 className="font-semibold
                            text-xl
                            sm:text-2xl
                            lg:text-xl
                            xl:text-2xl
                            mb-4
                            inline-block
                            text-dark
                            hover:text-primary 
                            line-clamp-3">



                            {title}

                        </h3>

                        {location && <p className=" flex text-lg items-center text-gray-600  font-semibold mt-3">
                            <MdLocationOn className="mr-2 text-2xl shrink-0" /> {location}

                        </p>}
                        {description && <p className="text-base text-body-color line-clamp-2">
                            {description}
                        </p>}


                    </div>
                </div></Link>
        </div>
    )
}

export default EventCard