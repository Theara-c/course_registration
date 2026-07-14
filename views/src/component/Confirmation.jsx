
import React from 'react'

function Confirmation({ status, setConfirm, handleConfirm }) {
  return (
    <div>
      
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
    <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
      <h2 className="text-xl font-semibold text-gray-800">
        Are you sure?
      </h2>

      <p className="mt-2 text-sm text-gray-600">
        This action cannot be undone. Do you want to continue?
      </p>

      <div className="mt-6 flex justify-end gap-3">
        <button
          onClick={() => setConfirm(false)}
          className="rounded-lg border bg-red-600 text-white border-gray-300 px-4 py-2 t transition cursor-pointer"
        >
          Cancel
        </button>

        <button
          onClick={() => handleConfirm(status)}
          className="rounded-lg bg-green-600 border px-4 py-2 text-white transition cursor-pointer"
        >
          Yes
        </button>
      </div>
    </div>
  </div>
    </div>
  )
}

export default Confirmation
