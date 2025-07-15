import React from 'react';
import LoginLayout from '@/components/LoginLayout';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
  username: z.string().min(1, 'Username obrigatório'),
  password: z.string().min(1, 'Senha obrigatória'),
});

type FormData = z.infer<typeof schema>;

const LoginPage: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    console.log('Login data:', data);
  };

  return (
    <LoginLayout>
      <h2 className="!text-3xl !font-bold !mb-10 !mt-7">Login</h2>

      <form className="!space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Label htmlFor="username" className="!block !text-sm !mb-4">Username</Label>
          <Input
            id="username"
            type="text"
            placeholder="Enter your username"
            {...register('username')}
            className="w-full !px-4 !py-2 !bg-red-800 !text-white border !border-red-300 !rounded-full  !placeholder-red-300 !focus:outline-none"
          />
          {errors.username && (
            <p className="!text-sm text-red-300 !mt-2">{errors.username.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="password" className="!block !text-sm !mb-4">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            {...register('password')}
            className="w-full !px-4 !py-2 !bg-red-800 !text-white border !border-red-300 !rounded-full  placeholder-red-300 !focus:outline-none"
          />
           {errors.password && (
            <p className="!text-sm text-red-300 !mt-2">{errors.password.message}</p>
          )}
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
          <a href="/register" className="!text-red-200 !underline">Register Now</a>
        </div>
      </form>
    </LoginLayout>
  );
};

export default LoginPage;
