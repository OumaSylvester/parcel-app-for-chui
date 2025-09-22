import axios from "axios";
import { toast } from 'react-toastify';
import { 
    ACTION_SUCCESSFUL_MESSAGE, 
    RESOURCE_NOT_FOUND_MESSAGE, 
    NOTIF_SUCCESS, NOTIF_ERROR, GET
 } from "./constants";

const requestTypeMapper = {
    post: axios.post,
    get: axios.get,
    patch: axios.patch,
    put: axios.put,
    delete: axios.delete
}

const notificationTypeMapper = {
    success: toast.success,
    info: toast.info,
    warning: toast.warn,
    error: toast.error
};

export const getHeaderDetails = (formData) => {
    const {localStorage} = window;
    const accessToken = JSON.parse(localStorage.getItem('tokens'))?.access;
    const config = {
        headers: { Authorization: `Bearer ${accessToken}` }
    };
    
    if (formData){ 
        config.headers['Content-Type'] = "multipart/form-data"; 
    }

    return config;
};


export const fireNotification = (type, message) => {
    const notification = notificationTypeMapper[type];
    notification(message, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        });
  };


export const notificationHandler = (response, successMessage, errorMessage) => {
    switch (response?.status){
        case 200:
            fireNotification(NOTIF_SUCCESS, successMessage || ACTION_SUCCESSFUL_MESSAGE);
            break;
        case 201:
            fireNotification(NOTIF_SUCCESS, successMessage || ACTION_SUCCESSFUL_MESSAGE);
            break;
        case 204:
            fireNotification(NOTIF_SUCCESS, successMessage || ACTION_SUCCESSFUL_MESSAGE);
            break;
        case 400:
            fireNotification(NOTIF_ERROR, errorMessage || response.data.detail)
            break;      
        case 401:
            fireNotification(NOTIF_ERROR, errorMessage || response.data.detail);
            break;
        case 403:
            fireNotification('error', 'Error', errorMessage || response.data.detail);
            break;
        case 404:
            fireNotification('error', 'Error', RESOURCE_NOT_FOUND_MESSAGE);
            break;
        default:
            

    }
} 

// A function to centralize all backend requests
export const makeRequest =  async (url, method, data, authenticated=true, notify=true, isFormData=false, sucessMessage, errorMessage, fieldErrorHandler) => {
    let headerDetails;
    const request = requestTypeMapper[method];
    let response;
    headerDetails = getHeaderDetails(isFormData);

    if (authenticated && headerDetails.headers.Authorization === "Bearer undefined") {
        return;
    }

    authenticated?  headerDetails = getHeaderDetails(isFormData): headerDetails = null;

    try {
        if (method === GET || method === 'delete') {
            response = await request(url, headerDetails);        
        }
         else {
            response = await request(url, data, headerDetails);

        }
        notify && notificationHandler(response, sucessMessage, errorMessage);
        return response?.data;
    } catch (error) {
        console.log(error)
        notify && notificationHandler(error?.response);
        
        fieldErrorHandler && error?.response?.data?.detail || (fieldErrorHandler && fieldErrorHandler(error?.response?.data))

        if (error?.response?.status === 401) {
            // hadle logout
        }
        throw error; // gives u a chance to handle the error in your way
    }
}