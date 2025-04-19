"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { signUpUser, signInUser } from "@/lib/auth"; 

const AuthForm = () => {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    if (isLogin) {
       const {error} = await signInUser(data.email, data.password);
       console.log(error)
       if(!error){
        router.push("/");
       }
         else{
          alert("Login failed. Please check your credentials.");
         }
    } else {
      const {error} = await signUpUser(data.email, data.password, data.name);
           
      if(!error){
            alert("Sign up successful! Please check your email for verification.");
            router.push("/auth");
        }
        else{
            alert(error.message);
        }
    }
  };

  return (
    <div className="max-w-md w-full mx-auto p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-center">
        {isLogin ? "Sign In" : "Sign Up"}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {!isLogin && (
          <div>
            <label className="block mb-1 font-medium">Name</label>
            <input
              type="text"
              {...register("name", { required: !isLogin })}
              className="w-full border border-gray-300 p-2 rounded"
            />
            {errors.name && <p className="text-red-500 text-sm">Name is required</p>}
          </div>
        )}

        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            {...register("email", 
              { required: true, 
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Invalid email address"
              }},
            )}
            className="w-full border border-gray-300 p-2 rounded"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message || "Email is required"}</p>}
        </div>

        <div>
          <label className="block mb-1 font-medium">Password</label>
          <input
            type="password"
            {...register("password", { required: true })}
            className="w-full border border-gray-300 p-2 rounded"
          />
          {errors.password && <p className="text-red-500 text-sm">Password is required</p>}
        </div>

        <button
          type="submit"
          className="w-full bg-primary text-white py-2 rounded hover:bg-opacity-90"
        >
          {isLogin ? "Sign In" : "Sign Up"}
        </button>
      </form>

      <p className="text-sm text-center mt-4">
        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
        <button
          className="text-blue-600 hover:underline"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? "Sign Up" : "Sign In"}
        </button>
      </p>
    </div>
  );
};

export default AuthForm;
