import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardGroup,
  CCardBody,
  CForm,
  CInputGroup,
  CInputGroupText,
  CFormInput,
  CButton,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { NavLink, useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useDispatch } from 'react-redux'
import { adminLogin } from 'src/redux/api/api'
import { LOGIN_SUCCESS } from 'src/redux/actions/action'
import Cookies from 'js-cookie'

const Login = () => {
  const { register, handleSubmit } = useForm()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const onSubmit = async (data) => {
    setError('')
    setIsLoading(true)
    try {
      const res = await adminLogin(data)

      if (res.status === 400 || res.data.success === false) {
        setError(res.data.message)
        setIsLoading(false)
      } else {
        Cookies.set('accessToken', res.data.admin.accessToken)
        Cookies.set('refreshToken', res.data.refreshToken)

        const adminObject = {
          name: res.data.admin.name,
          id: res.data.admin._id,
          email: res.data.admin.email,
          img: res.data.admin.profileImage ? res.data.baseUrl + res.data.admin.profileImage : null,
        }

        Cookies.set('admin', JSON.stringify(adminObject))

        setIsLoading(false)
        dispatch({
          type: LOGIN_SUCCESS,
          data,
        })
        toast.success(res.data.message)

        navigate('/dashboard')
      }
    } catch (err) {
      if (err.response && (err.response.status === 401 || !err.response.data.success)) {
        setError(err.response.data.message)
        setIsLoading(false)
      } else {
        setError('Something is wrong!')
        setIsLoading(false)
      }
    }
  }

  return (
    <div className="login-page bg-light min-vh-100">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={12} className="main-col">
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={handleSubmit(onSubmit)}>
                    <h1 className="text-center mb-4">Login</h1>
                    <p className="text-medium-emphasis text-center">Sign In to your account</p>
                    <div in={error}>
                      <p className="errors">{error ? error : ''}</p>
                    </div>
                    <CInputGroup className="mb-2">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <ToastContainer />
                      <CFormInput
                        {...register('email', { required: 'Email is required' })}
                        placeholder="email"
                        autoComplete="email"
                      />
                    </CInputGroup>

                    <CInputGroup className="mb-2">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        {...register('password', { required: 'Password is required' })}
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                      />
                    </CInputGroup>

                    <CRow>
                      <CCol xs={12} md={6} className="mb-3 mb-md-0 mt-2">
                        <CButton type="submit" className="w-100 custom-color">
                          {isLoading ? 'Loading...' : 'Login'}
                        </CButton>
                      </CCol>
                      <CCol xs={12} md={6} className="text-center text-md-right">
                        <NavLink to="/forgot-password">
                          <CButton color="link" className="px-0">
                            Forgot password?
                          </CButton>
                        </NavLink>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
