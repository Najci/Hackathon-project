import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const MiddleDashboard = ({cookie}) => {
    const navigate = useNavigate()

    useEffect(() => {
        if (cookie){
            navigate('/'+ cookie.role + '/dashboard/' + cookie.username)
        }
        else{
            console.log('no cookie')
        }
    },[])
}

export default MiddleDashboard