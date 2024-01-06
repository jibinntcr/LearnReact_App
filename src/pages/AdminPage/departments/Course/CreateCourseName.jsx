
import FormDesign from "../../../../components/NewForms/FormDesign"
import CreateCourseNameForm from './CreateCourseNameForm'
import RootLayout from '../../../../components/SideBar/RootLayout'

function CreateCourseName() {
    return (
        <RootLayout>
            <FormDesign text={"Create Course(name)"} formJsx={<CreateCourseNameForm />} />
        </RootLayout>

    )
}

export default CreateCourseName


