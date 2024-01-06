import React from "react"
import Footer from "../../components/Footer/Footer"

const AboutPage = () => {
  return (
    <div className=" min-h-screen mt-16">
      <div className="2xl:container 2xl:mx-auto lg:py-16 lg:px-20 md:py-12 md:px-6 py-9 px-4  rounded-md">
        <div className="flex flex-col lg:flex-row justify-between gap-8">
          <div className="w-full lg:w-6/12 flex flex-col justify-center">
            <h1 className="text-3xl lg:text-4xl font-bold leading-9 text-green-800 pb-4">
              About Us
            </h1>
            <p className="font-normal mb-2 text-base md:text-lg leading-6 text-justify">
              Welcome to the Center for Development of e-Content (CDeC) at
              Cochin University of Science and Technology (CUSAT), where we are
              committed to revolutionizing education through the power of
              digital learning.At CDeC, our mission is clear: to ensure that
              every student has access to enhanced teaching and learning
              resources. In pursuit of this vision, CUSAT has established CDeC,
              a center dedicated to the creation of skill and job-oriented
              Massive Open Online Courses (MOOCs). These courses are designed to
              empower individuals with knowledge and skills that are not just
              theoretical but also practical and industry-relevant.
            </p>
            <p className="font-normal mb-2 text-base md:text-lg leading-6 text-justify">
              Under the auspices of CUSAT and with generous funding support from
              RUSA 2.0, our esteemed faculty members have successfully developed
              eighteen specialized online courses so far. . These courses span a
              wide range of domains, including marine science, applied
              chemistry, management, law, Hindi, safety engineering,
              environmental science, and industrial fisheries. By offering this
              diverse array of subjects, we aim to cater to the educational
              needs of learners from various backgrounds and interests.It's
              noteworthy that MOOCs have gained recognition as a viable
              education delivery method, as endorsed by the National Education
              Policy (NEP). We are proud to be at the forefront of this
              educational revolution, leveraging technology to make quality
              education accessible to all.
            </p>
          </div>
          <div className="w-full lg:w-6/12 ">
            <img
              className="w-full h-full rounded-md"
              src="https://firebasestorage.googleapis.com/v0/b/cusat-tech.appspot.com/o/static%2Froom.png?alt=media&token=c746b23e-090b-4387-bee4-6082c4eea2fb&_gl=1*1t1c22n*_ga*OTEwMzUxNDk3LjE2NjI4Njk4MDg.*_ga_CW55HF8NVT*MTY5Njc4ODc2Mi45MC4xLjE2OTY3ODg3OTMuMjkuMC4w"
              alt=""
            />
          </div>
        </div>
        <div className="mt-10">
          <div className="w-full  flex flex-col items-center justify-center">
            <p className="font-normal mb-2 text-base md:text-lg leading-6 text-justify">
              CUSAT's commitment to excellence extends to the establishment of
              CDeC in compliance with UGC guidelines. Our primary objective is
              to democratize educational opportunities. The courses created by
              CDeC are tailored to provide a distinctive learning experience for
              individuals from all segments of society, with a special focus on
              those from marginalized backgrounds. We believe that education has
              the power to uplift communities and individuals, and our courses
              are designed to help learners broaden their knowledge horizons and
              improve their prospects for a brighter future.
            </p>
            <p className="font-normal mb-2 text-base md:text-lg leading-6 text-justify">
              To support our mission, CDeC has meticulously set up the essential
              infrastructure for the recording of MOOC classes. Our
              state-of-the-art studio is located on the 2nd Floor of the
              Students Amenity Centre at CUSAT and includes high-resolution 4K
              video recording cameras, interactive display units,
              high-performance workstations for video editing, advanced servers,
              Storage Area Network (SAN) storage for seamless video streaming,
              and top-quality microphones to ensure impeccable audio quality. We
              leave no stone unturned in delivering an exceptional online
              learning experience.
            </p>
          </div>
          <div className="w-full flex mt-3 flex-col lg:flex-row justify-center  gap-8">
            <img
              className="w-full md:w-4/12  rounded-md"
              src="https://firebasestorage.googleapis.com/v0/b/cusat-tech.appspot.com/o/static%2Fb.png?alt=media&token=80443a6a-f8d4-408b-bdbf-4ff69d813c9f&_gl=1*152raog*_ga*OTEwMzUxNDk3LjE2NjI4Njk4MDg.*_ga_CW55HF8NVT*MTY5Njc4ODc2Mi45MC4xLjE2OTY3ODkxNDguNTIuMC4w"
              alt=""
            />
            <img
              className="w-full md:w-4/12  rounded-md"
              src="https://firebasestorage.googleapis.com/v0/b/cusat-tech.appspot.com/o/static%2F4k.png?alt=media&token=161d5db0-402e-449d-a761-c9c64837f155&_gl=1*1gk44bz*_ga*OTEwMzUxNDk3LjE2NjI4Njk4MDg.*_ga_CW55HF8NVT*MTY5Njc4ODc2Mi45MC4xLjE2OTY3ODkxOTguMi4wLjA."
              alt=""
            />
          </div>
        </div>

        <div className="mt-10">
          <p className="font-normal mb-2 text-base md:text-lg leading-6 text-justify">
            As you explore the world of CDeC and embark on your learning journey
            with us, we invite you to discover the limitless possibilities that
            digital education can offer. Join us in our mission to unlock the
            potential within every learner, regardless of their background or
            location. Together, we can shape a brighter and more inclusive
            future through education.
          </p>
          <div className=" flex justify-center">
            <span className="font-bold text-lg md:text-xl ">
              Welcome to CDeC where ‘Knowledge Flows Smoothly’
            </span>
          </div>
        </div>

        <div className="flex lg:flex-row flex-col justify-center gap-8 pt-12 ">
          <div className="w-full lg:w-8/12 pt-8 bg-white rounded-xl">
            <h1 className="text-3xl lg:text-4xl text-center font-bold leading-9 text-green-800 pb-4">
              CDeC Leadership
            </h1>
            <div className="grid sm:grid-cols-2 grid-cols-1 lg:gap-4 shadow-lg rounded-md p-4">
              <div className="p-4 pb-6 flex justify-center flex-col items-center">
                <img
                  className="md:block  w-48 hidden"
                  src="https://firebasestorage.googleapis.com/v0/b/cusat-tech.appspot.com/o/static%2Fmad.png?alt=media&token=08330a37-1de7-44bb-ade1-33a114015c4b&_gl=1*8w4dy8*_ga*OTEwMzUxNDk3LjE2NjI4Njk4MDg.*_ga_CW55HF8NVT*MTY5Njc4ODc2Mi45MC4xLjE2OTY3OTA0NjAuNDkuMC4w"
                  alt=""
                />
                <img
                  className="md:hidden block"
                  src="https://firebasestorage.googleapis.com/v0/b/cusat-tech.appspot.com/o/static%2Fmad.png?alt=media&token=08330a37-1de7-44bb-ade1-33a114015c4b&_gl=1*8w4dy8*_ga*OTEwMzUxNDk3LjE2NjI4Njk4MDg.*_ga_CW55HF8NVT*MTY5Njc4ODc2Mi45MC4xLjE2OTY3OTA0NjAuNDkuMC4w"
                  alt=""
                />
                <p className="font-medium text-base leading-5 text-gray-800 mt-4">
                  Prof. (Dr.) Madhu S. Nair <br />
                  &nbsp;&nbsp;&nbsp; Director, CDeC
                </p>
              </div>
              <div className="p-4 pb-6 flex justify-center flex-col items-center">
                <img
                  className="md:block w-48 hidden"
                  src="https://firebasestorage.googleapis.com/v0/b/cusat-tech.appspot.com/o/static%2Fsmi%20(1).jpg?alt=media&token=e0a8ba07-d2a3-448b-a8e2-02797f02ace5&_gl=1*1r5p6x3*_ga*OTEwMzUxNDk3LjE2NjI4Njk4MDg.*_ga_CW55HF8NVT*MTY5Njc4ODc2Mi45MC4xLjE2OTY3OTA5NjAuNDYuMC4w"
                  alt=""
                />
                <img
                  className="md:hidden block"
                  src="https://firebasestorage.googleapis.com/v0/b/cusat-tech.appspot.com/o/static%2Fsmi%20(1).jpg?alt=media&token=e0a8ba07-d2a3-448b-a8e2-02797f02ace5&_gl=1*1r5p6x3*_ga*OTEwMzUxNDk3LjE2NjI4Njk4MDg.*_ga_CW55HF8NVT*MTY5Njc4ODc2Mi45MC4xLjE2OTY3OTA5NjAuNDYuMC4w"
                  alt=""
                />
                <p className="font-medium text-base leading-5 text-gray-800 mt-4">
                  Dr. Smiju Sudevan <br />
                  Asst. Director, CDeC
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default AboutPage
