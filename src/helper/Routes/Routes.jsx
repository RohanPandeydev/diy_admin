import { Route } from "react-router";
import Dashboard from "../../pages/Dashboard";
import Login from "../../pages/Login";
import SampleForm from "../../pages/SampleForm";
import SampleGrid from "../../pages/SampleGrid";
import RequireAuth from "../../guard/RoutesGuard";
import Blog from "../../pages/Blog";
import BlogDetails from "../../pages/BlogDetails";
import AddBlog from "../../pages/AddBlog";
import UpdateBlog from "../../pages/UpdateBlog";
import Seo from "../../pages/Seo";
import UpdateSeo from "../../pages/UpdateSeo";
import AddSeo from "../../pages/AddSeo";
import SeoDetails from "../../pages/SeoDetails";
import Staff from "../../pages/Staff";
import StaffDetails from "../../pages/StaffDetails";
import AddStaff from "../../pages/AddStaff";
import UpdateStaff from "../../pages/UpdateStaff";
import ProtectedRoute from "../../guard/RBACGuard";
import FormQuery from "../../pages/FormQuery";

const RoutesPath = () => {

    return <>
        <Route path="/" element={<RequireAuth><Dashboard /></RequireAuth>} />,
        <Route path="/login" element={<Login />} />,

        {/* Staff */}
        <Route path="/management/staff" element={<RequireAuth moduleName={"staff"} action="view"><Staff /></RequireAuth>} />,
        <Route path="/management/staff/:id" element={<RequireAuth action="view" moduleName={"staff"}><StaffDetails /></RequireAuth>} />,
        <Route path="/management/staff/add" element={<RequireAuth action="add" moduleName={"staff"}><AddStaff /></RequireAuth>} />,
        <Route path="/management/staff/update/:id" element={<RequireAuth action="update" moduleName={"staff"}><UpdateStaff /></RequireAuth>} />,
        {/* /end */}
        {/* Blog */}
        <Route path="/cms/blog" element={<RequireAuth moduleName={"blog"} action="view"><Blog /></RequireAuth>} />,
        <Route path="/cms/blog/:slug" element={<RequireAuth moduleName={"blog"} action="view"><BlogDetails /></RequireAuth>} />,
        <Route path="/cms/blog/add" element={<RequireAuth moduleName={"blog"} action="create"><AddBlog /></RequireAuth>} />,
        <Route path="/cms/blog/update/:slug" element={<RequireAuth moduleName={"blog"} action="update"><UpdateBlog /></RequireAuth>} />,
        {/* /end */}

        {/* SEO  */}
        <Route path="/seo/:parentslug?/:childslug?/:gslug?/update" element={<RequireAuth moduleName={"seo"} action="update"><UpdateSeo /></RequireAuth>} />
        <Route path="/seo/:parentslug?/:childslug?/:gslug?/add" element={<RequireAuth moduleName={"seo"} action="create"><AddSeo /></RequireAuth>} />
        <Route path="/seo/:parentslug?/:childslug?/:gslug/details" element={<RequireAuth moduleName={"seo"} action="view"><SeoDetails /></RequireAuth>} />
        <Route path="/seo/:parentslug?/:childslug?/:gslug?" element={<RequireAuth moduleName={"seo"} action="view"><Seo /></RequireAuth>} />
        {/* end */}

     {/* Form Query */}
        <Route path="/form/design-consultant" element={<RequireAuth moduleName={"blog"} action="view"><FormQuery /></RequireAuth>} />,
        <Route path="/form/inquiry" element={<RequireAuth moduleName={"blog"} action="view"><FormQuery /></RequireAuth>} />,
        <Route path="/form/contact" element={<RequireAuth moduleName={"blog"} action="view"><FormQuery /></RequireAuth>} />,
    
        {/* /end */}



        <Route path="/sample/form" element={<SampleForm />} />,
        <Route path="/sample/grid" element={<SampleGrid />} />
    </>
}






export default RoutesPath