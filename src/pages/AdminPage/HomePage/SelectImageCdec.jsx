import React from 'react'
import HomePageCdecImage from "../../../components/NewForms/HomePageCdecImage"

import FormDesign from "./../../../components/NewForms/FormDesign"
import RootLayout from '../../../components/SideBar/RootLayout'

function SelectImageCdec() {
    return (
        <RootLayout>
            <FormDesign text={ "Change HomePage Image For Cdec" } formJsx={<HomePageCdecImage />} />
        </RootLayout>
    )
}

export default SelectImageCdec