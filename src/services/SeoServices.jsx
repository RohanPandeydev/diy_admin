import axios from "axios";
import config from "../../config";
import HttpHeaders from "../helper/httphelper/HttpHeaders";

const SeoServices = {};

SeoServices.seoList = () => {
    return axios.get(`${config.apiUrl}/api/seo`, HttpHeaders.getAuthHeader());
};
SeoServices.seoBySlug = (params) => {
    if (!params?.slug) {
        return []
    }
    return axios.get(`${config.apiUrl}/api/seo/${params.slug}`, HttpHeaders.getAuthHeader());
};
SeoServices.addSeo = (formdata) => {
    return axios.post(`${config.apiUrl}/api/admin/seo`, formdata, HttpHeaders.getAuthHeader());
};
SeoServices.updateSeoBySlug = (formdata) => {
    return axios.put(`${config.apiUrl}/api/admin/seo/${formdata?.get("slugId")}`, formdata, HttpHeaders.getAuthHeader());
};

SeoServices.deleteSeo = (formdata) => {
    return axios.delete(`${config.apiUrl}/api/admin/seo/${formdata?.id}`, HttpHeaders.getAuthHeader());
};

export default SeoServices;
