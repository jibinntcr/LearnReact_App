import React from 'react'
import UpdateForm from "../../../../components/NewForms/UpdateForm"
import FormDesign from "../../../../components/NewForms/FormDesign"
import Sidebar2 from "../../SideBar2"
import RootLayout from '../../../../components/SideBar/RootLayout'


function CusaTechUpdateCourses() {
    return (
        <RootLayout>
            <FormDesign text={" Update Course - CusaTech"} formJsx={<UpdateForm />} />
        </RootLayout>
        // <Sidebar2 mainContent={<FormDesign text={" Update Course - CDEC"} formJsx={<UpdateForm />} />} />
    )
}

export default CusaTechUpdateCourses