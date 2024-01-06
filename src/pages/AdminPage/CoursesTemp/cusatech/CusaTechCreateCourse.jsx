import React from "react"
import CusatechCreateCourseForm from "../../../../components/NewForms/CusatechCreateCourseForm"
import FormDesign from "../../../../components/NewForms/FormDesign"
import RootLayout from "../../../../components/SideBar/RootLayout"

function CusaTechCreateCourse() {
    return (
        <RootLayout>
            <FormDesign text={"Create Course - CUSATECH"} formJsx={<CusatechCreateCourseForm />} />
        </RootLayout>
    )
}

export default CusaTechCreateCourse