import React from 'react'

export default function Footer() {
  return (
    <footer className="w-full bg-white text-black  p-8">
    <div className="flex flex-row flex-wrap items-center justify-center gap-y-6 gap-x-12 bg-white text-black text-center md:justify-between">
    <a href="/" className="text-2xl font-bold text-black flex items-center">
              <span className="sr-only">Your Logo</span>
              <img
                className="h-10 w-auto mr-2 scale-150 filter grayscale transition duration-500 hover:filter-none"
                src='/image-removebg-preview (2).png'
                alt="Logo"
              />
              <h3 className="text-2xl font-mono">The Jewel Masters </h3> 
            </a>
   
      <ul className="flex flex-wrap items-center gap-y-2 gap-x-8">
        <li>
          <a
            href="/"
            className="text-black hover:text-slate-500 focus:text-slate-500 text-sm"
          >
            Home
          </a>
        </li>
        <li>
          <a
            href="/shop"
            className="text-black hover:text-slate-500 focus:text-slate-500 text-sm"
          >
            Shop
          </a>
        </li>
        <li>
          <a
            href="#"
            className="text-black hover:text-slate-500 focus:text-slate-500 text-sm"
          >
            About Us
          </a>
        </li>
        
      </ul>
    </div>
    <p className="block mb-4 text-sm text-center text-black md:mb-0 border-t border-slate-200 mt-4 pt-4">
      The Jewellery Master pvt.ltd.
      </p>
    </footer>
  )
}
