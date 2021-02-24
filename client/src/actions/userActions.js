import axios from "axios";
import {
    GET_ERRORS,
    USER_ADD,
    USER_LOADING,
    USER_UPDATE
} from "./types";

export const addUser = (userData, history) => dispatch => {
    axios
        .post("/api/user-add", userData)
        .then(res =>
            dispatch({
                type: USER_ADD,
                payload: res,
            })
        ).catch(err =>
        dispatch({
            type: GET_ERRORS,
            payload: err.response.data
        })
    );
};


export const updateUser = (userData) => dispatch => {
    axios
        .post("/api/user-update", userData)
        .then(res =>
            dispatch({
                type: USER_UPDATE,
                payload: res,
            })
        ).catch(err =>
        dispatch({
            type: GET_ERRORS,
            payload: err.response.data
        })
    );
};

export const addBiaya = (userData, history) => dispatch => {
    axios
        .post("/expense/Biaya-add", userData)
        .then(res =>
            dispatch({
                type: USER_LOADING,
                payload: res,
            })
        ).catch(err =>
        dispatch({
        })
        );
};

export const addEmployee = (userData, history) => dispatch => {
    axios
        .post("/employee/Emp-add", userData)
        .then(res =>
            dispatch({
                type: USER_LOADING,
                payload: res,
            })
        ).catch(err =>
        dispatch({
        })
        );
};

export const addSupplier = (userData, history) => dispatch => {
    axios
        .post("/supplier/Sup-add", userData)
        .then(res =>
            dispatch({
                type: USER_LOADING,
                payload: res,
            })
        ).catch(err =>
        dispatch({
        })
        );
};

export const addCustomer = (userData, history) => dispatch => {
    axios
        .post("/customer/Cust-add", userData)
        .then(res =>
            dispatch({
                type: USER_LOADING,
                payload: res,
            })
        ).catch(err =>
        dispatch({
        })
        );
};


export const addAkun = (userData, history) => dispatch => {
    axios
        .post("/coa/add-CoA", userData)
        .then(res =>
            dispatch({
                type: USER_LOADING,
                payload: res,
            })
        ).catch(err =>
        dispatch({
        })
        );
};

export const addMainAkun = (userData, history) => dispatch => {
    axios
        .post("/coa/main/MoA-add", userData)
        .then(res =>
            dispatch({
                type: USER_LOADING,
                payload: res,
            })
        ).catch(err =>
        dispatch({
        })
        );
};

export const addSubAkun = (userData, history) => dispatch => {
    axios
        .post("/coa/main/sub/SoA-add", userData)
        .then(res =>
            dispatch({
                type: USER_LOADING,
                payload: res,
            })
        ).catch(err =>
        dispatch({
        })
        );
};


export const addAsset = (userData, history) => dispatch => {
    axios
        .post("/aset/Aset-add", userData)
        .then(res =>
            dispatch({
                type: USER_LOADING,
                payload: res,
            })
        ).catch(err =>
        dispatch({
        })
        );
};

export const addPurchase = (userData, history) => dispatch => {
    axios
        .post("/purchase/purchase-add", userData)
        .then(res =>
            dispatch({
                type: USER_LOADING,
                payload: res,
            })
        ).catch(err =>
        dispatch({
        })
        );
};





