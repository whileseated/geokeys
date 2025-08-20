import React from 'react'

const Footer = ({ commitHash }) => {
  return (
    <div className="fixed bottom-1 left-0 right-0 flex justify-between items-center px-3 text-[9px] text-gray-400 select-none pointer-events-none">
      <span className="opacity-40">build {commitHash}</span>
      <a 
        href="https://github.com/whileseated/geokeys" 
        target="_blank" 
        rel="noopener noreferrer"
        className="opacity-40 hover:opacity-60 transition-opacity pointer-events-auto"
      >
        github
      </a>
    </div>
  )
}

export default Footer