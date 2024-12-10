import {
    EMPLOYEE_LIST_REQUEST,
    EMPLOYEE_LIST_SUCCESS,
    EMPLOYEE_LIST_FAIL,
    EMPLOYEE_LIST_RESET,
    EMPLOYEE_DETAILS_REQUEST,
    EMPLOYEE_DETAILS_SUCCESS,
    EMPLOYEE_DETAILS_FAIL,
    EMPLOYEE_DETAILS_RESET,
    EMPLOYEE_CREATE_REQUEST,
    EMPLOYEE_CREATE_SUCCESS,
    EMPLOYEE_CREATE_FAIL,
    EMPLOYEE_CREATE_RESET,
    EMPLOYEE_UPDATE_REQUEST,
    EMPLOYEE_UPDATE_SUCCESS,
    EMPLOYEE_UPDATE_FAIL,
    EMPLOYEE_UPDATE_RESET,
    EMPLOYEE_DELETE_REQUEST,
    EMPLOYEE_DELETE_SUCCESS,
    EMPLOYEE_DELETE_FAIL,
    EMPLOYEE_WORKFLOW_UPDATE_REQUEST,
    EMPLOYEE_WORKFLOW_UPDATE_SUCCESS,
    EMPLOYEE_WORKFLOW_UPDATE_FAIL,
    EMPLOYEE_WORKFLOW_UPDATE_RESET,
} from '../constants/employeeConstants'

export const employeeListReducer = (state = { employees: [] }, action) => {
    switch (action.type) {
        case EMPLOYEE_LIST_REQUEST:
            return { loading: true, employees: [] }

        case EMPLOYEE_LIST_SUCCESS:
            return {
                loading: false,
                employees: action.payload,
                page: action.payload.page,
                pages: action.payload.pages,
                count: action.payload.count
            }

        case EMPLOYEE_LIST_FAIL:
            return { loading: false, error: action.payload }

        case EMPLOYEE_LIST_RESET:
            return { employees: [] }

        default:
            return state
    }
}

export const employeeDetailsReducer = (state = { employee: {} }, action) => {
    switch (action.type) {
        case EMPLOYEE_DETAILS_REQUEST:
            return { ...state, loading: true }

        case EMPLOYEE_DETAILS_SUCCESS:
            return { loading: false, employee: action.payload }

        case EMPLOYEE_DETAILS_FAIL:
            return { loading: false, error: action.payload }

        case EMPLOYEE_DETAILS_RESET:
            return { employee: {} }

        default:
            return state
    }
}

export const employeeCreateReducer = (state = {}, action) => {
    switch (action.type) {
        case EMPLOYEE_CREATE_REQUEST:
            return { loading: true }

        case EMPLOYEE_CREATE_SUCCESS:
            return { loading: false, success: true, employee: action.payload }

        case EMPLOYEE_CREATE_FAIL:
            return { loading: false, error: action.payload }

        case EMPLOYEE_CREATE_RESET:
            return {}

        default:
            return state
    }
}

export const employeeUpdateReducer = (state = { employee: {} }, action) => {
    switch (action.type) {
        case EMPLOYEE_UPDATE_REQUEST:
            return { loading: true }

        case EMPLOYEE_UPDATE_SUCCESS:
            return { loading: false, success: true, employee: action.payload }

        case EMPLOYEE_UPDATE_FAIL:
            return { loading: false, error: action.payload }

        case EMPLOYEE_UPDATE_RESET:
            return { employee: {} }

        default:
            return state
    }
}

export const employeeDeleteReducer = (state = {}, action) => {
    switch (action.type) {
        case EMPLOYEE_DELETE_REQUEST:
            return { loading: true }

        case EMPLOYEE_DELETE_SUCCESS:
            return { loading: false, success: true }

        case EMPLOYEE_DELETE_FAIL:
            return { loading: false, error: action.payload }

        default:
            return state
    }
}

export const employeeWorkflowUpdateReducer = (state = {}, action) => {
    switch (action.type) {
        case EMPLOYEE_WORKFLOW_UPDATE_REQUEST:
            return { loading: true }

        case EMPLOYEE_WORKFLOW_UPDATE_SUCCESS:
            return { loading: false, success: true }

        case EMPLOYEE_WORKFLOW_UPDATE_FAIL:
            return { loading: false, error: action.payload }

        case EMPLOYEE_WORKFLOW_UPDATE_RESET:
            return {}

        default:
            return state
    }
}
