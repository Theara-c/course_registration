import React from 'react'

function UnauthorizeUser() {
  return (
    <div className='flex flex-col justify-center items-center h-screen'>
      <h1 className='text-2xl font-bold'>Unauthorized</h1>
      <p className='text-gray-600'>You are not authorized to access this page.</p>
    </div>
  )
}

export default UnauthorizeUser
