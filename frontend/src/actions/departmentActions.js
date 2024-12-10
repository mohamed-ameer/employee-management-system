import axiosInstance from '../axios'
import {
    DEPARTMENT_LIST_REQUEST,
    DEPARTMENT_LIST_SUCCESS,
    DEPARTMENT_LIST_FAIL,
    DEPARTMENT_DETAILS_REQUEST,
    DEPARTMENT_DETAILS_SUCCESS,
    DEPARTMENT_DETAILS_FAIL,
    DEPARTMENT_CREATE_REQUEST,
    DEPARTMENT_CREATE_SUCCESS,
    DEPARTMENT_CREATE_FAIL,
    DEPARTMENT_UPDATE_REQUEST,
    DEPARTMENT_UPDATE_SUCCESS,
    DEPARTMENT_UPDATE_FAIL,
    DEPARTMENT_DELETE_REQUEST,
    DEPARTMENT_DELETE_SUCCESS,
    DEPARTMENT_DELETE_FAIL,
} from '../constants/departmentConstants'

export const listDepartments = (query = '') => async (dispatch) => {
    try {
        dispatch({ type: DEPARTMENT_LIST_REQUEST })

        const { data } = await axiosInstance.get(`/departments/${query}`)

        dispatch({
            type: DEPARTMENT_LIST_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: DEPARTMENT_LIST_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}

export const getDepartmentDetails = (id) => async (dispatch) => {
    try {
        dispatch({ type: DEPARTMENT_DETAILS_REQUEST })

        const { data } = await axiosInstance.get(`/departments/${id}/`)

        dispatch({
            type: DEPARTMENT_DETAILS_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: DEPARTMENT_DETAILS_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}

export const createDepartment = (department) => async (dispatch) => {
    try {
        dispatch({ type: DEPARTMENT_CREATE_REQUEST })

        const { data } = await axiosInstance.post(
            '/departments/create/',
            department
        )

        dispatch({
            type: DEPARTMENT_CREATE_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: DEPARTMENT_CREATE_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}

export const updateDepartment = (department) => async (dispatch) => {
    try {
        dispatch({ type: DEPARTMENT_UPDATE_REQUEST })

        const { data } = await axiosInstance.put(
            `/departments/${department.id}/update/`,
            department
        )

        dispatch({
            type: DEPARTMENT_UPDATE_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: DEPARTMENT_UPDATE_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}

export const deleteDepartment = (id) => async (dispatch) => {
    try {
        dispatch({ type: DEPARTMENT_DELETE_REQUEST })

        await axiosInstance.delete(`/departments/${id}/delete/`)

        dispatch({
            type: DEPARTMENT_DELETE_SUCCESS,
        })

    } catch (error) {
        dispatch({
            type: DEPARTMENT_DELETE_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}
