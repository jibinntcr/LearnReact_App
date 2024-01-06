import React from 'react'
import UpdateBgImgCusatech2 from "../../../components/NewForms/UpdateBgImgCusatech2"

import FormDesign from "./../../../components/NewForms/FormDesign"
import RootLayout from '../../../components/SideBar/RootLayout'

function SelectImagecusatech2() {
    return (
        <RootLayout>
            <FormDesign text={ "Change HomePage Image For Cusatech" } formJsx={<UpdateBgImgCusatech2 />} />
        </RootLayout>
    )
}

export default SelectImagecusatech2