import axios from 'axios'
import Cookies from 'js-cookie'
import {
  ADMIN_EDIT_PROFILE_PASSWORD_API,
  ADMIN_FORGOT_PASSWORD_API,
  ADMIN_LOGIN_API,
  ADMIN_RESET_PASSWORD_API,
  All_LANGUAGE_LIST_API,
  DELETE_LANGUAGE_API,
  MAIN_URL,
  UPDATE_LANGUAGE_API,
} from 'src/constant'
// export const MAIN_url = 'http://localhost:8002'

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response.status === 402 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = Cookies.get('refreshToken')
        const res = await axios.post(`${MAIN_URL}/admin/refreshToken`, { refreshToken })
        const accessToken = res.data.refreshToken
        // console.log(res.data.refreshToken, 'Api js page')
        Cookies.set('accessToken', accessToken)

        // Retry the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`
        // console.log(originalRequest)

        return axios(originalRequest)
      } catch (refreshError) {
        // Handle refresh token error or redirect to login
        console.error('Error refreshing token:', refreshError)
        // You might want to redirect to login or handle the error in another way
      }
    }

    if (error.response.status === 405) {
      Cookies.remove('accessToken')
      window.location.reload()
    }

    return Promise.reject(error)
  },
)

export const adminLogin = (data) => axios.post(MAIN_URL + ADMIN_LOGIN_API, data)

export const forgotPassword = (data) => axios.post(MAIN_URL + ADMIN_FORGOT_PASSWORD_API, data)

export const resetPassword = (data) => axios.post(MAIN_URL + ADMIN_RESET_PASSWORD_API, data)

/* ----------------------------  Admin profile change password --------------------------- */
export const changePassword = (data) =>
  axios.post(MAIN_URL + ADMIN_EDIT_PROFILE_PASSWORD_API, data, {
    headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` },
  })

/* -------------------------- update Admin Profile -------------------------- */
export const UpdateProfile = (data) =>
  axios.post(MAIN_URL + ADMIN_EDIT_PROFILE_PASSWORD_API, data, {
    headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` },
  })

/* -------------------------- Get All Languages -------------------------- */
export const getAllLanguage = (data) =>
  axios.get(MAIN_URL + All_LANGUAGE_LIST_API, data, {
    headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` },
  })

/* -------------------------- update Languages -------------------------- */
export const updateLanguage = (data, id) =>
  axios.put(MAIN_URL + UPDATE_LANGUAGE_API + id, data, {
    headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` },
  })

/* -------------------------- delete Languages -------------------------- */
export const deleteLanguage = (data, id) =>
  axios.delete(MAIN_URL + DELETE_LANGUAGE_API + id, data, {
    headers: { Authorization: `Bearer ${Cookies.get('accessToken')}` },
  })
