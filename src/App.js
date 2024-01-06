import React, { useRef, lazy, Suspense } from "react"
import "./App.css"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
// Components
import Appbar from "./pages/appbar/Appbar"

// auth Components
import ProtectedRoute from "./components/ProtectedRoute"
import AdminProtectedRoute from "./components/AdminProtectedRoute"
import { UserAuthContextProvider } from "./context/UserAuthContext"

// toastify
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
// loading spinner
import Spinner from "./components/Spinner/Spinner"
import CombinedCoursePage from "./pages/CoursesPage/CombinedCoursePage"

// lazy loading import

// common components
const EventsPage = lazy(() => import("./pages/EventsPage/EventsPage"))
const AboutPage = lazy(() => import("./pages/AboutPage/AboutPage"))
const EventsDetailsPage = lazy(() =>
  import("./pages/EventsPage/EventsDetailsPage")
)
const GalleryPage = lazy(() => import("./pages/GalleryPage/GalleryPage"))
const SignIn = lazy(() => import("./pages/LoginPage/SignIn"))
const Page404 = lazy(() => import("./pages/Page404"))

// cusatech components

const CusatechHomePage = lazy(() => import("./pages/Cusatech/CusatechHomePage"))
const CusaTechCoursesPage = lazy(() =>
  import("./pages/CoursesPage/CusaTechCoursesPage")
)
const CusatechNewCourseDetailsPage = lazy(() =>
  import("./pages/NewCourseDetailsPage/CusatechNewCourseDetailsPage")
)

// cdec components

const HomePage = lazy(() => import("./pages/homepage/HomePage"))
const CoursesPage = lazy(() => import("./pages/CoursesPage/CoursesPage"))
const NewCourseDetailsPage = lazy(() =>
  import("./pages/NewCourseDetailsPage/NewCourseDetailsPage")
)

// auth components

// user components
const NewProfilePage = lazy(() =>
  import("./pages/NewProfilePage/NewProfilePage")
)
const EditProfile = lazy(() => import("./pages/EditProfile/EditProfile"))
const CombinedResult = lazy(() => import("./pages/MyCourses/CombinedResult"))

const CheckOutCurriculumCourse = lazy(() =>
  import("./pages/CheckoutPage/CurriculumCourse/CheckOutCurriculumCourse")
)

const CusatechCheckOutCurriculumCourse = lazy(() =>
  import(
    "./pages/CheckoutPage/CurriculumCourse/CusatechCheckOutCurriculumCourse"
  )
)

const CheckoutFullPriceCourse = lazy(() =>
  import("./pages/CheckoutPage/FullPriceCourse/CheckoutFullPrice")
)

const CusatechCheckoutFullPriceCourse = lazy(() =>
  import("./pages/CheckoutPage/FullPriceCourse/CusatechCheckoutFullPrice")
)

// admin components  - department
const CreateDepartments = lazy(() =>
  import("./pages/AdminPage/departments/CreateDepartments")
)

// admin components  - faculty
const CreateFaculty = lazy(() =>
  import("./pages/AdminPage/Faculty/CreateFaculty")
)
const ViewFaculty = lazy(() => import("./pages/AdminPage/Faculty/ViewFaculty"))
const FacultyDetails = lazy(() =>
  import("./pages/AdminPage/Faculty/FacultyDetails")
)
const EditFaculty = lazy(() => import("./pages/AdminPage/Faculty/EditFaculty"))

// admin components  - event
const CreateEvent = lazy(() => import("./pages/AdminPage/Events/CreateEvent"))
const DeleteEvent = lazy(() => import("./pages/AdminPage/Events/DeleteEvent"))

// admin components  - batch
const ChangeBatch = lazy(() =>
  import("./pages/AdminPage/Batch/ChangeBatch/ChangeBatch")
)
const CreateBatch = lazy(() =>
  import("./pages/AdminPage/Batch/CreateBatch/CreateBatch")
)
const SelectBatch = lazy(() =>
  import("./pages/AdminPage/Batch/Schedule/SelectBatch")
)
const CreateGstValue = lazy(() =>
  import("./pages/AdminPage/Batch/CreateBatch/CreateGstValue")
)

// admin components  - course
const UpdateSelect = lazy(() =>
  import("./pages/AdminPage/CoursesTemp/cdec/UpdateSelect")
)
// admin components (cusatech) - course
const CusatechAllCourses = lazy(() =>
  import("./pages/AdminPage/CoursesTemp/cusatech/CusatechAllCourses")
)
const CusaTechCreateCourse = lazy(() =>
  import("./pages/AdminPage/CoursesTemp/cusatech/CusaTechCreateCourse")
)
const CusatechAdminCourseDetailsPage = lazy(() =>
  import("./pages/NewCourseDetailsPage/CusatechAdminCourseDetailsPage")
)
const UpdateSelectCusatech = lazy(() =>
  import("./pages/AdminPage/CoursesTemp/cusatech/UpdateSelectCusatech")
)
const UpdateSelectedCourseCusatech = lazy(() =>
  import("./pages/AdminPage/CoursesTemp/cusatech/UpdateSelectedCourseCusatech")
)

// admin components (cdec) - course
const AllCourses = lazy(() =>
  import("./pages/AdminPage/CoursesTemp/cdec/AllCourses")
)
const CreateCourse = lazy(() =>
  import("./pages/AdminPage/CoursesTemp/cdec/CreateCourse")
)
const AdminCourseDetailsPage = lazy(() =>
  import("./pages/NewCourseDetailsPage/AdminCourseDetailsPage")
)
const UpdateCourses = lazy(() =>
  import("./pages/AdminPage/CoursesTemp/cdec/UpdateCourses")
)
const ScheduledListBatchSelect = lazy(() =>
  import("./pages/AdminPage/Batch/Schedule/CourseList/ScheduledListBatchSelect")
)

// admin components (cdec) - schedule

const ScheduleCdecCourse = lazy(() =>
  import("./pages/AdminPage/Batch/Schedule/ScheduleCdecCourse")
)
const ScheduleCdecCoursePart3 = lazy(() =>
  import("./pages/AdminPage/Batch/Schedule/ScheduleCdecCoursePart3")
)
const SelectDeleteScheduleCourse = lazy(() =>
  import("./pages/AdminPage/DeleteScheduleCourse/SelectDeleteScheduleCourse")
)
const SelectCourseDeleteScheduleCdec = lazy(() =>
  import(
    "./pages/AdminPage/DeleteScheduleCourse/SelectCourseDeleteScheduleCdec"
  )
)
const ScheduledBatchCdec = lazy(() =>
  import("./pages/AdminPage/Batch/Schedule/ScheduleUpdate/ScheduledBatch")
)
const ScheduledBatchCourseSelectCdec = lazy(() =>
  import(
    "./pages/AdminPage/Batch/Schedule/ScheduleUpdate/ScheduledBatchCourseSelectCdec"
  )
)
const ScheduledBatchEditCdecFinal = lazy(() =>
  import(
    "./pages/AdminPage/Batch/Schedule/ScheduleUpdate/ScheduledBatchEditCdecFinal"
  )
)
const ScheduledCourseList = lazy(() =>
  import("./pages/AdminPage/Batch/Schedule/CourseList/ScheduledCourseList")
)

// admin components (cusatech) - schedule

const ScheduleCusatechCoursePart3 = lazy(() =>
  import("./pages/AdminPage/Batch/Schedule/ScheduleCusatechCoursePart3")
)
const ScheduleCusatechCourse = lazy(() =>
  import("./pages/AdminPage/Batch/Schedule/ScheduleCusatechCourse")
)
const SelectCourseDeleteScheduleCusaTech = lazy(() =>
  import(
    "./pages/AdminPage/DeleteScheduleCourse/SelectCourseDeleteScheduleCusaTech"
  )
)
const ScheduleBatchCusaTech = lazy(() =>
  import(
    "./pages/AdminPage/Batch/Schedule/ScheduleUpdate/ScheduleBatchCusaTech"
  )
)
const ScheduleBatchEditCusatechFinal = lazy(() =>
  import(
    "./pages/AdminPage/Batch/Schedule/ScheduleUpdate/ScheduleBatchEditCusatechFinal"
  )
)
const CusatecthScheduledCourse = lazy(() =>
  import("./pages/AdminPage/Batch/Schedule/CourseList/CusatecthScheduledCourse")
)

// admin components  - grading
const SelectBatchGrading = lazy(() =>
  import("./pages/AdminPage/Grading/Select/SelectBatchGrading")
)
// admin components (cdec) - grading
const GradingCdec = lazy(() =>
  import("./pages/AdminPage/Grading/Cdec/GradingCdec")
)
const SelectCourseGradingCdec = lazy(() =>
  import("./pages/AdminPage/Grading/Select/SelectCourseGradingCdec")
)

// admin components (cusatech) - grading

const SelectCourseGradingCusaTech = lazy(() =>
  import("./pages/AdminPage/Grading/Select/SelectCourseGradingCusaTech")
)
const GradingCusaTech = lazy(() =>
  import("./pages/AdminPage/Grading/CusaTech/GradingCusaTech")
)

// admin components  - report
const SelectBatchReport = lazy(() =>
  import("./pages/AdminPage/Report/Select/SelectBatchReport")
)
const EnrollReport = lazy(() =>
  import("./pages/AdminPage/EnrollReport/EnrollReport")
)
const SelectBatchEnrollReport = lazy(() =>
  import("./pages/AdminPage/EnrollReport/Select/SelectEnrollBatchReport")
)

// admin components (cdec) - report
const ReportCdec = lazy(() =>
  import("./pages/AdminPage/Report/Cdec/ReportCdec")
)
const SelectCourseReportCdec = lazy(() =>
  import("./pages/AdminPage/Report/Select/SelectCourseReportCdec")
)
const SelectCourseEnrollReportCdec = lazy(() =>
  import("./pages/AdminPage/EnrollReport/Select/SelectCourseEnrollReportCdec")
)
// admin components (cusatech) - report

const SelectCourseReportCusaTech = lazy(() =>
  import("./pages/AdminPage/Report/Select/SelectCourseReportCusaTech")
)
const ReportCusaTech = lazy(() =>
  import("./pages/AdminPage/Report/CusaTech/ReportCusaTech")
)
const SelectCourseEnrollReportCusaTech = lazy(() =>
  import(
    "./pages/AdminPage/EnrollReport/Select/SelectCourseEnrollReportCusaTech"
  )
)

const EnrollReportCusaTech = lazy(() =>
  import("./pages/AdminPage/EnrollReport/CusaTech/EnrollReportCusaTech")
)

// admin components  -  event

const SelectEventCdec = lazy(() =>
  import("./pages/EventsPage/SelectEventToDisplay/SelectEventCdec")
)
const SelectEventCusatech = lazy(() =>
  import("./pages/EventsPage/SelectEventToDisplay/SelectEventCusatech")
)
// admin components  -  gallery
const DeleteGalleryImageCdec = lazy(() =>
  import("./pages/GalleryPage/DeleteGalleryImageCdec")
)
const InsertImageCdec = lazy(() =>
  import("./pages/AdminPage/Gallery/InsertImageCdec")
)
const CusatechGallery = lazy(() =>
  import("./pages/AdminPage/Gallery/CusatechGallery")
)
const DeleteImageCusatech = lazy(() =>
  import("./pages/GalleryPage/DeleteImageCusatech")
)
// admin components  - update state
const SelectBatchUpdateState = lazy(() =>
  import("./pages/AdminPage/UpadateState/Select/SelectBatchUpdateState")
)

// admin components (cusatech) - update state
const SelectCourseUpdateStateCusaTech = lazy(
  () =>
    import(
      "./pages/AdminPage/UpadateState/Select/SelectCourseUpdateStateCusaTech"
    )
  // import("./pages/AdminPage/UpdateState/Select/SelectCourseUpdateStateCusaTech")
)
const UpdateStateCusaTech = lazy(() =>
  import("./pages/AdminPage/UpadateState/CusaTech/UpdateStateCusaTech")
)
// admin components (cdec) - update state
const UpdateStateCdec = lazy(() =>
  import("./pages/AdminPage/UpadateState/Cdec/UpdateStateCdec")
)

const SelectCourseUpdateStateCdec = lazy(() =>
  import("./pages/AdminPage/UpadateState/Select/SelectCourseUpdateStateCdec")
)

// admin components - homepage edit
const HomePageBatchSelect = lazy(() =>
  import("./pages/AdminPage/HomePageCourse/HomePageBatchSelect")
)

// admin components (cdec) - homepage edit
const HomepageCdecEdit = lazy(() =>
  import("./pages/AdminPage/HomePage/HomepageCdecEdit")
)
const CdecHomePageEdit = lazy(() =>
  import("./pages/AdminPage/HomePage/HomepageEditText")
)
const HomePageCourseSelectCdec = lazy(() =>
  import("./pages/AdminPage/HomePageCourse/Cdec/HomePageCourseSelectCdec")
)
const SelectImageCdec = lazy(() =>
  import("./pages/AdminPage/HomePage/SelectImageCdec")
)
const SelectImageCdec2 = lazy(() =>
  import("./pages/AdminPage/HomePage/SelectImageCdec2")
)

// admin components (cusatech) - homepage edit

const CusatechHomePageEdit = lazy(() =>
  import("./pages/AdminPage/HomePage/CusatechHomePageEdit")
)
const DisplayCourseSelectCusatech = lazy(() =>
  import(
    "./pages/AdminPage/HomePageCourse/Cusatech/DisplayCourseSelectCusatech"
  )
)
const HomepageCusatechEdit = lazy(() =>
  import("./pages/AdminPage/HomePage/HomepageCusatechEdit")
)
const SelectImagecusatech = lazy(() =>
  import("./pages/AdminPage/HomePage/SelectImagecusatech")
)
const SelectImagecusatech2 = lazy(() =>
  import("./pages/AdminPage/HomePage/SelectImagecusatech2")
)

// admin components - homepage edit / Scrolling Text

const CreateScrollingText = lazy(() =>
  import(
    "./pages/AdminPage/ScrollingText/CreateScrollingText/CreateScrollingText"
  )
)

const DeleteScrollingText = lazy(() =>
  import("./pages/AdminPage/ScrollingText/DeleteScrollingText")
)

//admin
const AdminHome = lazy(() =>
  import("./pages/AdminPage/AdminHomePage/AdminHome")
)
// admin components  - users
const Users = lazy(() => import("./pages/Users/Users"))
const UserAction = lazy(() => import("./pages/Users/UserAction"))
// admin components  - department
const SelectDepartment = lazy(() =>
  import("./pages/AdminPage/departments/Course/SelectDepartment")
)
const CreateCourseName = lazy(() =>
  import("./pages/AdminPage/departments/Course/CreateCourseName")
)

function App() {
  const mapScroll = useRef()
  return (
    <Router>
      <UserAuthContextProvider>
        <ToastContainer limit={2} />
        <Appbar mapScroll={mapScroll} />

        <Suspense fallback={<Spinner />}>
          <Routes>
            {/* 404 */}
            <Route path="/*" element={<Page404 />} />
            {/* sign-in page */}
            <Route exact path="/sign-in" element={<SignIn />} />
            <Route path="/sign-in/:location" element={<SignIn />} />
            <Route
              path="/sign-in/courses/:batch/:location"
              element={<SignIn />}
            />
            <Route
              path="/sign-in/cusatech/courses/:batch/:location"
              element={<SignIn />}
            />
            {/* public */}
            <Route path="/about" element={<AboutPage />} />
            <Route path="/Gallery" element={<GalleryPage />} />
            <Route path="/events/:id" element={<EventsDetailsPage />} />
            <Route path="/events" element={<EventsPage />} />
            {/* public  courses */}
            {/* cusatech */}
            <Route path="/Cusatech" element={<CusatechHomePage />} />
            <Route path="/Cusatech/courses" element={<CombinedCoursePage />} />
            <Route
              path="/cusatech/courses/:batch/:id"
              element={<CusatechNewCourseDetailsPage />}
            />
            {/* cdec */}
            <Route exact path="/" element={<HomePage />} />
            <Route path="/courses" element={<CombinedCoursePage />} />
            {/* <Route path="/co" element={<CombinedCoursePage />} /> */}
            <Route
              path="/courses/:batch/:id"
              element={<NewCourseDetailsPage />}
            />
            {/* private */}
            {/* admin proctored */}
            <Route
              path="/cusatech/admin"
              element={
                <AdminProtectedRoute>
                  <AdminHome />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <AdminProtectedRoute>
                  <AdminHome />
                </AdminProtectedRoute>
              }
            />
            {/* admin-  Gallery Cdec */}
            <Route
              path="/admin/Gallery/AddImage"
              element={
                <AdminProtectedRoute>
                  <InsertImageCdec />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/admin/Gallery/DeleteImage"
              element={
                <AdminProtectedRoute>
                  <DeleteGalleryImageCdec />
                </AdminProtectedRoute>
              }
            />
            {/* admin-  Gallery Cusatech */}
            <Route
              path="/cusatech/admin/Gallery/AddImage"
              element={
                <AdminProtectedRoute>
                  <CusatechGallery />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/cusatech/admin/Gallery/DeleteImage"
              element={
                <AdminProtectedRoute>
                  <DeleteImageCusatech />
                </AdminProtectedRoute>
              }
            />

            {/* admin-  CreateDepartments */}
            <Route
              path="/admin/Departments/CreateDepartments"
              element={
                <AdminProtectedRoute>
                  <CreateDepartments />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/cusatech/admin/Departments/CreateDepartments"
              element={
                <AdminProtectedRoute>
                  <CreateDepartments />
                </AdminProtectedRoute>
              }
            />
            {/* admin-  Select Departments */}
            <Route
              path="/admin/Departments/SelectDepartments/:OfferedBy"
              element={
                <AdminProtectedRoute>
                  <SelectDepartment />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/cusatech/admin/Departments/SelectDepartments/:OfferedBy"
              element={
                <AdminProtectedRoute>
                  <SelectDepartment />
                </AdminProtectedRoute>
              }
            />
            {/* admin-  Create (Department) Course */}
            <Route
              path="/admin/Departments/:department/CreateCours3"
              element={
                <AdminProtectedRoute>
                  <CreateCourseName />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/cusatech/admin/Departments/:department/CreateCours3"
              element={
                <AdminProtectedRoute>
                  <CreateCourseName />
                </AdminProtectedRoute>
              }
            />
            {/* admin-  Event */}
            <Route
              path={`/admin/event/addEvent`}
              element={
                <AdminProtectedRoute>
                  <CreateEvent />
                </AdminProtectedRoute>
              }
            />
            <Route
              path={`/cusatech/admin/event/addEvent`}
              element={
                <AdminProtectedRoute>
                  <CreateEvent />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/admin/event/DeleteEvent"
              element={
                <AdminProtectedRoute>
                  <DeleteEvent />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/cusatech/admin/event/DeleteEvent"
              element={
                <AdminProtectedRoute>
                  <DeleteEvent />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/admin/homepageEdit/SelectEventCdec"
              element={
                <AdminProtectedRoute>
                  <SelectEventCdec />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/cusatech/admin/homepageEdit/SelectEventCusatech"
              element={
                <AdminProtectedRoute>
                  <SelectEventCusatech />
                </AdminProtectedRoute>
              }
            />

            {/* admin-  Faculty */}
            <Route
              path="/admin/Faculty/addFaculty"
              element={
                <AdminProtectedRoute>
                  <CreateFaculty />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/cusatech/admin/Faculty/addFaculty"
              element={
                <AdminProtectedRoute>
                  <CreateFaculty />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/admin/Faculty/ViewFaculty"
              element={
                <AdminProtectedRoute>
                  <ViewFaculty />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/cusatech/admin/Faculty/ViewFaculty"
              element={
                <AdminProtectedRoute>
                  <ViewFaculty />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/admin/Faculty/FacultyDetails/:id"
              element={
                <AdminProtectedRoute>
                  <FacultyDetails />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/cusatech/admin/Faculty/FacultyDetails/:id"
              element={
                <AdminProtectedRoute>
                  <FacultyDetails />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/admin/Faculty/EditDetails/:id"
              element={
                <AdminProtectedRoute>
                  <EditFaculty />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/cusatech/admin/Faculty/EditDetails/:id"
              element={
                <AdminProtectedRoute>
                  <EditFaculty />
                </AdminProtectedRoute>
              }
            />
            {/* admin-  Batch */}

            <Route
              path="/admin/batch/changeBatch"
              element={
                <AdminProtectedRoute>
                  <ChangeBatch />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/cusatech/admin/batch/changeBatch"
              element={
                <AdminProtectedRoute>
                  <ChangeBatch />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/admin/batch/createBatch"
              element={
                <AdminProtectedRoute>
                  <CreateBatch />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/cusatech/admin/batch/createBatch"
              element={
                <AdminProtectedRoute>
                  <CreateBatch />
                </AdminProtectedRoute>
              }
            />
            {/* {admi gst value} */}
            <Route
              path="/admin/batch/GstValue"
              element={
                <AdminProtectedRoute>
                  <CreateGstValue />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/cusatech/admin/batch/GstValue"
              element={
                <AdminProtectedRoute>
                  <CreateGstValue />
                </AdminProtectedRoute>
              }
            />

            {/* Course  */}
            {/*  admin-  Course  CDEC */}
            {/* <Route path="/admin/CDEC/AllCourses" element={<AdminProtectedRoute> <AllCourses /> </AdminProtectedRoute>} /> */}
            <Route
              path="/admin/CDEC/Course/AllCourses"
              element={
                <AdminProtectedRoute>
                  <AllCourses />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/admin/CDEC/Course/CreateCourse"
              element={
                <AdminProtectedRoute>
                  <CreateCourse />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/admin/CDEC/Course/:id"
              element={<AdminCourseDetailsPage />}
            />
            <Route
              path="/admin/CDEC/Course/:id"
              element={<AdminCourseDetailsPage />}
            />

            {/*  admin-  Course   CUSATECH */}

            <Route
              path="/cusatech/admin/CUSATECH/Course/AllCourses"
              element={
                <AdminProtectedRoute>
                  <CusatechAllCourses />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/cusatech/admin/CUSATECH/Course/CreateCourse"
              element={
                <AdminProtectedRoute>
                  <CusaTechCreateCourse />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/cusatech/admin/CUSATECH/Course/:id"
              element={<CusatechAdminCourseDetailsPage />}
            />
            {/* admin-  scheduled Course List Cdec */}
            <Route
              path="/admin/Schedule/List/:OfferedBy"
              element={
                <AdminProtectedRoute>
                  <ScheduledListBatchSelect />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/admin/Schedule/List/:OfferedBy/:batch"
              element={
                <AdminProtectedRoute>
                  <ScheduledCourseList />
                </AdminProtectedRoute>
              }
            />
            {/* admin-  scheduled Course List Cusatech */}
            <Route
              path="/cusatech/admin/Schedule/List/:OfferedBy"
              element={
                <AdminProtectedRoute>
                  <ScheduledListBatchSelect />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/cusatech/admin/Schedule/List/:OfferedBy/:batch"
              element={
                <AdminProtectedRoute>
                  <CusatecthScheduledCourse />
                </AdminProtectedRoute>
              }
            />
            {/* admin-  schedule */}
            <Route
              path="/admin/Schedule/:OfferedBy"
              element={
                <AdminProtectedRoute>
                  <SelectBatch />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/cusatech/admin/Schedule/:OfferedBy"
              element={
                <AdminProtectedRoute>
                  <SelectBatch />
                </AdminProtectedRoute>
              }
            />

            {/* admin-  schedule CDEC */}
            <Route
              path="/admin/Schedule/:batch/cdec"
              element={
                <AdminProtectedRoute>
                  <ScheduleCdecCourse />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/admin/Schedule/:batch/cdec/:courseScheduleId"
              element={
                <AdminProtectedRoute>
                  <ScheduleCdecCoursePart3 />
                </AdminProtectedRoute>
              }
            />

            {/* {admin-  schedule CDEC update} */}
            <Route
              path="/admin/Schedule/:OfferedBy/Update"
              element={
                <AdminProtectedRoute>
                  <ScheduledBatchCdec />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/admin/Schedule/:OfferedBy/Update/:batch"
              element={
                <AdminProtectedRoute>
                  <ScheduledBatchCourseSelectCdec />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/admin/Schedule/cdec/:batch/Update/:courseScheduleId"
              element={
                <AdminProtectedRoute>
                  <ScheduledBatchEditCdecFinal />
                </AdminProtectedRoute>
              }
            />

            {/* {admin-  schedule CUSATECH update} */}
            <Route
              path="/cusatech/admin/Schedule/:OfferedBy/Update"
              element={
                <AdminProtectedRoute>
                  <ScheduledBatchCdec />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/cusatech/admin/Schedule/:OfferedBy/Update/:batch"
              element={
                <AdminProtectedRoute>
                  <ScheduleBatchCusaTech />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/cusatech/admin/Schedule/cusatech/:batch/Update/:courseScheduleId"
              element={
                <AdminProtectedRoute>
                  <ScheduleBatchEditCusatechFinal />
                </AdminProtectedRoute>
              }
            />

            {/*admin-  schedule CUSATECH */}
            <Route
              path="/cusatech/admin/Schedule/:batch/cusatech"
              element={
                <AdminProtectedRoute>
                  <ScheduleCusatechCourse />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/cusatech/admin/Schedule/:batch/cusatech/:courseScheduleId"
              element={
                <AdminProtectedRoute>
                  <ScheduleCusatechCoursePart3 />
                </AdminProtectedRoute>
              }
            />

            {/* admin-  Grading */}
            <Route
              path="/admin/Grading/:OfferedBy"
              element={
                <AdminProtectedRoute>
                  <SelectBatchGrading />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/cusatech/admin/Grading/:OfferedBy"
              element={
                <AdminProtectedRoute>
                  <SelectBatchGrading />
                </AdminProtectedRoute>
              }
            />

            {/* admin-   Grading CDEC*/}
            <Route
              path="/admin/Grading/:batch/cdec"
              element={
                <AdminProtectedRoute>
                  <SelectCourseGradingCdec />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/admin/Grading/:batch/cdec/:courseScheduleId"
              element={
                <AdminProtectedRoute>
                  <GradingCdec />
                </AdminProtectedRoute>
              }
            />

            {/*admin-   Grading  CUSATECH*/}
            <Route
              path="/cusatech/admin/Grading/:batch/cusatech"
              element={
                <AdminProtectedRoute>
                  <SelectCourseGradingCusaTech />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/cusatech/admin/Grading/:batch/cusaTech/:courseScheduleId"
              element={
                <AdminProtectedRoute>
                  <GradingCusaTech />
                </AdminProtectedRoute>
              }
            />

            {/* admin- Payment Report */}

            <Route
              path="/cusatech/admin/Report/payment"
              element={
                <AdminProtectedRoute>
                  <EnrollReport />
                </AdminProtectedRoute>
              }
            />

            <Route
              path="/admin/Report/payment"
              element={
                <AdminProtectedRoute>
                  <EnrollReport />
                </AdminProtectedRoute>
              }
            />

            <Route
              path="/admin/Report/payment/:OfferedBy"
              element={
                <AdminProtectedRoute>
                  <SelectBatchEnrollReport />
                </AdminProtectedRoute>
              }
            />

            <Route
              path="/cusatech/admin/Report/payment/:OfferedBy"
              element={
                <AdminProtectedRoute>
                  <SelectBatchEnrollReport />
                </AdminProtectedRoute>
              }
            />

            <Route
              path="/admin/Report/payment/:batch/cdec"
              element={
                <AdminProtectedRoute>
                  <SelectCourseEnrollReportCdec />
                </AdminProtectedRoute>
              }
            />

            <Route
              path="/cusatech/admin/Report/payment/:batch/cusatech"
              element={
                <AdminProtectedRoute>
                  <SelectCourseEnrollReportCusaTech />
                </AdminProtectedRoute>
              }
            />

            <Route
              path="/admin/Report/payment/:batch/cdec/:courseScheduleId"
              element={
                <AdminProtectedRoute>
                  <EnrollReportCusaTech />
                  {/* same for cusatech and cdec */}
                </AdminProtectedRoute>
              }
            />

            <Route
              path="/cusatech/admin/Report/payment/:batch/cusaTech/:courseScheduleId"
              element={
                <AdminProtectedRoute>
                  <EnrollReportCusaTech />
                </AdminProtectedRoute>
              }
            />

            {/* admin-  Report */}
            <Route
              path="/admin/Report/:OfferedBy"
              element={
                <AdminProtectedRoute>
                  <SelectBatchReport />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/cusatech/admin/Report/:OfferedBy"
              element={
                <AdminProtectedRoute>
                  <SelectBatchReport />
                </AdminProtectedRoute>
              }
            />

            {/* admin-  Report CDEC*/}
            <Route
              path="/admin/Report/:batch/cdec"
              element={
                <AdminProtectedRoute>
                  <SelectCourseReportCdec />
                </AdminProtectedRoute>
              }
            />
            {/* admin-  payment Report cusatech*/}

            {/* admin- pay Report CDEC*/}

            <Route
              path="/admin/Report/:batch/cdec/:courseScheduleId"
              element={
                <AdminProtectedRoute>
                  <ReportCdec />
                </AdminProtectedRoute>
              }
            />

            {/*admin-  Report  CUSATECH*/}
            <Route
              path="/cusatech/admin/Report/:batch/cusatech"
              element={
                <AdminProtectedRoute>
                  <SelectCourseReportCusaTech />
                </AdminProtectedRoute>
              }
            />

            <Route
              path="/cusatech/admin/Report/:batch/cusaTech/:courseScheduleId"
              element={
                <AdminProtectedRoute>
                  <ReportCusaTech />
                </AdminProtectedRoute>
              }
            />

            {/*  {HomePage Course Display Cdec} */}
            <Route
              path="/admin/homepageEdit/batchDisplayHomeSelect/:OfferedBy"
              element={
                <AdminProtectedRoute>
                  <HomePageBatchSelect />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/admin/homepageEdit/courseDisplayHomeSelect/:batch/cdec"
              element={
                <AdminProtectedRoute>
                  <HomePageCourseSelectCdec />
                </AdminProtectedRoute>
              }
            />

            {/*  {HomePage Course Display Cusatech} */}
            <Route
              path="/cusatech/admin/homepageEdit/batchDisplayHomeSelect/:OfferedBy"
              element={
                <AdminProtectedRoute>
                  <HomePageBatchSelect />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/cusatech/admin/homepageEdit/courseDisplayHomeSelect/:batch/cusatech"
              element={
                <AdminProtectedRoute>
                  <DisplayCourseSelectCusatech />
                </AdminProtectedRoute>
              }
            />
            {/* UpdateState start */}

            {/* admin-  UpdateState */}
            <Route
              path="/admin/UpdateState/:OfferedBy"
              element={
                <AdminProtectedRoute>
                  <SelectBatchUpdateState />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/cusatech/admin/UpdateState/:OfferedBy"
              element={
                <AdminProtectedRoute>
                  <SelectBatchUpdateState />
                </AdminProtectedRoute>
              }
            />

            {/* admin-  UpdateState CDEC*/}
            <Route
              path="/admin/UpdateState/:batch/cdec"
              element={
                <AdminProtectedRoute>
                  <SelectCourseUpdateStateCdec />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/admin/UpdateState/:batch/cdec/:courseScheduleId"
              element={
                <AdminProtectedRoute>
                  <UpdateStateCdec />
                </AdminProtectedRoute>
              }
            />

            {/*admin-  UpdateState  CUSATECH*/}
            <Route
              path="/cusatech/admin/UpdateState/:batch/cusatech"
              element={
                <AdminProtectedRoute>
                  <SelectCourseUpdateStateCusaTech />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/cusatech/admin/UpdateState/:batch/cusaTech/:courseScheduleId"
              element={
                <AdminProtectedRoute>
                  <UpdateStateCusaTech />
                </AdminProtectedRoute>
              }
            />

            {/* UpdateState end */}

            {/* Home page update start*/}

            <Route
              path="/admin/homepageEdit/CreateScrollingText"
              element={
                <AdminProtectedRoute>
                  <CreateScrollingText />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/admin/homepageEdit/deleteScrollingText"
              element={
                <AdminProtectedRoute>
                  <DeleteScrollingText />
                </AdminProtectedRoute>
              }
            />

            {/* admin-  Home page update cdec select */}
            <Route
              path="/admin/homepageEdit/cdec"
              element={
                <AdminProtectedRoute>
                  <HomepageCdecEdit />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/admin/homepageEdit/cdec/ImageEdit/bg1"
              element={
                <AdminProtectedRoute>
                  <SelectImageCdec />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/admin/homepageEdit/cdec/ImageEdit/bg2"
              element={
                <AdminProtectedRoute>
                  <SelectImageCdec2 />
                </AdminProtectedRoute>
              }
            />

            <Route
              path="/admin/homepageEdit/text"
              element={
                <AdminProtectedRoute>
                  <CdecHomePageEdit />
                </AdminProtectedRoute>
              }
            />
            {/* admin-  Home page update cusatech select */}
            <Route
              path="/cusatech/admin/homepageEdit/cusatech"
              element={
                <AdminProtectedRoute>
                  <HomepageCusatechEdit />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/cusatech/admin/homepageEdit/cusatech/Edit"
              element={
                <AdminProtectedRoute>
                  <CusatechHomePageEdit />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/cusatech/admin/homepageEdit/cusatech/ImageEdit/bg1"
              element={
                <AdminProtectedRoute>
                  <SelectImagecusatech />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/cusatech/admin/homepageEdit/cusatech/ImageEdit/bg2"
              element={
                <AdminProtectedRoute>
                  <SelectImagecusatech2 />
                </AdminProtectedRoute>
              }
            />
            {/* Home page update end*/}

            {/* Delete Schedule start*/}

            {/* admin-  Delete */}
            <Route
              path="/admin/Delete/:OfferedBy"
              element={
                <AdminProtectedRoute>
                  <SelectDeleteScheduleCourse />
                </AdminProtectedRoute>
              }
            />
            {/* admin-  Delete CDEC*/}
            <Route
              path="/admin/Delete/:batch/cdec"
              element={
                <AdminProtectedRoute>
                  <SelectCourseDeleteScheduleCdec />
                </AdminProtectedRoute>
              }
            />
            {/*admin-  Delete  CUSATECH*/}
            <Route
              path="/admin/Delete/:batch/cusatech"
              element={
                <AdminProtectedRoute>
                  <SelectCourseDeleteScheduleCusaTech />
                </AdminProtectedRoute>
              }
            />

            {/* Delete Schedule end*/}

            {/* Update Courses start */}

            {/* admin-  Update */}
            <Route
              path="/admin/Course/cdec/Update"
              element={
                <AdminProtectedRoute>
                  <UpdateSelect />
                </AdminProtectedRoute>
              }
            />
            {/* admin-  Update CDEC*/}
            <Route
              path="/admin/Course/cdec/Update/:courseId"
              element={
                <AdminProtectedRoute>
                  <UpdateCourses />
                </AdminProtectedRoute>
              }
            />
            {/* admin-  Update */}
            <Route
              path="/admin/cusatech/cdec/Update"
              element={
                <AdminProtectedRoute>
                  <UpdateSelect />
                </AdminProtectedRoute>
              }
            />
            {/*admin-  Update  CUSATECH*/}
            <Route
              path="/admin/Course/cusatech/Update/:courseId"
              element={
                <AdminProtectedRoute>
                  <SelectCourseDeleteScheduleCusaTech />
                </AdminProtectedRoute>
              }
            />

            {/* {cusatech course Update} */}
            <Route
              path="/cusatech/admin/Course/cusatech/Update"
              element={
                <AdminProtectedRoute>
                  <UpdateSelectCusatech />
                </AdminProtectedRoute>
              }
            />

            <Route
              path="/cusatech/admin/Course/Update/:courseId"
              element={
                <AdminProtectedRoute>
                  <UpdateSelectedCourseCusatech />
                </AdminProtectedRoute>
              }
            />
            {/* Update Courses end */}

            {/* user proctored */}

            {/* free */}
            <Route
              path="/checkout/CurriculumCourse/:batch/:id"
              element={<CheckOutCurriculumCourse />}
            />
            <Route
              path="/cusatech/checkout/CurriculumCourse/:batch/:id"
              element={<CusatechCheckOutCurriculumCourse />}
            />
            {/* 3000 */}
            <Route
              path="/checkout/:batch/:id"
              element={
                <ProtectedRoute>
                  <CheckoutFullPriceCourse />
                </ProtectedRoute>
              }
            />
            <Route
              path="/cusatech/checkout/:batch/:id"
              element={
                <ProtectedRoute>
                  <CusatechCheckoutFullPriceCourse />
                </ProtectedRoute>
              }
            />
            {/* 2000 */}
            <Route
              path="/checkout/NonCurriculumCourse/:batch/:id"
              element={
                <ProtectedRoute>
                  <EditProfile />
                </ProtectedRoute>
              }
            />
            {/* 1000 */}
            <Route
              path="/checkout/RecognizedInstitutionCourse/:batch/:id"
              element={
                <ProtectedRoute>
                  <EditProfile />
                </ProtectedRoute>
              }
            />

            <Route
              path="/Profile"
              element={
                <ProtectedRoute>
                  <NewProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/Profile/edit"
              element={
                <ProtectedRoute>
                  <EditProfile />
                </ProtectedRoute>
              }
            />

            {/* user-  result */}
            <Route
              path="/Result"
              element={
                <ProtectedRoute>
                  <CombinedResult />
                </ProtectedRoute>
              }
            />

            {/* { List User Cdec} */}
            <Route
              path="/admin/User/view"
              element={
                <ProtectedRoute>
                  <Users />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/User/block/:id"
              element={
                <AdminProtectedRoute>
                  <UserAction />
                </AdminProtectedRoute>
              }
            />
            {/* { List User CusaTech} */}
            <Route
              path="/cusatech/admin/User/view"
              element={
                <AdminProtectedRoute>
                  <Users />
                </AdminProtectedRoute>
              }
            />
            <Route
              path="/cusatech/admin/User/block/:id"
              element={
                <AdminProtectedRoute>
                  <UserAction />
                </AdminProtectedRoute>
              }
            />
          </Routes>
        </Suspense>
      </UserAuthContextProvider>
    </Router>
  )
}

export default App
