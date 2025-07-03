// Updated Register.js
import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BackgroundImage from '../../assets/images/bg.jpg';
import { history } from '../../configs/browserHistory';

const Register = () => {
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPassWordRef = useRef(null);

  const [isRegistering, setRegistering] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    document.title = 'Register';
  }, []);

  const register = async () => {
    const info = {
      name: nameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
      repassword: confirmPassWordRef.current.value
    };

    if (!info.name || !info.email || !info.password || !info.repassword) {
      setErrorMessage('Please fill in all fields.');
      return;
    } else if (info.password !== info.repassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }
    setRegistering(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: info.name, email: info.email, password: info.password })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.msg || 'Registration failed');
      }

      alert('Registered successfully as ' + info.name);
      history.push('/');
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setRegistering(false);
    }
  };

  return (
    <div className='h-screen flex items-center justify-center bg-gray-200'>
      <div className='container mx-auto'>
        <div className='flex justify-center px-6 my-12'>
          <div className='w-full xl:w-3/4 lg:w-11/12 flex shadow-xl'>
            <div className='w-full h-auto bg-gray-400 hidden lg:block lg:w-1/2 bg-cover bg-center rounded-l-lg' style={{ backgroundImage: `url(${BackgroundImage})` }}></div>
            <div className='w-full lg:w-1/2 bg-white p-5 rounded-lg lg:rounded-l-none'>
              <h3 className='pt-4 text-2xl text-center'>Create an Account!</h3>
              <form className='px-8 pt-6 pb-8 mb-4'>
                <div className='mb-4'>
                  <label className='block mb-2 text-sm font-bold' htmlFor='name'>Name</label>
                  <input className='w-full px-3 py-2 border rounded' id='name' type='text' ref={nameRef} />
                </div>
                <div className='mb-4'>
                  <label className='block mb-2 text-sm font-bold' htmlFor='email'>Email</label>
                  <input className='w-full px-3 py-2 border rounded' id='email' type='email' ref={emailRef} />
                </div>
                <div className='mb-4'>
                  <label className='block mb-2 text-sm font-bold' htmlFor='password'>Password</label>
                  <input className='w-full px-3 py-2 border rounded' id='password' type='password' ref={passwordRef} />
                </div>
                <div className='mb-4'>
                  <label className='block mb-2 text-sm font-bold' htmlFor='confirm_password'>Confirm Password</label>
                  <input className='w-full px-3 py-2 border rounded' id='confirm_password' type='password' ref={confirmPassWordRef} />
                </div>
                {errorMessage && <p className='text-xs text-red-500'>{errorMessage}</p>}
                <div className='mb-6 text-center'>
                  <button className='w-full px-4 py-2 text-white bg-blue-500 rounded-full' type='button' onClick={register} disabled={isRegistering}>
                    {isRegistering ? 'Registering...' : 'Register Account'}
                  </button>
                </div>
                <div className='text-center'>
                  <Link to='/' className='text-sm text-blue-500 hover:text-blue-800'>Already have an account? Login!</Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
