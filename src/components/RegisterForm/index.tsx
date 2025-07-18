// src/components/Register/index.tsx
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '@/service/authService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const schema = z.object({
  nome: z.string().min(1, 'Nome obrigatório'),
  telefone: z
    .string()
    .min(10, 'Telefone inválido')
    .regex(/^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/, 'Formato: (xx) xxxxx-xxxx'),
  email: z.string().email('E-mail inválido'),
  senha: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  cidade: z.string().min(1, 'Cidade obrigatória'),
});

type RegisterFormData = z.infer<typeof schema>;

const RegisterForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(schema),
  });

  const navigate = useNavigate();

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await registerUser(data);
      toast.success("Usuário cadastrado com sucesso!");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error);
      toast.error("Erro ao criar conta. Tente novamente.");
    }
  };

  return (
    <>
      <ToastContainer />
      <h2 className="!text-3xl !font-bold !mb-10 !mt-7">Criar Conta</h2>

      <form className="!space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Label htmlFor="nome" className="!block !text-sm !mb-4">Nome</Label>
          <Input
            id="nome"
            type="text"
            placeholder="Digite seu nome"
            {...register('nome')}
            className="w-full !px-4 !py-2 !bg-red-800 !text-white border !border-red-300 !rounded-full !placeholder-red-300 !focus:outline-none"
          />
          {errors.nome && <p className="!text-sm text-red-300 !mt-2">{errors.nome.message}</p>}
        </div>

        <div>
          <Label htmlFor="telefone" className="!block !text-sm !mb-4">Telefone</Label>
          <Input
            id="telefone"
            type="tel"
            placeholder="(xx) xxxxx-xxxx"
            {...register('telefone')}
            className="w-full !px-4 !py-2 !bg-red-800 !text-white border !border-red-300 !rounded-full !placeholder-red-300 !focus:outline-none"
          />
          {errors.telefone && <p className="!text-sm text-red-300 !mt-2">{errors.telefone.message}</p>}
        </div>

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

        <div>
          <Label htmlFor="senha" className="!block !text-sm !mb-4">Senha</Label>
          <Input
            id="senha"
            type="password"
            placeholder="Crie sua senha"
            {...register('senha')}
            className="w-full !px-4 !py-2 !bg-red-800 !text-white border !border-red-300 !rounded-full !placeholder-red-300 !focus:outline-none"
          />
          {errors.senha && <p className="!text-sm text-red-300 !mt-2">{errors.senha.message}</p>}
        </div>

        <div>
          <Label htmlFor="cidade" className="!block !text-sm !mb-4">Cidade</Label>
          <Input
            id="cidade"
            type="text"
            placeholder="Informe sua cidade"
            {...register('cidade')}
            className="w-full !px-4 !py-2 !bg-red-800 !text-white border !border-red-300 !rounded-full !placeholder-red-300 !focus:outline-none"
          />
          {errors.cidade && <p className="!text-sm text-red-300 !mt-2">{errors.cidade.message}</p>}
        </div>

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
    </>
  );
};

export default RegisterForm;
