import React from 'react'
import { useLocation } from 'react-router-dom';

const ViewVendor = () => {
    const location = useLocation();
  const user = location.state
  return (
    <div>ViewVendor</div>
  )
}

export default ViewVendor