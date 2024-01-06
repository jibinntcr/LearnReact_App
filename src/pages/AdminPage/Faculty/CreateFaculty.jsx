import RootLayout from '../../../components/SideBar/RootLayout'
import FormDesign from "../../../components/NewForms/FormDesign"
import CreateFacultyForm from './CreateFacultyForm'

function CreateFaculty() {
    return (
        <RootLayout><FormDesign text={"Create Faculty"} formJsx={<CreateFacultyForm />} /></RootLayout>
    )
}

export default CreateFaculty