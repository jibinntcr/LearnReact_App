import React from "react"
import ChangeBatchForm from "./ChangeBatchForm"
import FromDesign from "../../../../components/NewForms/FormDesign"
import RootLayout from "../../../../components/SideBar/RootLayout"



function ChangeBatch() {
    return (
        <RootLayout>
            <FromDesign text={" Update current batch"} formJsx={<ChangeBatchForm />} />
        </RootLayout>
    )
}

export default ChangeBatch