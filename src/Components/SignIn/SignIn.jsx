import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import logo from '../../assets/Images/Home/logo.png';
import Gradient from '../../assets/Images/Home/Gradient.png';
import { useNavigate } from 'react-router-dom';
import { setAuthToken } from '../../utils/auth'; // Import auth utility

export default function SignInPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const payload = {
      email: email.trim(),
      password: password,
    };

    try {
      const response = await fetch(
        'https://vercel-mr-clement-pos-backend.vercel.app/api/user/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed. Please check your credentials.');
      }

      // Save token securely using rememberMe
      if (data.token) {
        setAuthToken(data.token, rememberMe); // Save to localStorage or sessionStorage
      }
      
      console.log('Login successful:', data);
      navigate('/Dashboard', { replace: true }); // Prevent back button
    } catch (err) {
      setError(err.message);
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-screen h-auto min-h-screen bg-white overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute inset-0">
        <div className="absolute -right-[600px] -top-[600px] w-[800px] h-[800px] bg-gradient-to-b from-purple-700 to-red-600 rounded-full blur-3xl opacity-30 rotate-45"></div>
        <div className="absolute -right-[400px] -top-[300px] w-[500px] h-[500px] bg-blue-600 rounded-full blur-3xl opacity-25"></div>
        <div className="absolute -right-[250px] -top-[350px] w-[300px] h-[300px] bg-pink-300 rounded-full blur-3xl opacity-20"></div>

        <div className="absolute -left-[600px] -top-[600px] w-[800px] h-[800px] bg-gradient-to-b from-purple-700 to-red-600 rounded-full blur-3xl opacity-30 -rotate-45"></div>
        <div className="absolute -left-[400px] -top-[300px] w-[500px] h-[500px] bg-blue-600 rounded-full blur-3xl opacity-25"></div>
        <div className="absolute -left-[250px] -top-[350px] w-[300px] h-[300px] bg-pink-300-rounded-full blur-3xl opacity-20"></div>

        <div className="absolute top-1/2 left-1/4 w-[500px] h-[200px] bg-white/60 rounded-full blur-3xl -rotate-45"></div>
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[150px] bg-white/60 rounded-full blur-3xl rotate-12"></div>
        <div className="absolute bottom-1/4 left-1/3 w-[450px] h-[180px] bg-gradient-to-r from-white/50 to-transparent rounded-full blur-2xl -rotate-12"></div>
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row w-full min-h-screen">
        {/* Left Section (Hidden on Mobile) */}
        <div
          className="hidden lg:flex flex-1 flex-col justify-center px-8 lg:px-32 py-12"
          style={{
            backgroundImage: `url(${Gradient})`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
          }}
        >
          <div className="max-w-2xl">
            <h1 className="text-3xl lg:text-[42px] font-extrabold text-blue-900 mb-6 leading-tight">
              POS that works as hard as you and Faster than you.
            </h1>
            <p className="text-gray-600 text-base lg:text-xl mb-12 leading-relaxed max-w-xl">
              Grow without limit with Triaxx and Make timely and accurate decision with real-time reports
            </p>
            <div className="flex items-center gap-4 bg-white rounded-xl px-6 py-4 shadow-lg w-[200px]">
              <div className="flex items-center gap-3">
                <span className="font-medium text-lg">English</span>
                <img
                  src="https://flagcdn.com/us.svg"
                  alt="USA Flag"
                  className="w-8 h-5 rounded-sm shadow-sm object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="w-full lg:max-w-2xl bg-white shadow-xl overflow-y-auto px-4 sm:px-8 py-10 sm:py-16 min-h-screen">
          <div className="max-w-lg mx-auto w-full">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl sm:text-4xl font-bold text-black">Sign In</h1>
              <img src={logo} alt="Company Logo" className="h-9 w-[150px] sm:w-[210px]" />
            </div>

            <div className="text-center mb-8">
              <p className="text-gray-600 text-base sm:text-lg">
                Welcome back! Please sign in to continue
              </p>
            </div>

            <div className="flex justify-center mb-8">
              <div className="flex items-center gap-4 sm:gap-6">
                <button className="text-lg sm:text-2xl font-bold text-gray-600">Employee</button>
                <button className="text-lg sm:text-2xl font-bold text-gray-600">Manager</button>
                <div className="flex flex-col items-center">
                  <button className="text-lg sm:text-2xl font-bold bg-gradient-to-b from-purple-700 to-red-600 bg-clip-text text-transparent">
                    Admin
                  </button>
                  <div className="w-10 sm:w-16 h-1 bg-gradient-to-r from-purple-700 to-red-600 mt-1 sm:mt-2 rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Display Error */}
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="block text-base sm:text-xl font-medium text-black mb-2">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full px-5 py-4 bg-gradient-to-b from-purple-50 to-red-50 rounded-xl text-gray-600 placeholder-gray-500 border-0 focus:outline-none focus:ring-2 focus:ring-purple-500 text-base sm:text-lg"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-base sm:text-xl font-medium text-black">Password</label>
                  <button
                    type="button"
                    className="text-sm text-gray-600 hover:text-gray-800"
                    onClick={() => navigate('/forgot-password')}
                    disabled={loading}
                  >
                    Forget Password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full px-5 py-4 bg-gradient-to-b from-purple-50 to-red-50 rounded-xl text-gray-600 placeholder-gray-500 border-0 focus:outline-none focus:ring-2 focus:ring-purple-500 pr-14 text-base sm:text-lg"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-5 h-5 border-2 border-black rounded"
                  disabled={loading}
                />
                <label htmlFor="remember" className="text-base font-medium text-black">Remember me</label>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full bg-gradient-to-b from-purple-700 to-red-600 text-white font-medium text-lg sm:text-xl py-4 rounded-xl hover:shadow-lg transition-shadow flex items-center justify-center ${
                    loading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {loading ? (
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                    </svg>
                  ) : (
                    'Submit'
                  )}
                </button>

                <p className="text-center text-sm sm:text-base text-gray-700 mt-6">
                  Don't have an account? <span className='text-[#FF8682] cursor-pointer'>Sign up</span>
                </p>
              </div>

              <div className="flex items-center gap-3 my-6">
                <div className="flex-1 h-px bg-gray-400"></div>
                <span className="text-sm sm:text-base text-gray-600 px-2">Or login with</span>
                <div className="flex-1 h-px bg-gray-400"></div>
              </div>

              <div className="flex flex-wrap justify-center gap-3">
                {[
                  { icon: <svg className="w-6 h-6 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12a10 10 0 1 0-11.5 9.87v-6.99H8v-2.88h2.5V9.5c0-2.48 1.49-3.88 3.77-3.88 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87H17l-.4 2.88h-2.1v6.99A10 10 0 0 0 22 12Z" /></svg> },
                  { icon: <svg className="w-6 h-6" viewBox="0 0 24 24"><path fill="#FFC107" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#FF3D00" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#4CAF50" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#1976D2" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg> },
                  { icon: <svg className="w-6 h-6" fill="#000000" viewBox="0 0 24 24"><path d="M16.61 1.64c0 1.14-.42 2.09-1.26 2.93-.84.85-1.77 1.33-2.78 1.26a3.1 3.1 0 0 1-.03-.39c0-1.09.45-2.08 1.31-2.95.88-.87 1.93-1.31 3.04-1.31.02.16.02.31.02.46zm5.28 16.69c-.36.83-.79 1.6-1.27 2.3-.65.94-1.18 1.59-1.6 1.94-.65.6-1.34.91-2.06.94-.52 0-1.14-.15-1.85-.45s-1.36-.45-1.79-.45c-.47 0-1.05.15-1.75.45s-1.27.45-1.73.45c-.74-.03-1.46-.36-2.15-1-1.02-.93-1.87-2.19-2.53-3.77S3 15.54 3 13.96c0-1.63.37-3.03 1.1-4.17a6.25 6.25 0 0 1 2.37-2.35 6.5 6.5 0 0 1 3.09-.77c.6 0 1.39.17 2.36.5.97.34 1.58.5 1.84.5.2 0 .88-.2 2.02-.61a5.56 5.56 0 0 1 2-.38c1.47.12 2.56.65 3.26 1.59-1.3.79-1.94 1.91-1.91 3.36.03 1.26.46 2.3 1.29 3.11.41.39.87.69 1.36.89z" /></svg> }
                ].map((item, i) => (
                  <button
                    key={i}
                    type="button"
                    className="w-28 h-12 border border-indigo-500 rounded flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
                    disabled={loading}
                  >
                    {item.icon}
                  </button>
                ))}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}