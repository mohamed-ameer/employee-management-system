import axiosInstance from '../axios'
import {
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_FAIL,
    USER_LOGOUT,
    USER_REGISTER_REQUEST,
    USER_REGISTER_SUCCESS,
    USER_REGISTER_FAIL,
    USER_PROFILE_REQUEST,
    USER_PROFILE_SUCCESS,
    USER_PROFILE_FAIL,
    USER_PROFILE_RESET,
    USER_UPDATE_PROFILE_REQUEST,
    USER_UPDATE_PROFILE_SUCCESS,
    USER_UPDATE_PROFILE_FAIL,
    USER_UPDATE_SECURITY_REQUEST,
    USER_UPDATE_SECURITY_SUCCESS,
    USER_UPDATE_SECURITY_FAIL,
    USER_LIST_REQUEST,
    USER_LIST_SUCCESS,
    USER_LIST_FAIL,
    USER_LIST_RESET,
    USER_DELETE_REQUEST,
    USER_DELETE_SUCCESS,
    USER_DELETE_FAIL,
    USER_UPDATE_REQUEST,
    USER_UPDATE_SUCCESS,
    USER_UPDATE_FAIL,
    USER_2FA_ENABLE_REQUEST,
    USER_2FA_ENABLE_SUCCESS,
    USER_2FA_ENABLE_FAIL,
    USER_2FA_DISABLE_REQUEST,
    USER_2FA_DISABLE_SUCCESS,
    USER_2FA_DISABLE_FAIL,
    USER_2FA_VERIFY_REQUEST,
    USER_2FA_VERIFY_SUCCESS,
    USER_2FA_VERIFY_FAIL,
} from '../constants/userConstants'

export const login = (email, password, twoFactorCode = null) => async (dispatch) => {
    try {
        dispatch({
            type: USER_LOGIN_REQUEST
        })

        const { data } = await axiosInstance.post(
            '/users/login/',
            { 'email': email, 'password': password, 'two_factor_code': twoFactorCode }
        )

        dispatch({
            type: USER_LOGIN_SUCCESS,
            payload: data
        })

        localStorage.setItem('userInfo', JSON.stringify(data))

    } catch (error) {
        dispatch({
            type: USER_LOGIN_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}

export const logout = () => (dispatch) => {
    localStorage.removeItem('userInfo')
    dispatch({ type: USER_LOGOUT })
    dispatch({ type: USER_PROFILE_RESET })
    dispatch({ type: USER_LIST_RESET })
}

export const register = (name, email, password) => async (dispatch) => {
    try {
        dispatch({
            type: USER_REGISTER_REQUEST
        })

        const { data } = await axiosInstance.post(
            '/users/register/',
            { 'name': name, 'email': email, 'password': password }
        )

        dispatch({
            type: USER_REGISTER_SUCCESS,
            payload: data
        })

        dispatch({
            type: USER_LOGIN_SUCCESS,
            payload: data
        })

        localStorage.setItem('userInfo', JSON.stringify(data))

    } catch (error) {
        dispatch({
            type: USER_REGISTER_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}

export const getUserProfile = (id) => async (dispatch, getState) => {
    try {
        dispatch({
            type: USER_PROFILE_REQUEST
        })

        const {
            userLogin: { userInfo },
        } = getState()

        const { data } = await axiosInstance.get(
            `/users/${id}/`,
            {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`
                }
            }
        )

        dispatch({
            type: USER_PROFILE_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: USER_PROFILE_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}

export const updateUserProfile = (user) => async (dispatch, getState) => {
    try {
        dispatch({
            type: USER_UPDATE_PROFILE_REQUEST
        })

        const {
            userLogin: { userInfo },
        } = getState()

        const { data } = await axiosInstance.put(
            `/users/profile/update/`,
            user,
            {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`
                }
            }
        )

        dispatch({
            type: USER_UPDATE_PROFILE_SUCCESS,
            payload: data
        })

        dispatch({
            type: USER_LOGIN_SUCCESS,
            payload: data
        })

        localStorage.setItem('userInfo', JSON.stringify(data))

    } catch (error) {
        dispatch({
            type: USER_UPDATE_PROFILE_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}

export const updateUserSecurity = (securityData) => async (dispatch, getState) => {
    try {
        dispatch({
            type: USER_UPDATE_SECURITY_REQUEST
        })

        const {
            userLogin: { userInfo },
        } = getState()

        const { data } = await axiosInstance.put(
            `/users/security/update/`,
            securityData,
            {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`
                }
            }
        )

        dispatch({
            type: USER_UPDATE_SECURITY_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: USER_UPDATE_SECURITY_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}

export const listUsers = (keyword = '') => async (dispatch, getState) => {
    try {
        dispatch({
            type: USER_LIST_REQUEST
        })

        const {
            userLogin: { userInfo },
        } = getState()

        const { data } = await axiosInstance.get(
            `/users${keyword}`,
            {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`
                }
            }
        )

        dispatch({
            type: USER_LIST_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: USER_LIST_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}

export const deleteUser = (id) => async (dispatch, getState) => {
    try {
        dispatch({
            type: USER_DELETE_REQUEST
        })

        const {
            userLogin: { userInfo },
        } = getState()

        await axiosInstance.delete(
            `/users/delete/${id}/`,
            {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`
                }
            }
        )

        dispatch({
            type: USER_DELETE_SUCCESS
        })

    } catch (error) {
        dispatch({
            type: USER_DELETE_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}

export const updateUser = (user) => async (dispatch, getState) => {
    try {
        dispatch({
            type: USER_UPDATE_REQUEST
        })

        const {
            userLogin: { userInfo },
        } = getState()

        const { data } = await axiosInstance.put(
            `/users/update/${user.id}/`,
            user,
            {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`
                }
            }
        )

        dispatch({
            type: USER_UPDATE_SUCCESS
        })

        dispatch({
            type: USER_PROFILE_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: USER_UPDATE_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}

export const enable2FA = () => async (dispatch, getState) => {
    try {
        dispatch({
            type: USER_2FA_ENABLE_REQUEST
        })

        const {
            userLogin: { userInfo },
        } = getState()

        const { data } = await axiosInstance.post(
            '/users/2fa/enable/',
            {},
            {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`
                }
            }
        )

        dispatch({
            type: USER_2FA_ENABLE_SUCCESS,
            payload: data.qr_code
        })

    } catch (error) {
        dispatch({
            type: USER_2FA_ENABLE_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}

export const disable2FA = (verificationCode) => async (dispatch, getState) => {
    try {
        dispatch({
            type: USER_2FA_DISABLE_REQUEST
        })

        const {
            userLogin: { userInfo },
        } = getState()

        await axiosInstance.post(
            '/users/2fa/disable/',
            { verification_code: verificationCode },
            {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`
                }
            }
        )

        dispatch({
            type: USER_2FA_DISABLE_SUCCESS
        })

        // Update user info to reflect 2FA is disabled
        const updatedUserInfo = {
            ...userInfo,
            two_factor_enabled: false
        }
        dispatch({
            type: USER_LOGIN_SUCCESS,
            payload: updatedUserInfo
        })
        localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo))

    } catch (error) {
        dispatch({
            type: USER_2FA_DISABLE_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}

export const verify2FA = (verificationCode) => async (dispatch, getState) => {
    try {
        dispatch({
            type: USER_2FA_VERIFY_REQUEST
        })

        const {
            userLogin: { userInfo },
        } = getState()

        const { data } = await axiosInstance.post(
            '/users/2fa/verify/',
            { verification_code: verificationCode },
            {
                headers: {
                    Authorization: `Bearer ${userInfo.token}`
                }
            }
        )

        dispatch({
            type: USER_2FA_VERIFY_SUCCESS
        })

        // Update user info to reflect 2FA is enabled
        const updatedUserInfo = {
            ...userInfo,
            two_factor_enabled: true
        }
        dispatch({
            type: USER_LOGIN_SUCCESS,
            payload: updatedUserInfo
        })
        localStorage.setItem('userInfo', JSON.stringify(updatedUserInfo))

    } catch (error) {
        dispatch({
            type: USER_2FA_VERIFY_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}