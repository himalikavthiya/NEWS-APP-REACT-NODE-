import { Button, Switch } from '@mui/material'
import MUIDataTable from 'mui-datatables'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as Icons from '@mui/icons-material'
import { ToastContainer, toast } from 'react-toastify'
import { deleteLanguage, getAllLanguage, updateLanguage } from 'src/redux/api/api'
import swal from 'sweetalert'

const Language = () => {
  const [dataTableData, setDataTable] = useState([])
  const navigate = useNavigate()

  const list = async () => {
    // setIsLoading(true)
    await getAllLanguage()
      .then((res) => {
        // console.log(res.data.language)
        // setIsLoading(false)
        setDataTable(res.data.language)
      })
      .catch((err) => {
        console.log(err)
        // if (!err.response.data.success) {
        //   if (err.response.data.status === 401) {
        //     toast.error(err.response.data.message)
        //     setIsLoading(false)
        //   } else {
        //     console.log(err.response.data, 'else')
        //   }
        // }
      })
  }
  useEffect(() => {
    list()
  }, [])

  const columns = [
    {
      name: 'languagesName',
      label: 'Languages',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: 'displayName',
      label: 'Display Name',
    },
    {
      name: 'code',
      label: 'Code',
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: 'flagImage',
      label: 'Flag',
      options: {
        customBodyRender: (flagImage) =>
          flagImage ? (
            <img
              src={`${process.env.REACT_APP_LANGUAGES_IMAGE_PATH}${flagImage}`}
              alt={flagImage}
              style={{ height: '50px', width: '50px' }}
            />
          ) : (
            ''
          ),
      },
    },
    {
      name: 'status',
      label: 'Status',
      options: {
        filter: true,
        sort: false,
        customBodyRender: (_, { rowIndex }) => {
          const { status, _id } = dataTableData[rowIndex]
          return (
            <Switch
              checked={status}
              onChange={() => {
                const data = { id: _id, status: !status }
                updateLanguage(data, _id)
                  .then(() => {
                    toast.success('status changed successfully!', {
                      key: data._id,
                    })
                    list()
                  })
                  .catch(() => {
                    toast.error('something went wrong!', {
                      key: data._id,
                    })
                  })
              }}
            />
          )
        },
      },
    },

    {
      name: '_id',
      label: 'Action',
      options: {
        customBodyRender: (value) => {
          return (
            <div>
              <Icons.EditRounded
                sx={{
                  color: '#ffff',
                  cursor: 'pointer',
                  border: '1px solid',
                  borderRadius: '5px',
                  margin: '0px 6px',
                  fontSize: '30px',
                  padding: '4px',
                  backgroundColor: '#3C4B64',
                }}
              ></Icons.EditRounded>
              <Icons.DeleteRounded
                sx={{
                  color: '#ffff',
                  cursor: 'pointer',
                  border: '1px solid',
                  borderRadius: '5px',
                  margin: '0px 6px',
                  fontSize: '30px',
                  padding: '4px',
                  backgroundColor: '#DC3545',
                }}
                onClick={async () => {
                  const confirm = await swal({
                    title: 'Are you sure?',
                    text: 'Are you sure that you want to delete this Excercise Library?',
                    icon: 'warning',
                    buttons: ['No, cancel it!', 'Yes, I am sure!'],
                    dangerMode: true,
                  })
                  if (confirm) {
                    deleteLanguage(value)
                      .then(() => {
                        toast.success('deleted successfully!', {
                          key: value,
                        })
                        console.log(value)
                        list()
                      })
                      .catch(() => {
                        toast.error('something went wrong!', {
                          key: value,
                        })
                      })
                  }
                }}
              ></Icons.DeleteRounded>
            </div>
          )
        },
      },
    },
  ]

  const options = {
    filterType: 'checkbox',
  }

  return (
    <>
      <div className="right-text">
        <Button
          variant="contained"
          size="medium"
          // style={{ backgroundColor: '#15b3c' }}
          className="AddButton"
          onClick={() => navigate('/LanguageForm')}
        >
          Add Language
        </Button>
      </div>
      <ToastContainer />
      <MUIDataTable
        title={'Language List'}
        data={dataTableData}
        columns={columns}
        options={options}
      />
    </>
  )
}

export default Language
