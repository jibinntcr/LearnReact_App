import React from "react"

import FromDesign from "../../../../components/NewForms/FormDesign"

import RootLayout from "../../../../components/SideBar/RootLayout"
import CreateScrollingTextForm from "./CreateScrollingTextForm"

function CreateScrollingText() {
  return (
    <RootLayout>
      <FromDesign
        text={"Create new Scrolling text"}
        formJsx={<CreateScrollingTextForm />}
      />
    </RootLayout>
  )
}

export default CreateScrollingText
