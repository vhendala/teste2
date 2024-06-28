"use client"

import axios from "axios";
import Link from "next/link";
import { useState } from "react";
import AuthPage from "@/components/AuthPage";

function Login() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e:any)=>{
        e.preventDefault()
        axios
            .post("http://localhost:8001/api/auth/login", {email,password})
            .then((res)=>{
            console.log(res.data)
            })
            .catch((err)=>{
            console.log(err)
            })
    }

    return (
        <AuthPage>
                <h1 className="font-bold text-2xl">LOGIN</h1>
                <div className="flex flex-col justify-between items-start">
                    <label htmlFor="email" className="">Email:</label>
                    <input 
                        type="text" 
                        id="email" 
                        onChange={(e)=>setEmail(e.currentTarget.value)}
                        className="border-gray-400 border-b w-full focus-visible:border-gray-700 focus-visible:border-b focus-visible:outline-none"
                    />
                </div>
                <div className="flex flex-col justify-between items-start">
                    <label htmlFor="password">Password:</label>
                    <input 
                        type="password" 
                        id="password" 
                        onChange={(e)=>setPassword(e.currentTarget.value)}
                        className="border-gray-400 border-b w-full focus-visible:border-gray-700 focus-visible:border-b focus-visible:outline-none"
                    />
                </div>
                <button className="bg-blue-600 py-3 font-bold text-white rounded-lg hover:bg-blue-800" onClick={(e)=>handleLogin(e)}>
                    ENTRAR
                </button>
                <Link href="/register" className="text-center underline">
                    Cadastrar-se
                </Link>
        </AuthPage>
    );
}

export default Login;