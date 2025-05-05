import axios from "axios";
import config from "../../config";
import HttpHeaders from "../helper/httphelper/HttpHeaders";

const AuthServices = {};

AuthServices.login = (formdata) => {
    return axios.post(`${config.apiUrl}/api/auth/admin/login`, formdata);
};
AuthServices.logout = (formdata) => {
    return axios.post(`${config.apiUrl}/api/auth/admin/logout`, formdata, HttpHeaders.getAuthHeader());
};

export default AuthServices;
