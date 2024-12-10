import axiosInstance from '../axios'
import {
    EMPLOYEE_LIST_REQUEST,
    EMPLOYEE_LIST_SUCCESS,
    EMPLOYEE_LIST_FAIL,
    EMPLOYEE_DETAILS_REQUEST,
    EMPLOYEE_DETAILS_SUCCESS,
    EMPLOYEE_DETAILS_FAIL,
    EMPLOYEE_CREATE_REQUEST,
    EMPLOYEE_CREATE_SUCCESS,
    EMPLOYEE_CREATE_FAIL,
    EMPLOYEE_UPDATE_REQUEST,
    EMPLOYEE_UPDATE_SUCCESS,
    EMPLOYEE_UPDATE_FAIL,
    EMPLOYEE_DELETE_REQUEST,
    EMPLOYEE_DELETE_SUCCESS,
    EMPLOYEE_DELETE_FAIL,
    EMPLOYEE_WORKFLOW_UPDATE_REQUEST,
    EMPLOYEE_WORKFLOW_UPDATE_SUCCESS,
    EMPLOYEE_WORKFLOW_UPDATE_FAIL,
} from '../constants/employeeConstants'

export const listEmployees = (keyword = '') => async (dispatch) => {
    try {
        dispatch({ type: EMPLOYEE_LIST_REQUEST })

        const { data } = await axiosInstance.get(`/employees/${keyword}`)

        dispatch({
            type: EMPLOYEE_LIST_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: EMPLOYEE_LIST_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}

export const getEmployeeDetails = (id) => async (dispatch) => {
    try {
        dispatch({ type: EMPLOYEE_DETAILS_REQUEST })

        const { data } = await axiosInstance.get(`/employees/${id}/`)

        dispatch({
            type: EMPLOYEE_DETAILS_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: EMPLOYEE_DETAILS_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}

export const createEmployee = (employee) => async (dispatch) => {
    try {
        dispatch({ type: EMPLOYEE_CREATE_REQUEST })

        const { data } = await axiosInstance.post(
            '/employees/create/',
            employee
        )

        dispatch({
            type: EMPLOYEE_CREATE_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: EMPLOYEE_CREATE_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}

export const updateEmployee = (employee) => async (dispatch) => {
    try {
        dispatch({ type: EMPLOYEE_UPDATE_REQUEST })

        const { data } = await axiosInstance.put(
            `/employees/${employee.id}/update/`,
            employee
        )

        dispatch({
            type: EMPLOYEE_UPDATE_SUCCESS,
            payload: data
        })

        dispatch({
            type: EMPLOYEE_DETAILS_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: EMPLOYEE_UPDATE_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}

export const deleteEmployee = (id) => async (dispatch) => {
    try {
        dispatch({ type: EMPLOYEE_DELETE_REQUEST })

        await axiosInstance.delete(
            `/employees/delete/${id}/`
        )

        dispatch({
            type: EMPLOYEE_DELETE_SUCCESS,
        })

    } catch (error) {
        dispatch({
            type: EMPLOYEE_DELETE_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}

export const updateEmployeeWorkflow = (id, workflowState, notes) => async (dispatch) => {
    try {
        dispatch({ type: EMPLOYEE_WORKFLOW_UPDATE_REQUEST })

        const { data } = await axiosInstance.put(
            `/employees/${id}/workflow/`,
            { workflow_state: workflowState, notes }
        )

        dispatch({
            type: EMPLOYEE_WORKFLOW_UPDATE_SUCCESS,
            payload: data
        })

        // Update employee details after workflow change
        dispatch({
            type: EMPLOYEE_DETAILS_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: EMPLOYEE_WORKFLOW_UPDATE_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}
