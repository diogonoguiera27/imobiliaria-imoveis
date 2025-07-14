import React from 'react';
import LoginLayout from '@/components/LoginLayout';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const LoginPage: React.FC = () => {
  return (
    <LoginLayout>
      <h2 className="!text-3xl !font-bold !mb-10 !mt-7">Login</h2>

      <form className="!space-y-5">
        <div>
          <Label htmlFor="username" className="!block !text-sm !mb-4">Username</Label>
          <Input
            id="username"
            type="text"
            placeholder="Enter your username"
            className="w-full !px-4 !py-2 !bg-red-800 !text-white border !border-red-300 !rounded-full  !placeholder-red-300 !focus:outline-none"
          />
        </div>

        <div>
          <Label htmlFor="password" className="!block !text-sm !mb-4">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            className="w-full !px-4 !py-2 !bg-red-800 !text-white border !border-red-300 !rounded-full  placeholder-red-300 !focus:outline-none"
          />
        </div>

        <div className="!text-right !text-sm ">
          <a href="#" className="!text-red-200 !hover:underline">Forgot Password?</a>
        </div>

        <Button
          type="submit"
          className="w-full !bg-white !text-red-900 !font-bold !py-2 !rounded-full !hover:bg-red-200"
        >
          Login to Platform
        </Button>

        <div className="!text-sm !text-center !mt-4">
          Don’t have an account?{' '}
          <a href="#" className="!text-red-200 !underline">Register Now</a>
        </div>
      </form>
    </LoginLayout>
  );
};

export default LoginPage;
