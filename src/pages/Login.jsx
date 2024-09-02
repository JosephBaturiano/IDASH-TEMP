import React, { useState } from 'react';
import iDashLogoText from '../assets/iDashLogoText.png';
import { IconButton } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle login logic here
        console.log('Username:', username);
        console.log('Password:', password);
    };

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="h-screen flex items-center justify-center bg-blue-100">
            {/* Container with 10% margin and fixed height */}
            <div className="w-full max-w-6xl mx-auto px-4 py-8 h-screen">
                <div className="flex h-full">
                    {/* Left side - Logo */}
                    <div className="w-2/5 bg-login-dark flex items-center justify-center rounded-l-3xl">
                        <img
                            src={iDashLogoText}
                            alt="Logo"
                            className="w-3/4 h-auto"
                        />
                    </div>

                    {/* Right side - Form */}
                    <div className="w-3/5 flex items-center justify-center bg-white rounded-r-3xl">
                        <div className="p-8 rounded-lg w-full max-w-md">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-5">
                                    <label className="block text-login-dark text-xl font-bold mb-2" htmlFor="username">
                                        Username
                                    </label>
                                    <input
                                        type="text"
                                        id="username"
                                        className="w-full px-3 py-2 bg-gray-200 text-xl rounded-3xl focus:outline-none focus:border-login-dark"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="mb-10">
                                    <label className="block text-login-dark text-xl font-bold mb-2" htmlFor="password">
                                        Password
                                    </label>
                                    <div className="flex items-center border rounded-3xl bg-gray-200">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            id="password"
                                            className="w-full px-3 py-2 bg-transparent text-xl rounded-3xl focus:outline-none focus:border-login-dark pr-10" // Ensure padding-right for space
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                        <IconButton
                                            onClick={handleClickShowPassword}
                                            className="ml-4" // Increase margin-left to move icon further
                                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                                        >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </div>
                                </div>
                                <div className="flex flex-col items-center">
                                    <button
                                        type="submit"
                                        className="bg-login-dark hover:bg-login-dark-dark text-white w-1/2 font-bold py-2 px-4 rounded-3xl focus:outline-none focus:shadow-outline"
                                    >
                                        Login
                                    </button>
                                    <div className="mt-4 text-login-dark">
                                        <p className="text-center">
                                            Don’t have an account?{' '}
                                            <a href="/register" className="text-blue-500 hover:text-blue-700">
                                                Register here
                                            </a>
                                        </p>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
