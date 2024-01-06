import React from "react"
import Marquee from "react-fast-marquee"
import { FiExternalLink } from "react-icons/fi"

const ScrollingText = ({ data }) => {
  return (
    <Marquee speed={40} className="overflow-hidden">
      {data.map((item, index) => (
        <span key={index} className="scroll-text ">
          <div className="flex mr-6">
            {item.title}{" "}
            <a href={item.hyperlink} className="text-green-500 flex ml-1">
              {item.hyperlinkText}
              <FiExternalLink className="ml-1" />
            </a>
          </div>
        </span>
      ))}
    </Marquee>
  )
}

export default ScrollingText
