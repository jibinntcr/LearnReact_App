import React from "react"
import { FaFacebookF, FaTwitter, FaDribbble, FaBehance } from "react-icons/fa"

import logo from "../../assets/images/logo.png"

function Footer() {

  return (
    <div>

      {/* Footer */}
      <div className="max-h-screen"
        style={{
          paddingTop: 100,
          paddingBottom: 100,
          display: "flex",
          paddingInline: "8vw",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#04091e",
        }}
      >

        <div className="container rounded   py-5">
          <div className="lg:w-full rounded  hover:bg-green-300  p-2  wow fadeIn" data-wow-delay="0.3s">
            <div className="bg-white rounded p-2 grid-cols-1  mx-auto md:w-full pr-4 pl-4  ">
              <iframe className="w-full  mx-auto " title="Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3928.6822478118697!2d76.32210191534956!3d10.043057775045657!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b080c377917e985%3A0xb0fd4b1e85a6e51f!2sCochin%20University%20of%20Science%20and%20Technology!5e0!3m2!1sen!2sin!4v1660813889092!5m2!1sen!2sin"
                style={{ border: 0, allowfullscreen: "", loading: "lazy", height: "250" }}
                referrerPolicy="no-referrer-when-downgrade"></iframe>
            </div></div></div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            // backgroundColor: "green",
            width: "100%",
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              height: 270,
              width: 200,
              //   backgroundColor: "blue",
              margin: "-30px 10px",
              flex: "1 1 150px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-evenly",
              color: "grey",
            }}
          >
            <h3 style={{ color: "white" }}>
              <img src={logo} style={{ width: 147, height: 30 }} alt="" />
            </h3>
            <h4>
              Providing Life Changing Experiences Through Education. Class That
              Fit Your Busy Life. Closer to Home
            </h4>
          </div>

          <div
            style={{
              height: 270,
              width: 200,
              //   backgroundColor: "blue",
              margin: "10px 10px",
              flex: "1 1 150px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-evenly",
              color: "grey",
            }}
          >

          </div>
        </div>
        <div
          style={{
            display: "flex",
            width: "100%",
            flexWrap: "wrap",
            justifyContent: "space-between",
          }}
        >
          <p style={{ fontSize: 15 }}>
            Copyrights 2022 © CITTIC, CUSAT| Made with ♡ by{" "}
            <a href="https://www.google.co.in" style={{ color: "#02c44d", fontWeight: 700 }}>Infinio </a>
          </p>
          <div style={{ display: "flex" }}>
            <div className="footer-buttons">
              <FaFacebookF />
            </div>
            <div className="footer-buttons">
              <FaTwitter />
            </div>
            <div className="footer-buttons">
              <FaDribbble />
            </div>
            <div className="footer-buttons">
              <FaBehance />
            </div>
          </div>
        </div>
      </div>
    </div >
  )
}

export default Footer
