import axios from 'axios'
import React, { useEffect, useState } from 'react'
import '../css/Profile.css'

const Profile = ({cookie}) => {
  const [data, setData] = useState([]);

  const GetProfile = () => {
    axios.get(`http://localhost:3000/${cookie.role}/profile/${cookie.username}`)
    .then(function(response) {
      console.log(response.data)
      setData(response.data)
    })
  }

  useEffect(() => {
    GetProfile()
  },[])

  return (
    <div id='MainProfile'>
      <div id='SubMain'>
          <p>First Name: <br /> <span>{data.firstname}</span></p>
          <p>Last Name: <br /> <span>{data.lastname}</span></p>
          <p>Username: <br /> <span>{data.username}</span></p>
          <p>Email: <br /> <span>{data.email}</span></p>
          <p>Role: <br /> <span>{data.role}</span></p>
          <p>Date of creation: <br /> <span>{data.dateofcreation}</span></p>
      </div>
    </div>
  )
}

export default Profile