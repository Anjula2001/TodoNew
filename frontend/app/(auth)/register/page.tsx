'use client';
import Link from "next/link";
import React, { useState} from 'react';
import { FcGoogle } from "react-icons/fc";  
import { FaFacebookF } from "react-icons/fa";
import { useRouter } from "next/navigation";

type FormState = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  agree: boolean;
};

type ErrorState = {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  agree?: string;
};

const Register: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<FormState>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agree: false,
  });

  const [errors, setErrors] = useState<ErrorState>({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const validate = (): boolean => {
    const newErrors: ErrorState = {};

    if (!formData.name.trim()) {
      newErrors.name = '*Name is required';
    }

    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '*Enter a valid email';
    }
  
    else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*[\d\W]).{8,}$/.test(formData.password)) {
      newErrors.password ="*Enter valid password.";
     }

    else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '*Passwords do not match';
    }

    else if(!formData.agree) {
      newErrors.agree = '*You must agree to the Terms & Conditions';
    }
    else{

    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const registerUser = async (data: { name: string; email: string; password: string }) => {
    try {
      setLoading(true);
      setSuccessMessage(null);
      setErrorMessage(null);

      const res = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.text(); // backend returns plain text
if (res.ok) {
        setSuccessMessage(result); // show success message
        alert(result + ". Please login to continue.");
        
        // Redirect to login page after successful registration
        setTimeout(() => {
          router.push('/login');
        }, 1500);
      } else {
        setErrorMessage(result); // show backend error
        alert(result);
        setErrorMessage(result); // show backend error
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      await registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });

      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        agree: false
      });
      setErrors({});
    }
  };

  return ( //what user see
    
    <div className="flex h-screen min-h-0 font-sans">
      {/*left*/}
      <div className="flex-1 flex flex-col bg-white justify-center p-3 overflow-y-auto scrollbar-hide">
        <br/>
        <br/><br/>
        <h1 className="text-3xl font-bold mb-6 text-black-800 flex justify-center items-center px-8">
          Create an account
        </h1>

        <form onSubmit={handleSubmit} className="flex justify-center flex-col gap-4">
          <label  className="block text-gray-700 mb-0 pl-15">Name</label>
          <div className="flex flex-col items-center gap-1" >
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              type="text"
              placeholder="Enter User Name"
              className="flex items-center justify-center w-3/4 p-3 border-2 border-gray-300 rounded-lg bg-teal-100 focus:outline-none placeholder-gray-500 text-gray-800 text-center"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <label className="block text-gray-700 mb-0 pl-15">Email</label>
          <div className="flex flex-col items-center gap-1">
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              type="email"
              placeholder="Enter your email"
              className=" flex justify-center gap-4 w-3/4 p-3 border-2 border-gray-300 rounded-lg bg-teal-100 focus:outline-none placeholder-gray-500 text-gray-800 text-center"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <label className="block text-gray-700 mb-0 pl-15">Password</label>
          <div className="flex justify-center gap-1 flex-col items-center">
            <input
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="flex items-center justify-center w-3/4 p-3 border-2 border-gray-300 rounded-lg bg-teal-100 focus:outline-none placeholder-gray-500 text-gray-800 text-center"
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}

          </div>

          <label className="block text-gray-700 mb-0 pl-15">Confirm Password</label>
           <div className="flex justify-center gap-1 flex-col items-center">
            <input
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter your password"
              className="flex items-center justify-center w-3/4 p-3 border-2 border-gray-300 rounded-lg bg-teal-100 focus:outline-none placeholder-gray-500 text-gray-800 text-center"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
            )}
          </div>
          
          <div className="flex flex-col items-center gap-1 my-4">
            <div className="flex items-center gap-2 text-black-700  ">
              <input 
                id="agree"
                name="agree"
                type="checkbox" 
                checked={formData.agree}
                onChange={handleChange}
                className="w-4 h-4 text-green-600 accent-green-600" />
              <label className="items-center text-sm text-center" >
                I agree to all the{' '}
                 <Link
                     href="/register/terms-condition"
                    className="underline text-teal-600 ml-1 hover:text-teal-900"
                 >
                    Terms &amp; Conditions
                 </Link>

              </label>
            </div>
            {errors.agree && (
                <p id="agree-error" className="text-red-500 text-sm mt-1">
                  {errors.agree}
                </p>
             )}
          </div>
          
          <div className="flex justify-center gap-4">
            <button
              type="submit"
              className="w-1/2 p-3 bg-teal-500 text-white py-3 rounded-lg hover:bg-teal-600 transition-all font-semibold"
            >
              Sign Up
            </button>
          </div>

          <div className="flex items-center justify-center gap-3 my-2 text-gray-500">
            <hr className="w-1/4 border-gray-300" />
            <span>or</span>
            <hr className="w-1/4 border-gray-300" />
          </div>

          <div className="flex justify-center gap-4">
            <button 
             onClick={() => window.open('https://www.google.com', '_blank')}
             className="flex items-center gap-2 bg-gray-100 px-5 py-2 rounded-lg hover:bg-gray-200 transition-all">
              <FcGoogle className="w-5 h-5"/>
              Google
            </button>
            <button 
              onClick={() => window.open('https://www.facebook.com', '_blank')}
              className="flex items-center gap-2 bg-gray-100 px-5 py-2 rounded-lg hover:bg-gray-200 transition-all">
              <FaFacebookF className="w-5 h-5 text-blue-600"/>
              Facebook
            </button>
          </div>

          <p className="text-center text-gray-600 mt-3">
            Already have an account?{' '}
            <a href="/login" className="text-green-600 font-semibold  hover:text-green-900">
              Log in
            </a>
          </p>
        </form>
      </div>

      {/*right*/}
      <div className="w-1/2 flex flex-col justify-center items-left text-left bg-teal-500 font-sans rounded-l-2xl p-10">

        <h1 className="text-8xl font-bold  text-black mb-4 flexs">TODO.</h1>
        <hr className="w-full border-t-2 border-white my-4" />
        <br/>
        <h2 className="text-3xl font-semibold text-black mb-4">
          Create Your TaskFlow Account</h2><br/>
        
        <p className="text-xl text-white text-justify">
          Join our secure, modern platform to organize your work, boost productivity, and stay in control of your daily tasks from anywhere,
          at any time.
        </p>
        <div >
          <Link
              href="/register/needhelp"
              className=" absolute bottom-6 right-8 underline text-black-600 font-semibold  hover:text-black-900">
              Need help?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
