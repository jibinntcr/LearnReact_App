import React from 'react'
import HomePageCdecImage from "../../../components/NewForms/UpdateBgImgCdec2"

import FormDesign from "./../../../components/NewForms/FormDesign"
import RootLayout from '../../../components/SideBar/RootLayout'

function SelectImageCdec2() {
    return (
        <RootLayout>
            <FormDesign text={ "Change HomePage Image For Cdec" } formJsx={<HomePageCdecImage />} />
        </RootLayout>
    )
}

export default SelectImageCdec2