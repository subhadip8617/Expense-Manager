import React, { useState, useEffect } from 'react'
import {Form, Input, message} from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Spinner from '../components/Spinner'

const LoginPage = () => {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if(localStorage.getItem('user')){
            navigate("/");
        }
    }, [navigate])

    const submitHandler = async(values) => {
        try {
            setLoading(true);
            const res = await axios.post('http://localhost:8080/api/v1/user/login', values);
            if(res.data.success){
                const {data} = res;
                setLoading(false);
                message.success(res.data.msg);
                localStorage.setItem('user', JSON.stringify({...data.user, password:''}));
                navigate("/");
            }
            else{
                setLoading(false);
                message.error(res.data.msg);
            }
        } catch (err) {
            setLoading(false);
            message.error(err);
        }
    }

  return (
    <>
        <div className='register-page d-flex align-items-center justify-content-center'>
            <Form layout='vertical' onFinish={submitHandler}>
                <h1>Login Form</h1>
                <Form.Item label="Email" name="email">
                    <Input />
                </Form.Item>
                {loading && <Spinner/>}
                <Form.Item label="Password" name="password">
                    <Input type='password'/>
                </Form.Item>
                <div className='d-flex align-items-center justify-content-between'>
                    <Link className='btn btn-primary' to="/register">Register Here</Link>
                    <button className='btn btn-primary'> Login </button>
                </div>
            </Form>
        </div>
    </>
  )
}

export default LoginPage