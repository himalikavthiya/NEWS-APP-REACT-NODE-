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
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { UpdateProfile } from 'src/redux/api/api'
import Cookies from 'js-cookie'

const EditProfile = () => {
  const { register, handleSubmit } = useForm()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState()

  // const { adminId, adminName, adminEmail, adminImg } = {
  //   adminId: Cookies.get('adminId'),
  //   adminName: Cookies.get('adminName'),
  //   adminEmail: Cookies.get('adminEmail'),
  //   adminImg: Cookies.get('adminImg'),
  // }
  const adminString = Cookies.get('admin')
  const admin = JSON.parse(adminString)

  const onSubmit = async (data) => {
    setError('')
    setIsLoading(true)

    let formData = new FormData()
    Object.keys(data).forEach(function (key) {
      if (key === 'profileImage') {
        formData.append(key, data[key])
      } else {
        formData.append(key, data[key])
      }
    })
    UpdateProfile(formData)
      .then((res) => {
        if (res.data.success && res.status === 200) {
          const adminObject = {
            name: res.data.admin.name,
            id: res.data.admin._id,
            email: res.data.admin.email,
            img: res.data.admin.profileImage
              ? res.data.baseUrl + res.data.admin.profileImage
              : null,
          }

          Cookies.set('admin', JSON.stringify(adminObject))
          toast.success('Updated successfully!')
        } else {
          if ((res.status === 202 || 400) && !res.data.success) {
            setError(res.data.message)
            // setIsLoading(false)
          }
        }
        setIsLoading(false)
      })
      .catch((err) => {
        toast.error(err.response.data)
        if (!err.response.data.success) {
          if (err.response.data.status === 400) {
            setError(err.response.data.message)
            setIsLoading(false)
          } else {
            setError('wrong in an input.')
            setIsLoading(false)
          }
        } else {
          setError('Something Went Wrong!')
        }
        setIsLoading(false)
      })
  }

  return (
    <div className="bg-light min-vh-100 profile">
      <CContainer className="profile-container">
        <CRow>
          <CCol>
            <CCardGroup>
              <CCard className="p-4 profile-card">
                <CCardBody>
                  <CForm onSubmit={handleSubmit(onSubmit)}>
                    <h2 className="text-center mb-4">Edit Your Profile</h2>

                    <div in={error}>
                      <p className="errors">{error ? error : ''}</p>
                    </div>

                    <CFormInput {...register('_id')} type="hidden" value={admin.id} />

                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <ToastContainer />
                      <CFormInput
                        {...register('name', { required: ' name is required' })}
                        placeholder="name"
                        defaultValue={admin.name}
                        autoComplete="current-name"
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilEnvelopeClosed} />
                      </CInputGroupText>
                      <CFormInput
                        {...register('email')}
                        type="text"
                        autoComplete="current-email"
                        disabled={true}
                        defaultValue={admin.email}
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CFormInput
                        type="file"
                        accept="image/*"
                        {...register('profileImage')}
                        id="validationTextarea"
                        aria-label="file example"
                      />
                    </CInputGroup>
                    <CRow className="update-button">
                      <CCol xs={6} md={4} className="mb-2 mb-md-0 ">
                        <CButton type="submit" className="w-100 custom-color" disabled={isLoading}>
                          {isLoading ? 'Loading...' : 'Update'}
                        </CButton>
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

export default EditProfile
