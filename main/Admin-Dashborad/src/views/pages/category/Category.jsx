import MUIDataTable from 'mui-datatables'
import React from 'react'

const Category = () => {
  const columns = [
    {
      name: 'categoryName',
      label: 'categoryName',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: 'languages',
      label: 'Language',
      options: {
        filter: true,
        sort: false,
      },
    },
    {
      name: 'categoryImage',
      label: 'Image',
      options: {
        filter: true,
        sort: false,
      },
    },
  ]

  const data = [
    { name: 'Joe James', company: 'Test Corp', city: 'Yonkers', state: 'NY' },
    { name: 'John Walsh', company: 'Test Corp', city: 'Hartford', state: 'CT' },
    { name: 'Bob Herm', company: 'Test Corp', city: 'Tampa', state: 'FL' },
    { name: 'James Houston', company: 'Test Corp', city: 'Dallas', state: 'TX' },
  ]

  const options = {
    filterType: 'checkbox',
  }

  return <MUIDataTable title={'Category List'} data={data} columns={columns} options={options} />
}

export default Category
