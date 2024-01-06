import React from 'react'
import GalleryForm from "../../../components/NewForms/GalleryFormCdec"

import FormDesign from "../../../components/NewForms/FormDesign"
import RootLayout from '../../../components/SideBar/RootLayout'

function InsertImageCdec() {
    return (

      
        <RootLayout>
            <FormDesign text={" Add image to CDeC gallery"} formJsx={<GalleryForm />} />
        </RootLayout>
    )
}

export default InsertImageCdec