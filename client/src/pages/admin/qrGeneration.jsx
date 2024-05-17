import React from 'react'

function qrGeneration() {
  return (
    <form className='form'>
        <h1 className='title'> QR Code Generator</h1>
        <input 
        type='text' 
        className='input'
        value={input}
        onchange={(e) => setInput(e.target.value)}  
        required
        placeholder='Enter player ID'
        />
    </form>
  )
}

export default qrGeneration



