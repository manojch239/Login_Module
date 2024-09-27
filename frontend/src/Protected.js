import React from 'react';
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from 'axios';


function ProtectedPage() {
    const navigate = useNavigate();

    useEffect(() => {
        console.log("test")
        const verifyToken = async () => {
            const token = localStorage.getItem('token');
              console.log(token)
            // Check if the token is exists and valid
              if (!token){
                console.log("No Token found, redirecting to login page")
                localStorage.removeItem('token');
                navigate('/');
                return;
            }

             const formDetails = {token};
            // formDetails.append('token', token);


            try {
                const response = await fetch(`http://localhost:8000/verify-token/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(formDetails)
                });
                const data = await response.json();
                //     {
                //     method: 'POST',
                //     headers: {
                //         'Content-Type': 'application/json',
                //         'Authorization': `Bearer ${token}`
                //     }
                // });

                // const data = await response.json();
                console.log(data)
                // if (!data.status === "success"){
                //     throw new Error('Token verification failed');
                // }

                if("status" in data && data.status === "success"){
                    console.log("Token verification successful")
                }
                else{
                    console.log("Token verification failed")
                    localStorage.removeItem('token');
                    navigate('/');
                }


            } catch (error) {
                //console.log("error_123")
                console.error('Token verification failed:', error);
                localStorage.removeItem('token');
                navigate('/');
            }
        };
        verifyToken();
    }, []);
    
    return <div>Hello User, Welcome to the Protected Page</div>;
}

export default ProtectedPage;