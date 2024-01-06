import Sidebar2 from '../SideBar2'
import React from 'react'

import FormDesign from "../../../components/NewForms/FormDesign"
import CreateEventForm from './CreateEventForm'
import RootLayout from '../../../components/SideBar/RootLayout'

function CreateEvent() {
    return (
        <>
            {/* <Sidebar2 mainContent={<FormDesign text={"Create Event"} formJsx={<CreateEventForm />} />}/>  */}
            <RootLayout > <FormDesign text={"Create Event"} formJsx={<CreateEventForm />} /> </RootLayout> </>
    )
}

export default CreateEvent