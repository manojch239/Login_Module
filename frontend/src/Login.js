import React, { useState } from 'react';
import { Form, Input, Button } from 'antd';
import axios from 'axios';
import _ from 'lodash';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/login/', {
      //const response = await axios.post('postgresql://postgres:postgres@localhost/user_database', {
        username: values.username,
        password: values.password
      });
      console.log('Login successful:', response.data);
    } catch (error) {
      setError(_.get(error, 'response.data.detail', 'An error occurred'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <Form name="login" onFinish={onFinish} className="w-full max-w-md p-4 border rounded shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <Form.Item name="username" rules={[{ required: true, message: 'Please input your username!' }]}>
          <Input placeholder="Username" />
        </Form.Item>
        <Form.Item name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
          <Input.Password placeholder="Password" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} className="w-full">
            Login
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
