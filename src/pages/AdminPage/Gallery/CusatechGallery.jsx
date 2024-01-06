import React from 'react'
import GalleryFormCusaTech from "../../../components/NewForms/GalleryFormCusaTech"

import FormDesign from "../../../components/NewForms/FormDesign"
import RootLayout from '../../../components/SideBar/RootLayout'

function CusatechGallery() {
    return (


        <RootLayout>
            <FormDesign text={" Add image to CusaTech gallery"} formJsx={<GalleryFormCusaTech />} />
        </RootLayout>
    )
}

export default CusatechGallery