import axiosInstance from '../axios'
import {
    COMPANY_LIST_REQUEST,
    COMPANY_LIST_SUCCESS,
    COMPANY_LIST_FAIL,
    COMPANY_DETAILS_REQUEST,
    COMPANY_DETAILS_SUCCESS,
    COMPANY_DETAILS_FAIL,
    COMPANY_CREATE_REQUEST,
    COMPANY_CREATE_SUCCESS,
    COMPANY_CREATE_FAIL,
    COMPANY_UPDATE_REQUEST,
    COMPANY_UPDATE_SUCCESS,
    COMPANY_UPDATE_FAIL,
    COMPANY_DELETE_REQUEST,
    COMPANY_DELETE_SUCCESS,
    COMPANY_DELETE_FAIL,
} from '../constants/companyConstants'

export const listCompanies = (keyword = '') => async (dispatch, getState) => {
    try {
        dispatch({ type: COMPANY_LIST_REQUEST })

        const { data } = await axiosInstance.get(`/companies/${keyword}`)

        dispatch({
            type: COMPANY_LIST_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: COMPANY_LIST_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}

export const getCompanyDetails = (id) => async (dispatch, getState) => {
    try {
        dispatch({ type: COMPANY_DETAILS_REQUEST })

        const { data } = await axiosInstance.get(`/companies/${id}/`)

        dispatch({
            type: COMPANY_DETAILS_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: COMPANY_DETAILS_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}

export const createCompany = (company) => async (dispatch, getState) => {
    try {
        dispatch({ type: COMPANY_CREATE_REQUEST })

        const { data } = await axiosInstance.post(
            '/companies/create/',
            company
        )

        dispatch({
            type: COMPANY_CREATE_SUCCESS,
            payload: data,
        })

    } catch (error) {
        dispatch({
            type: COMPANY_CREATE_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}

export const updateCompany = (company) => async (dispatch, getState) => {
    try {
        dispatch({ type: COMPANY_UPDATE_REQUEST })

        const { data } = await axiosInstance.put(
            `/companies/${company.id}/update/`,
            company
        )

        dispatch({
            type: COMPANY_UPDATE_SUCCESS,
            payload: data,
        })

    } catch (error) {
        dispatch({
            type: COMPANY_UPDATE_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}

export const deleteCompany = (id) => async (dispatch, getState) => {
    try {
        dispatch({ type: COMPANY_DELETE_REQUEST })

        await axiosInstance.delete(`/companies/${id}/delete/`)

        dispatch({
            type: COMPANY_DELETE_SUCCESS,
        })

    } catch (error) {
        dispatch({
            type: COMPANY_DELETE_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}
