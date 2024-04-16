import React from 'react'

function Error() {
  return (
    <>
      <div className="h-screen">
        <div className="flex flex-col h-full items-center justify-center">
          <div className="text-9xl font-black mb-5">
            404
          </div>
          <div className="text-4xl font-semibold ">
            Page not Found
          </div>
        </div>
      </div>
    </>  
    )
}

export default Error