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

const RoutesPath = () => {

    return <>
        <Route path="/" element={<RequireAuth><Dashboard /></RequireAuth>} />,
        <Route path="/login" element={<Login />} />,

        {/* Blog */}
        <Route path="/cms/blog" element={<Blog />} />,
        <Route path="/cms/blog/:slug" element={<BlogDetails />} cd />,
        <Route path="/cms/blog/add" element={<AddBlog />} />,
        <Route path="/cms/blog/update/:slug" element={<UpdateBlog />} />,
        {/* /end */}

        {/* SEO  */}
        <Route path="/seo/:parentslug?/:childslug?/:gslug?/update" element={<UpdateSeo />} />
        <Route path="/seo/:parentslug?/:childslug?/:gslug?/add" element={<AddSeo />} />
        <Route path="/seo/:parentslug?/:childslug?/:gslug/details" element={<SeoDetails />} />
        <Route path="/seo/:parentslug?/:childslug?/:gslug?" element={<Seo />} />
        {/* end */}





        <Route path="/sample/form" element={<SampleForm />} />,
        <Route path="/sample/grid" element={<SampleGrid />} />
    </>
}






export default RoutesPath