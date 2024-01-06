import RootLayout from "../../../components/SideBar/RootLayout"
import FormDesign from "../../../components/NewForms/FormDesign"
import CreateEditForm from "./CreateEditForm"
import { useParams } from "react-router-dom"

function EditFaculty() {
  const params = useParams()
  // console.log("P:"+params.id)
  return (
    <RootLayout>
      <FormDesign
        text={"Edit Faculty"}
        formJsx={<CreateEditForm id={params.id} />}
      />
    </RootLayout>
  )
}

export default EditFaculty
