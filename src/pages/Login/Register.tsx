import React, { memo, useRef, useState } from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, message } from 'antd';
import styles from './index.module.scss';
import { register } from '@/service/globalApi';
import { useNavigate } from 'react-router-dom';

function Register() {
  const navigate = useNavigate();

  const onFinish = async ({
    username,
    password
  }: {
    username: string;
    password: string;
  }) => {
    try {
      const res = await register(username, password);
      message.success('注册成功');
      navigate('/login');
    } catch (error) {}
  };

  return (
    <div className={styles.form}>
      <div className={styles.title}>注册</div>
      <Form
        name="normal_login"
        className="login-form"
        initialValues={{ remember: true }}
        onFinish={onFinish}
      >
        <Form.Item
          name="username"
          rules={[{ required: true, message: '请输入用户名' }]}
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="用户名"
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: '请输入密码' }]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="密码"
          />
        </Form.Item>

        <Form.Item className={styles.btn}>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            注册
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default memo(Register);
