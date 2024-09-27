import React from 'react';
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from 'axios';


function ProtectedPage() {
    const navigate = useNavigate();

    useEffect(() => {
        const verifyToken = async () => {
            const token = localStorage.getItem('token');
              console.log(token)
            try {
                const response = await axios.post(`http://localhost:8000/verify-token/${token}`);
                const data = response.data;
                //     {
                //     method: 'POST',
                //     headers: {
                //         'Content-Type': 'application/json',
                //         'Authorization': `Bearer ${token}`
                //     }
                // });

                // const data = await response.json();
                if (!data.success){
                    throw new Error('Token verification failed');
                }
            } catch (error) {
                console.error('Token verification failed:', error);
                localStorage.removeItem('token');
                navigate('/');
            }
        };
        verifyToken();
    }, [navigate]);
    
    return <div>Hello User, Welcome to the Protected Page</div>;
}

export default ProtectedPage;