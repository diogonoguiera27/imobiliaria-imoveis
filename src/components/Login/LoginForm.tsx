import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useAuth from '@/hooks/auth/useAuth';

const schema = z.object({
  email: z.string().email('E-mail inválido'),
  senha: z.string().min(1, 'Senha obrigatória'),
});

type FormData = z.infer<typeof schema>;

type LoginFormProps = {
  onToggleForgotPassword: () => void
};

const LoginForm: React.FC<LoginFormProps> = ({ onToggleForgotPassword }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const { signIn } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data: FormData) => {
    try {
      await signIn({
        email: data.email,
        senha: data.senha,
        keepConnected: true,
      });

      toast.success('Login realizado com sucesso!');
      setTimeout(() => navigate("/home"), 2000);
    } catch (error) {
      console.error("Erro ao logar:", error);
      toast.error("Usuário ou senha inválidos");
    }
  };

  return (
    <>
      <ToastContainer />
      <h2 className="!text-3xl !font-bold !mb-10 !mt-7">Login</h2>

      <form className="!space-y-5" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Label htmlFor="email" className="!block !text-sm !mb-4">E-mail</Label>
          <Input
            id="email"
            type="text"
            placeholder="Digite seu e-mail"
            {...register('email')}
            className="w-full !px-4 !py-2 !bg-red-800 !text-white border !border-red-300 !rounded-full  !placeholder-red-300 !focus:outline-none"
          />
          {errors.email && (
            <p className="!text-sm text-red-300 !mt-2">{errors.email.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="senha" className="!block !text-sm !mb-4">Senha</Label>
          <Input
            id="senha"
            type="password"
            placeholder="Digite sua senha"
            {...register('senha')}
            className="w-full !px-4 !py-2 !bg-red-800 !text-white border !border-red-300 !rounded-full placeholder-red-300 !focus:outline-none"
          />
          {errors.senha && (
            <p className="!text-sm text-red-300 !mt-2">{errors.senha.message}</p>
          )}
        </div>

        <div className="!text-right !text-sm">
          <button
            type="button"
            onClick={onToggleForgotPassword}
            className="!text-red-200 !hover:underline cursor-pointer"
          >
            Esqueceu a senha?
          </button>
        </div>

        <Button
          type="submit"
          className="w-full !bg-white !text-red-900 !font-bold !py-2 !rounded-full !hover:bg-red-200"
        >
          Entrar na Plataforma
        </Button>

        <div className="!text-sm !text-center !mt-4">
          Ainda não tem conta?{' '}
          <a href="/register" className="!text-red-200 !underline">Cadastre-se</a>
        </div>
      </form>
    </>
  );
};

export default LoginForm;
