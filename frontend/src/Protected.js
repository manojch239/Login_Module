import React from 'react';
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout, Menu, Avatar, Dropdown, message } from 'antd';
import {
     UserOutlined,
    DesktopOutlined,
    FileOutlined,
    PieChartOutlined,
    TeamOutlined,
    } from '@ant-design/icons';

const { Header, Content, Sider } = Layout;


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
        const verifyToken = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                localStorage.removeItem('token');
                navigate('/');
                return;
            }

            const formDetails = { token };

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
                console.error('Token verification failed:', error);
                localStorage.removeItem('token');
                navigate('/');
            }
        };
        verifyToken();
    }, []);

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider collapsible>
                <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
                    <Menu.Item key="1" icon={<DesktopOutlined />}>
                        Desktop
                    </Menu.Item>
                    <Menu.Item key="2" icon={<UserOutlined />}>
                        User
                    </Menu.Item>
                    <Menu.Item key="3" icon={<TeamOutlined />}>
                        Team
                    </Menu.Item>
                    <Menu.Item key="4" icon={<PieChartOutlined />}>
                        Analysis
                    </Menu.Item>
                    <Menu.Item key="4" icon={<FileOutlined />}>
                        Storage
                    </Menu.Item>
                </Menu>
            </Sider>
            <Layout>
                <Header style={{ background: '#fff', padding: 0 }}>
                    <div className='avatar' style={{ position: 'absolute', top: 0, right: 0, margin: '10px' }}>
                        <Dropdown overlay = {menu} trigger={['click']}>
                            <Avatar size={48} icon={<UserOutlined />} style={{ cursor: 'pointer' }} />
                        </Dropdown>
                    </div>
                </Header>
                <Content style={{ margin: '24px 16px', padding: 24, background: '#fff' }}>
                   <div className='text-cyan-300'> Hello User, Welcome to the Protected Page</div>
                </Content>
            </Layout>
        </Layout>
    );
}

export default ProtectedPage;