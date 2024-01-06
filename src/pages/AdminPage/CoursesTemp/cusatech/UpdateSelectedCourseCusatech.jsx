import React from 'react'
import UpdateFormCusatech from "../../../../components/NewForms/UpdateFormCusatech"
import FormDesign from "../../../../components/NewForms/FormDesign"
import RootLayout from '../../../../components/SideBar/RootLayout'


function UpdateSelectedCourseCusatech() {
    return (
        <RootLayout>
            <FormDesign text={" Update Course - CusaTech"} formJsx={<UpdateFormCusatech />} />
        </RootLayout>
        // <Sidebar2 mainContent={<FormDesign text={" Update Course - CDEC"} formJsx={<UpdateForm />} />} />
    )
}

export default UpdateSelectedCourseCusatech