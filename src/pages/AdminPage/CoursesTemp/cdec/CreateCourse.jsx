import React from 'react'
import Form from "../../../../components/NewForms/Form"
import FormDesign from "../../../../components/NewForms/FormDesign"
import RootLayout from '../../../../components/SideBar/RootLayout'

function CreateCourse() {
    return (
        <RootLayout>
            <FormDesign text={" Create Course - CDEC"} formJsx={<Form />} />
        </RootLayout>
        // <Sidebar2 mainContent={<FormDesign text={" Create Course - CDEC"} formJsx={<Form />} />} />
    )
}

export default CreateCourse
