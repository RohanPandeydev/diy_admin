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

const RoutesPath = () => {

    return <>
        <Route path="/" element={<RequireAuth><Dashboard /></RequireAuth>} />,
        <Route path="/login" element={<Login />} />,

        {/* Staff */}
        <Route path="/management/staff" element={<ProtectedRoute moduleName={"staff"} action="view"><Staff /></ProtectedRoute>} />,
        <Route path="/management/staff/:id" element={<ProtectedRoute action="view" moduleName={"staff"}><StaffDetails /></ProtectedRoute>} />,
        <Route path="/management/staff/add" element={<ProtectedRoute action="add" moduleName={"staff"}><AddStaff /></ProtectedRoute>} />,
        <Route path="/management/staff/update/:id" element={<ProtectedRoute action="update" moduleName={"staff"}><UpdateStaff /></ProtectedRoute>} />,
        {/* /end */}
        {/* Blog */}
        <Route path="/cms/blog" element={<ProtectedRoute moduleName={"blog"} action="view"><Blog /></ProtectedRoute>} />,
        <Route path="/cms/blog/:slug" element={<ProtectedRoute moduleName={"blog"} action="view"><BlogDetails /></ProtectedRoute>} />,
        <Route path="/cms/blog/add" element={<ProtectedRoute moduleName={"blog"} action="create"><AddBlog /></ProtectedRoute>} />,
        <Route path="/cms/blog/update/:slug" element={<ProtectedRoute moduleName={"blog"} action="update"><UpdateBlog /></ProtectedRoute>} />,
        {/* /end */}

        {/* SEO  */}
        <Route path="/seo/:parentslug?/:childslug?/:gslug?/update" element={<ProtectedRoute moduleName={"seo"} action="update"><UpdateSeo /></ProtectedRoute>} />
        <Route path="/seo/:parentslug?/:childslug?/:gslug?/add" element={<ProtectedRoute moduleName={"seo"} action="create"><AddSeo /></ProtectedRoute>} />
        <Route path="/seo/:parentslug?/:childslug?/:gslug/details" element={<ProtectedRoute moduleName={"seo"} action="view"><SeoDetails /></ProtectedRoute>} />
        <Route path="/seo/:parentslug?/:childslug?/:gslug?" element={<ProtectedRoute moduleName={"seo"} action="view"><Seo /></ProtectedRoute>} />
        {/* end */}





        <Route path="/sample/form" element={<SampleForm />} />,
        <Route path="/sample/grid" element={<SampleGrid />} />
    </>
}






export default RoutesPath