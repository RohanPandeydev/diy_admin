import axios from "axios";
import config from "../../config";
import HttpHeaders from "../helper/httphelper/HttpHeaders";

const StaffServices = {};

StaffServices.staffList = (query) => {
    return axios.get(`${config.apiUrl}/api/admin/users${query}`, HttpHeaders.getAuthHeader());
};
StaffServices.staffById = (params) => {

    return axios.get(`${config.apiUrl}/api/admin/user/${params.id}`, HttpHeaders.getAuthHeader());
};
StaffServices.addStaff = (formdata) => {
    return axios.post(`${config.apiUrl}/api/auth/admin/staff/register`, formdata, HttpHeaders.getAuthHeader());
};
StaffServices.updateStaffById = (formdata) => {
    return axios.put(`${config.apiUrl}/api/admin/user/${formdata?.get("id")}`, formdata, HttpHeaders.getAuthHeader());
};

StaffServices.softDeleteStaff = (formdata) => {
    return axios.delete(`${config.apiUrl}/api/admin/user/${formdata?.id}`, HttpHeaders.getAuthHeader());
};

export default StaffServices;
