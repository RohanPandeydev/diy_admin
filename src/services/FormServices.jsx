import axios from "axios";
import config from "../../config";
import HttpHeaders from "../helper/httphelper/HttpHeaders";

const FormServices = {};

FormServices.formQuery = (query) => {
    return axios.get(`${config.apiUrl}/api/admin/form-data/all${query}`, HttpHeaders.getAuthHeader());
};
FormServices.updateFormQuery = (formdata) => {
    return axios.put(`${config.apiUrl}/api/admin/form-data/${formdata?.id}/status`, formdata, HttpHeaders.getAuthHeader());
};
FormServices.delete = (formdata) => {
    return axios.delete(`${config.apiUrl}/api/admin/form-data/${formdata?.id}/destroy`, HttpHeaders.getAuthHeader());
};
export default FormServices;
    