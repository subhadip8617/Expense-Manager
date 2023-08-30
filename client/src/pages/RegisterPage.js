import React, { useEffect, useState } from 'react'
import {Form, Input, message} from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Spinner from '../components/Spinner'

const RegisterPage = () => {
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
            const res = await axios.post('http://localhost:8080/api/v1/user/register', values);
            if(res.data.success){
                message.success(res.data.msg);
                setLoading(false);
                navigate("/login");
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
                {loading && <Spinner/>}
                <h1>Register Form</h1>
                <Form.Item label="Name" name="name">
                    <Input />
                </Form.Item>
                <Form.Item label="Email" name="email">
                    <Input type='email'/>
                </Form.Item>
                <Form.Item label="Password" name="password">
                    <Input type='password'/>
                </Form.Item>
                <div className='d-flex justify-content-between'>
                    <Link className='btn btn-primary' to="/login"> Login Here</Link>
                    <button className='btn btn-primary'> Register </button>
                </div>
            </Form>
        </div>
    </>
  )
}

export default RegisterPage