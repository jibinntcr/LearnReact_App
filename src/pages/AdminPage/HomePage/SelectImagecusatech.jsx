import React from 'react'
import HomePageCusatechImage from "../../../components/NewForms/HomePageCusatechImage"

import FormDesign from "./../../../components/NewForms/FormDesign"
import RootLayout from '../../../components/SideBar/RootLayout'

function SelectImagecusatech() {
    return (
        <RootLayout>
            <FormDesign text={ "Change HomePage Image For Cusatech" } formJsx={<HomePageCusatechImage />} />
        </RootLayout>
    )
}

export default SelectImagecusatech