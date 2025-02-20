import React, { useState } from 'react';
import mail from '../images/mail.png';
import password from '../images/padlock.png';
import personIcon from '../images/profile.png';
import Login_first from '../images/Login_first.png';
import { useForm } from "react-hook-form";
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import CustomInput from '../smallComponents/CustomInput';
import CustomInputWithBtn from '../smallComponents/CustomInputWithBtn';

const Register = () => {
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [buttonError, setButtonError] = useState(false);
    const navigate = useNavigate();
    const [registerData, setRegisterData] = useState({
        firstname: "",
        lastname: "",
        email: "",
        password: ""
    });
    const [emailFocused, setEmailFocused] = useState(false);
    const [passwordFocused, setPasswordFocused] = useState(false);
    const [lastnameFocused, setLastnameFocused] = useState(false);
    const [firstnameFocused, setFirstnameFocused] = useState(false);
    const [typing, setTyping] = useState(false);
    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setRegisterData({ ...registerData, [name]: value });
    };
    const handleFocus = (field) => {
        setTyping(true);
        if (field === 'email') setEmailFocused(true);
        if (field === 'password') setPasswordFocused(true);
        if (field === 'firstname') setFirstnameFocused(true);
        if (field === 'lastname') setLastnameFocused(true);
    };
    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };
    const handleBlur = (field) => {
        if (field === 'email' && !registerData.email) {
            setEmailFocused(false);
        }
        if (field === 'password' && !registerData.password) {
            setPasswordFocused(false);
        }
        if (field === 'lastname' && !registerData.lastname) {
            setLastnameFocused(false);
        }
        if (field === 'firstname' && !registerData.firstname) {
            setFirstnameFocused(false);
        }

        if (!registerData.email && !registerData.password && !registerData.firstname && !registerData.lastname) {
            setTyping(false);
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Reset error states
        setButtonError(false);
        setErrorMessage('');

        // Validate email
        if (!validateEmail(registerData.email)) {
            setButtonError(true);
            setErrorMessage('Please enter a valid email address');

            // Clear error after 2 seconds
            setTimeout(() => {
                setButtonError(false);
                setErrorMessage('');
            }, 2000);

            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/auth/register', registerData);
            if (response.data) {
                setIsPopupVisible(true);
                setTimeout(() => {
                    setIsPopupVisible(false);
                    navigate('/login');
                }, 3000);
            }
        } catch (error) {
            if (error.response) {
                // User already registered
                if (error.response.status === 409) {  // Assuming 409 is the status for conflict/duplicate user
                    setButtonError(true);
                    setErrorMessage('User already registered');
                } else {
                    setButtonError(true);
                    setErrorMessage(error.response.data.message);
                }
            } else if (error.request) {
                setButtonError(true);
                setErrorMessage('Network Error: Please check your connection.');
            } else {
                setButtonError(true);
                setErrorMessage('Error: ' + error.message);
            }

            // Clear error after 2 seconds
            setTimeout(() => {
                setButtonError(false);
                setErrorMessage('');
            }, 2000);
        }
    };
    return (
        <>
            <div className='RegisterComponent'>
                <form className='mainContainer' style={{ paddingTop: "10vh" }} onSubmit={handleSubmit}>
                    <img src={Login_first} alt='image' />
                    <h3>Create an Account</h3>
                    <p>Already a user? <span><Link className='no-style-link' to='/login'>Login now</Link></span></p>
                    <CustomInput
                        onChange={handleChange}
                        onFocus={() => handleFocus('firstname')}
                        onBlur={() => handleBlur('firstname')}
                        value={registerData.firstname}
                        label="First name"
                        imgSrc={personIcon}
                        isFocused={firstnameFocused}
                        name='firstname'
                        type='text'
                    />
                    <CustomInput
                        onChange={handleChange}
                        onFocus={() => handleFocus('lastname')}
                        onBlur={() => handleBlur('lastname')}
                        value={registerData.lastname}
                        label="Last name"
                        imgSrc={personIcon}
                        isFocused={lastnameFocused}
                        name='lastname'
                        type='text'
                    />
                    <CustomInput
                        onChange={handleChange}
                        onFocus={() => handleFocus('email')}
                        onBlur={() => handleBlur('email')}
                        value={registerData.email}
                        label="E-mail Address"
                        imgSrc={mail}
                        isFocused={emailFocused}
                        name='email'
                        type='text'
                    />
                    <CustomInputWithBtn
                        onChange={handleChange}
                        onFocus={() => handleFocus('password')}
                        onBlur={() => handleBlur('password')}
                        value={registerData.password}
                        label="Password"
                        imgSrc={password}
                        isFocused={passwordFocused}
                        name='password'
                        type='password'
                    />
                    <button
                        type='submit'
                        className={`loginButton ${buttonError ? 'error-Button' : ''}`}
                    >
                        {buttonError ? errorMessage : 'Register'}
                    </button>
                </form>
                {isPopupVisible && (
                    <div className="popup">
                        <p>Registration done successfully</p>
                    </div>
                )}
            </div>
        </>
    );
}

export default Register;
