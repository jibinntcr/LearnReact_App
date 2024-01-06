import React from "react"

import FromDesign from "../../../../components/NewForms/FormDesign"
import CreateBatchForm from "./CreateBatchForm"
import RootLayout from "../../../../components/SideBar/RootLayout"

function CreateBatch() {
  return (
    <RootLayout>
      <FromDesign text={"Create new Batch"} formJsx={<CreateBatchForm />} />
    </RootLayout>
  )
}

export default CreateBatch
