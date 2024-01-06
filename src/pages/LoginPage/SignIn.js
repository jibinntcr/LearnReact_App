import React from "react"
import heroImg from "../../assets/images/signup.jpg"
import SignInForm from "./SignInForm"

function SignIn() {
    return (
        <div className="box-border mt-16  md:mt-0 mb-64" style={{ height: "fit-content" }}>
            <div className="">
                <div className="box-border flex flex-col justify-center items-center">
                    <div className="relative box-border md:w-3/5 md:max-w-lg md:-ml-60 md:mt-24 after:content-[''] after:absolute after:w-full after:h-full after:top-0 after:left-0 after:bg-black/[0.5] after:opacity-100">
                        <img src={heroImg} alt="signup" className="w-screen h-4/12" />
                        <svg
                            fill="currentColor"
                            role="img"
                            aria-hidden="true"
                            className="-top-5 -right-5 h-2/4 w-8/12 absolute -z-10 hidden md:block"
                        >
                            <title>Diagonal A Dense</title>
                            <pattern
                                id="DiagonalADense-pattern-1"
                                x="0"
                                y="0"
                                width="4"
                                height="4"
                                patternUnits="userSpaceOnUse"
                            >
                                <rect width="1" height="1" fill="currentColor"></rect>
                                <rect
                                    x="2"
                                    y="2"
                                    width="1"
                                    height="1"
                                    fill="currentColor"
                                ></rect>
                                <rect
                                    x="1"
                                    y="2"
                                    width="1"
                                    height="1"
                                    fill="currentColor"
                                ></rect>
                                <rect
                                    x="1"
                                    y="3"
                                    width="1"
                                    height="1"
                                    fill="currentColor"
                                ></rect>
                                <rect y="3" width="1" height="1" fill="currentColor"></rect>
                                <rect x="3" width="1" height="1" fill="currentColor"></rect>
                                <rect
                                    x="3"
                                    y="1"
                                    width="1"
                                    height="1"
                                    fill="currentColor"
                                ></rect>
                                <rect
                                    x="2"
                                    y="1"
                                    width="1"
                                    height="1"
                                    fill="currentColor"
                                ></rect>
                            </pattern>
                            <rect
                                width="100%"
                                height="100%"
                                fill="url(#DiagonalADense-pattern-1)"
                            ></rect>
                        </svg>
                    </div>
                    <div className="bg-white w-4/5 sm:w-9/12 md:-mr-52 md:w-3/5 md:max-w-lg -mt-40 mb-14 rounded-md flex flex-col justify-center items-center border-black drop-shadow-2xl p-7">
                        <SignInForm />
                    </div>
                </div>
            </div>
        </div>
    )
}



export default SignIn