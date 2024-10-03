import React from 'react'

export default function App_info() {
  return (
    
      <div className="mx-auto max-w-7xl py-24 sm:px-6 sm:py-32 lg:px-8 ">
          
          <div className="mx-auto max-w-md text-center lg:mx-0 lg:flex-auto lg:py-32 lg:text-left " >
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              The Jewellery Master
              <br />
            </h2>
            <h3 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            The master of Jewels.
            </h3>
            <p className="mt-6 text-lg leading-8 black">
            Start using our Jewellery to enhance your beauty.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6 lg:justify-start">
              <a
                href="#"
                className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Get started
              </a>
              <a href="#" className="text-sm font-semibold leading-6 text-white">
                Learn more <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
  )
}
