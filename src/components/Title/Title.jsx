import React from 'react'

function Title({ children }) {
    return (
        <div className="">
            {children && <div className="w-full mt-14 mb-12 lg:mb-0">
                <p className=" text-4xl text-center font-extrabold text-body-color leading-relaxed stand__out__text mb-9 mx-5">


                    {children}
                </p>

            </div>}</div>
    )
}

export default Title