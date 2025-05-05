import axios from "axios";
import config from "../../config";
import HttpHeaders from "../helper/httphelper/HttpHeaders";

const CategoryServices = {};

CategoryServices.categoryList = (query) => {
    return axios.get(`${config.apiUrl}/api/category${query}`, HttpHeaders.getAuthHeader());
};
CategoryServices.categoryBySlug = (params) => {
    if (!params?.slug) {
        return []
    }
    return axios.get(`${config.apiUrl}/api/category/${params.slug}`, HttpHeaders.getAuthHeader());
};
CategoryServices.addCategory = (formdata) => {
    return axios.post(`${config.apiUrl}/api/admin/category`, formdata, HttpHeaders.getAuthHeader());
};
CategoryServices.updateCategoryBySlug = (formdata) => {
    return axios.put(`${config.apiUrl}/api/admin/category/${formdata?.get("slugId")}`, formdata, HttpHeaders.getAuthHeader());
};
CategoryServices.updateCategoryStatusBySlug = (formdata) => {
    return axios.put(`${config.apiUrl}/api/admin/category/${formdata.slugId}`, formdata, HttpHeaders.getAuthHeader());
};
CategoryServices.softDeleteCategory = (formdata) => {
    return axios.delete(`${config.apiUrl}/api/admin/category/${formdata?.id}`, HttpHeaders.getAuthHeader());
};

export default CategoryServices;
