import React from 'react';
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Avatar,Dropdown,Menu,message } from 'antd';
import { UserOutlined,DownOutlined } from '@ant-design/icons';
//import axios from 'axios';
//TODO : create an avatar in the protected page using ant d


// const {  UserOutlined  } = icons;
//const {  Avatar, Space  } = antd;


function ProtectedPage() {
    const navigate = useNavigate();
    


    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };


    const handleMenuClick = (e) => {
        if (e.key === '1') {
            console.log('Profile clicked');
            // Navigate to profile page or handle profile action
        } else if (e.key === '2') {
            console.log('Settings clicked');
            // Navigate to settings page or handle settings action
        } else if (e.key === '3') {
            handleLogout(); // Logout action
        }
    };

    const menu = (
        <Menu onClick={handleMenuClick}>
            <Menu.Item key="1">Profile</Menu.Item>
            <Menu.Item key="2">Settings</Menu.Item>
            <Menu.Item key="3">Logout</Menu.Item>
        </Menu>
    );


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
                    message.success('Login successful!')

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
    
    return (
            <div>
                <div className='avatar' style={{position:'absolute',top: 0, right: 0,margin: '10px'}}>
                    <Dropdown overlay={menu} trigger={['click']}>
                        <Avatar size={48} icon={<UserOutlined />} style={{ cursor: 'pointer' }} />
                    </Dropdown>
                </div>
                <div>Hello User, Welcome to the Protected Page</div>
            </div>
    );
}

export default ProtectedPage;