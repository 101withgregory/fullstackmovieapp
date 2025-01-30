import React from 'react'

function Search({searchTerm, setSearchTerm}) {
  return (
    <div className="search">
        <div>
           <img src='search.svg'/>
        <input type='text' placeholder='Search through thousands of movies' value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)}/>
    </div> 
        </div>
        
  )
}

export default Search