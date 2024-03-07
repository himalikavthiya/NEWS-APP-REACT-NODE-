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
import { cilLockLocked, cilUser, cilEnvelopeClosed } from '@coreui/icons'
import { useNavigate, useParams } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import EditProfile from './EditProfile'
import ChangePassword from './ChangePassword'

const Profile = () => {
  const { register, handleSubmit } = useForm()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState()

  const onSubmit = async (data) => {}

  return (
    <div className="bg-light min-vh-100 profile">
      <CContainer className="profile-container">
        <CRow>
          <CCol md={6}>
            <CCardGroup>
              <CCardBody>
                <EditProfile />
              </CCardBody>
            </CCardGroup>
          </CCol>
          <CCol md={6}>
            <CCardGroup>
              <CCardBody>
                <ChangePassword />
              </CCardBody>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Profile
