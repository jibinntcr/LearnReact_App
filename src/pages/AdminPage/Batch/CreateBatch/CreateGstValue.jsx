import React from "react"

import FromDesign from "../../../../components/NewForms/FormDesign"
import CreateGstValueForm from "./CreateGstValueForm"
import RootLayout from "../../../../components/SideBar/RootLayout"

function CreateGstValue() {
    return (
        <RootLayout>
            <FromDesign text={"Gst Value"} formJsx={<CreateGstValueForm />} />
        </RootLayout>
    )
}

export default CreateGstValue








