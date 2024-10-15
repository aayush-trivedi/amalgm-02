import React, { useState } from 'react';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider, GithubAuthProvider } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSocialSignIn = async (provider) => {
    try {
      let authProvider;
      switch(provider) {
        case 'Google':
          authProvider = new GoogleAuthProvider();
          break;
        case 'Facebook':
          authProvider = new FacebookAuthProvider();
          break;
        case 'GitHub':
          authProvider = new GithubAuthProvider();
          break;
        default:
          throw new Error('Unsupported provider');
      }
      await signInWithPopup(auth, authProvider);
      navigate('/');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-indigo-950 to-black font-sans">
      <h1 className="text-white text-9xl font-black font-Montserrat
       tracking-tighter mb-8" style={{ letterSpacing: '-0.09em' }}>
        amalgm.
      </h1>
      <p1 className="text-white text-xs font-bold font-Montserrat
       tracking-tighter mb-8" style={{ letterSpacing: '-0.00em' }}>
        BUILD AND DEPLOY ASSISTANTS THAT MAKE YOUR LIFE 100X EASIER.
      </p1>
      
      <div className="w-full max-w-md">
        <div className="bg-black shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-white text-xs font-semibold mb-2 uppercase tracking-wide" htmlFor="email">
                Email
              </label>
              <input
                className="w-full bg-gray-300 bg-opacity-25 text-white rounded-md py-2 px-3 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-400"
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-4"> {/* Changed from mb-6 to mb-4 */}
              <label className="block text-white text-xs font-semibold mb-2 uppercase tracking-wide" htmlFor="password">
                Password
              </label>
              <input
                className="w-full bg-gray-300 bg-opacity-25 text-white rounded-md py-2 px-3 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-400"
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="flex flex-col items-center">
              <button
                className="w-full bg-indigo-950 hover:bg-indigo-900 text-white text-xs font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-50 transition-colors duration-150 mb-6 uppercase tracking-wide"
                type="submit"
              >
                SIGN IN
              </button>
              <div className="flex items-center w-full mb-4">
                <div className="flex-grow border-t border-indigo-200 opacity-30"></div>
                <span className="flex-shrink mx-4 text-indigo-200 text-xs uppercase tracking-wide">Or sign in with</span>
                <div className="flex-grow border-t border-indigo-200 opacity-30"></div>
              </div>
              <div className="flex justify-center space-x-4 w-full mb-4">
                <button
                  onClick={() => handleSocialSignIn('Google')}
                  className="bg-white p-2 rounded-full hover:bg-gray-200 transition-colors duration-150"
                  type="button"
                  aria-label="Sign in with Google"
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#4285F4">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                </button>
                <button
                  onClick={() => handleSocialSignIn('Facebook')}
                  className="bg-[#1877F2] p-2 rounded-full hover:bg-[#166FE5] transition-colors duration-150"
                  type="button"
                  aria-label="Sign in with Facebook"
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="white">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleSocialSignIn('Discord')}
                  className="bg-[#5865F2] p-2 rounded-full hover:bg-[#4752C4] transition-colors duration-150"
                  type="button"
                  aria-label="Sign in with Discord"
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="white">
                    <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleSocialSignIn('GitHub')}
                  className="bg-[#333] p-2 rounded-full hover:bg-[#24292e] transition-colors duration-150"
                  type="button"
                  aria-label="Sign in with GitHub"
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="white">
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                  </svg>
                </button>
              </div>
              <a
                className="inline-block align-baseline text-sm text-indigo-200 hover:text-white transition-colors duration-150"
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  // Handle sign up logic here
                }}
              >
                Don't have an account? Sign Up
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

