import {createStore,applyMiddleware,combineReducers} from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import { 
    userLoginReducer,
    userRegisterReducer,
    userProfileReducer,
    userUpdateProfileReducer,
    userUpdateSecurityReducer,
    userListReducer,
    userDeleteReducer,
    userUpdateReducer,
    user2FAEnableReducer,
    user2FADisableReducer,
    user2FAVerifyReducer,
} from './reducers/userReducers'

import {
    companyListReducer,
    companyDetailsReducer,
    companyCreateReducer,
    companyUpdateReducer,
    companyDeleteReducer,
} from './reducers/companyReducers'

import {
    departmentListReducer,
    departmentDetailsReducer,
    departmentCreateReducer,
    departmentUpdateReducer,
    departmentDeleteReducer,
} from './reducers/departmentReducers'

import {
    employeeListReducer,
    employeeDetailsReducer,
    employeeCreateReducer,
    employeeUpdateReducer,
    employeeDeleteReducer,
} from './reducers/employeeReducers'


const reducer = combineReducers({
    userLogin: userLoginReducer,
    userRegister: userRegisterReducer,
    userProfile: userProfileReducer,
    userUpdateProfile: userUpdateProfileReducer,
    userUpdateSecurity: userUpdateSecurityReducer,
    userList: userListReducer,
    userDelete: userDeleteReducer,
    userUpdate: userUpdateReducer,
    user2FAEnable: user2FAEnableReducer,
    user2FADisable: user2FADisableReducer,
    user2FAVerify: user2FAVerifyReducer,

    employeeList: employeeListReducer,
    employeeDetails: employeeDetailsReducer,
    employeeCreate: employeeCreateReducer,
    employeeUpdate: employeeUpdateReducer,
    employeeDelete: employeeDeleteReducer,

    companyList: companyListReducer,
    companyDetails: companyDetailsReducer,
    companyCreate: companyCreateReducer,
    companyUpdate: companyUpdateReducer,
    companyDelete: companyDeleteReducer,

    departmentList: departmentListReducer,
    departmentDetails: departmentDetailsReducer,
    departmentCreate: departmentCreateReducer,
    departmentUpdate: departmentUpdateReducer,
    departmentDelete: departmentDeleteReducer,
})

const userInfoFromStorage = localStorage.getItem('userInfo') ?
    JSON.parse(localStorage.getItem('userInfo')) : null

const initialState = {
    userLogin: { userInfo: userInfoFromStorage },
}

const middleware = [thunk]

const store = createStore(reducer,initialState,composeWithDevTools(applyMiddleware(...middleware)))

export default store