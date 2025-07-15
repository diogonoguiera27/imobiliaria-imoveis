import React from 'react';
import LoginLayout from '@/components/LoginLayout';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const schema = z.object({
  name: z.string().min(1, 'Nome obrigatório'),
  phone: z
    .string()
    .min(10, 'Telefone inválido')
    .regex(/^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/, 'Formato: (xx) xxxxx-xxxx'),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  city: z.string().min(1, 'Cidade obrigatória'),
});

type RegisterFormData = z.infer<typeof schema>;

const RegisterPage: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: RegisterFormData) => {
    console.log('Cadastro:', data);
    // Enviar dados para a API aqui
  };

  return (
    <LoginLayout>
      <h2 className="!text-3xl !font-bold !mb-10 !mt-7">Criar Conta</h2>

      <form className="!space-y-5" onSubmit={handleSubmit(onSubmit)}>
        {/* Nome */}
        <div>
          <Label htmlFor="name" className="!block !text-sm !mb-4">Nome</Label>
          <Input
            id="name"
            type="text"
            placeholder="Digite seu nome"
            {...register('name')}
            className="w-full !px-4 !py-2 !bg-red-800 !text-white border !border-red-300 !rounded-full !placeholder-red-300 !focus:outline-none"
          />
          {errors.name && <p className="!text-sm text-red-300 !mt-2">{errors.name.message}</p>}
        </div>

        {/* Telefone */}
        <div>
          <Label htmlFor="phone" className="!block !text-sm !mb-4">Telefone</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="(xx) xxxxx-xxxx"
            {...register('phone')}
            className="w-full !px-4 !py-2 !bg-red-800 !text-white border !border-red-300 !rounded-full !placeholder-red-300 !focus:outline-none"
          />
          {errors.phone && <p className="!text-sm text-red-300 !mt-2">{errors.phone.message}</p>}
        </div>

        {/* E-mail */}
        <div>
          <Label htmlFor="email" className="!block !text-sm !mb-4">E-mail</Label>
          <Input
            id="email"
            type="email"
            placeholder="Digite seu e-mail"
            {...register('email')}
            className="w-full !px-4 !py-2 !bg-red-800 !text-white border !border-red-300 !rounded-full !placeholder-red-300 !focus:outline-none"
          />
          {errors.email && <p className="!text-sm text-red-300 !mt-2">{errors.email.message}</p>}
        </div>

        {/* Senha */}
        <div>
          <Label htmlFor="password" className="!block !text-sm !mb-4">Senha</Label>
          <Input
            id="password"
            type="password"
            placeholder="Crie sua senha"
            {...register('password')}
            className="w-full !px-4 !py-2 !bg-red-800 !text-white border !border-red-300 !rounded-full !placeholder-red-300 !focus:outline-none"
          />
          {errors.password && <p className="!text-sm text-red-300 !mt-2">{errors.password.message}</p>}
        </div>

        {/* Cidade */}
        <div>
          <Label htmlFor="city" className="!block !text-sm !mb-4">Cidade</Label>
          <Input
            id="city"
            type="text"
            placeholder="Informe sua cidade"
            {...register('city')}
            className="w-full !px-4 !py-2 !bg-red-800 !text-white border !border-red-300 !rounded-full !placeholder-red-300 !focus:outline-none"
          />
          {errors.city && <p className="!text-sm text-red-300 !mt-2">{errors.city.message}</p>}
        </div>

        {/* Botão */}
        <Button
          type="submit"
          className="w-full !bg-white !text-red-900 !font-bold !py-2 !rounded-full !hover:bg-red-200"
        >
          Criar Conta
        </Button>

        <div className="!text-sm !text-center !mt-4">
          Já tem uma conta?{' '}
          <a href="/login" className="!text-red-200 !underline">Fazer login</a>
        </div>
      </form>
    </LoginLayout>
  );
};

export default RegisterPage;
