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
    USER_UPDATE_PROFILE_RESET,
    USER_UPDATE_SECURITY_REQUEST,
    USER_UPDATE_SECURITY_SUCCESS,
    USER_UPDATE_SECURITY_FAIL,
    USER_UPDATE_SECURITY_RESET,
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
    USER_UPDATE_RESET,
    USER_2FA_ENABLE_REQUEST,
    USER_2FA_ENABLE_SUCCESS,
    USER_2FA_ENABLE_FAIL,
    USER_2FA_ENABLE_RESET,
    USER_2FA_DISABLE_REQUEST,
    USER_2FA_DISABLE_SUCCESS,
    USER_2FA_DISABLE_FAIL,
    USER_2FA_DISABLE_RESET,
    USER_2FA_VERIFY_REQUEST,
    USER_2FA_VERIFY_SUCCESS,
    USER_2FA_VERIFY_FAIL,
    USER_2FA_VERIFY_RESET,
} from '../constants/userConstants'

export const userLoginReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_LOGIN_REQUEST:
            return { loading: true }
        case USER_LOGIN_SUCCESS:
            // add isAdmin to userInfo object if action.payload.role == 'admin'
            if (action.payload.role == 'admin') {
                action.payload.isAdmin = true
            }
            if (action.payload.role == 'hr') {
                action.payload.isHR = true
            }
            if (action.payload.role == 'manager') {
                action.payload.isManager = true
            }
            if (action.payload.role == 'employee') {
                action.payload.isEmployee = true
            }
            return { loading: false, userInfo: action.payload }
        case USER_LOGIN_FAIL:
            return { loading: false, error: action.payload }
        case USER_LOGOUT:
            return {}
        default:
            return state
    }
}

export const userRegisterReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_REGISTER_REQUEST:
            return { loading: true }
        case USER_REGISTER_SUCCESS:
            return { loading: false, userInfo: action.payload }
        case USER_REGISTER_FAIL:
            return { loading: false, error: action.payload }
        default:
            return state
    }
}

export const userProfileReducer = (state = { user: {} }, action) => {
    switch (action.type) {
        case USER_PROFILE_REQUEST:
            return { ...state, loading: true }
        case USER_PROFILE_SUCCESS:
            return { loading: false, user: action.payload }
        case USER_PROFILE_FAIL:
            return { loading: false, error: action.payload }
        case USER_PROFILE_RESET:
            return { user: {} }
        default:
            return state
    }
}

export const userUpdateProfileReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_UPDATE_PROFILE_REQUEST:
            return { loading: true }
        case USER_UPDATE_PROFILE_SUCCESS:
            return { loading: false, success: true, userInfo: action.payload }
        case USER_UPDATE_PROFILE_FAIL:
            return { loading: false, error: action.payload }
        case USER_UPDATE_PROFILE_RESET:
            return {}
        default:
            return state
    }
}

export const userUpdateSecurityReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_UPDATE_SECURITY_REQUEST:
            return { loading: true }
        case USER_UPDATE_SECURITY_SUCCESS:
            return { loading: false, success: true }
        case USER_UPDATE_SECURITY_FAIL:
            return { loading: false, error: action.payload }
        case USER_UPDATE_SECURITY_RESET:
            return {}
        default:
            return state
    }
}

export const userListReducer = (state = { users: [] }, action) => {
    switch (action.type) {
        case USER_LIST_REQUEST:
            return { loading: true }
        case USER_LIST_SUCCESS:
            return { loading: false, users: action.payload }
        case USER_LIST_FAIL:
            return { loading: false, error: action.payload }
        case USER_LIST_RESET:
            return { users: [] }
        default:
            return state
    }
}

export const userDeleteReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_DELETE_REQUEST:
            return { loading: true }
        case USER_DELETE_SUCCESS:
            return { loading: false, success: true }
        case USER_DELETE_FAIL:
            return { loading: false, error: action.payload }
        default:
            return state
    }
}

export const userUpdateReducer = (state = { user: {} }, action) => {
    switch (action.type) {
        case USER_UPDATE_REQUEST:
            return { loading: true }
        case USER_UPDATE_SUCCESS:
            return { loading: false, success: true }
        case USER_UPDATE_FAIL:
            return { loading: false, error: action.payload }
        case USER_UPDATE_RESET:
            return { user: {} }
        default:
            return state
    }
}

export const user2FAEnableReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_2FA_ENABLE_REQUEST:
            return { loading: true }
        case USER_2FA_ENABLE_SUCCESS:
            return { loading: false, qrCode: action.payload }
        case USER_2FA_ENABLE_FAIL:
            return { loading: false, error: action.payload }
        case USER_2FA_ENABLE_RESET:
            return {}
        default:
            return state
    }
}

export const user2FADisableReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_2FA_DISABLE_REQUEST:
            return { loading: true }
        case USER_2FA_DISABLE_SUCCESS:
            return { loading: false, success: true }
        case USER_2FA_DISABLE_FAIL:
            return { loading: false, error: action.payload }
        case USER_2FA_DISABLE_RESET:
            return {}
        default:
            return state
    }
}

export const user2FAVerifyReducer = (state = {}, action) => {
    switch (action.type) {
        case USER_2FA_VERIFY_REQUEST:
            return { loading: true }
        case USER_2FA_VERIFY_SUCCESS:
            return { loading: false, success: true }
        case USER_2FA_VERIFY_FAIL:
            return { loading: false, error: action.payload }
        case USER_2FA_VERIFY_RESET:
            return {}
        default:
            return state
    }
}