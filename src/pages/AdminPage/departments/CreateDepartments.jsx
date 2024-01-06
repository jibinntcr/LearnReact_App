import FormDesign from "../../../components/NewForms/FormDesign"
import CreateDepartmentsForm from "./CreateDepartmentsForm"
import RootLayout from "../../../components/SideBar/RootLayout"

function CreateDepartments() {
  return (
    <RootLayout>
      <FormDesign
        text={"Create Department / School"}
        formJsx={<CreateDepartmentsForm />}
      />
    </RootLayout>
    // <Sidebar2 mainContent={} /><FormDesign text={"Create Department"} formJsx={<CreateDepartmentsForm />} />
  )
}

export default CreateDepartments
