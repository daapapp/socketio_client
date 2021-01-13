import React, {useCallback, useEffect, useState} from 'react'

import {Link,useHistory } from "react-router-dom";

import { Formik } from 'formik';
import {axios} from '../../utils/axios';
import {SocketUtil} from "../../utils/socket";
import {setCookie} from "../../utils/cookie";

function Page(props) {
  console.log(process.env)
  let history = useHistory();

  const onLogin=(username,userId)=>{
    return new Promise((resolve, reject) => {
    const {socketRef}=props
     socketRef.current=SocketUtil.init(username);
     setCookie('username',username)
     setCookie('userId',userId)
      console.log(socketRef)
      setTimeout(()=>{
        resolve(true)
      },100)
    })
  }
  return (
    <div>
      <Formik
        initialValues={{ username: '', password: '' }}
        // validate={values => {
        //   const errors = {};
        //   if (!values.username) {
        //     errors.username = 'Required';
        //   }
        //   return errors;
        // }}
        onSubmit={(values, { setSubmitting }) => {
          axios({
            method:'post',
            url:'auth/login',
            data:{
              username:values.username,
              password:values.password
            }
          }).then(res=>{
            console.log(res.data)
            onLogin(res.data.username,res.data.id).then(r=>{
              history.push("/");
            })
            // history.push("/");
          }).catch(e=>{

          }).finally(_=>{
            setSubmitting(false);
          })
        }}
      >
        {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            /* and other goodies */
          }) => (
          <form onSubmit={(e)=>{handleSubmit(e);}}>
            <input
              type="username"
              name="username"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.username}
            />
            {errors.username && touched.username && errors.username}
            <input
              name="password"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.password}
            />
            {errors.password && touched.password && errors.password}
            <button type="submit" disabled={isSubmitting}>
              Submit
            </button>
          </form>
        )}
      </Formik>
    </div>
  );
}

export default Page;
