import React, { memo, useRef, useState } from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Form, Input, message } from 'antd';
import styles from './index.module.scss';
import { login, register } from '@/service/globalApi';
import classNames from 'classnames';
import { setTokenAUTH } from '@/utils/auth';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();

  const onFinish = async ({
    username,
    password
  }: {
    username: string;
    password: string;
  }) => {
    try {
      const res = await login(username, password);
      setTokenAUTH(res.data.access_token);
      navigate('/todo');
      message.success('登录成功');
    } catch (error) {}
  };

  return (
    <div className={styles.form}>
      <div className={styles.title}>登录</div>
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
        <Form.Item className={styles.remember}>
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>记住我</Checkbox>
          </Form.Item>

          <a className="login-form-forgot" href="">
            忘记密码
          </a>
        </Form.Item>

        <Form.Item className={styles.btn}>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            登录
          </Button>
          &nbsp;&nbsp;&nbsp; 或&nbsp;&nbsp;&nbsp;
          <a href="/register">现在注册！</a>
        </Form.Item>
      </Form>
    </div>
  );
}

export default memo(Login);
