// src/pages/Login/index.tsx
import { useState } from 'react'
import LoginLayout from '@/components/Login/LoginLayout'
import LoginForm from '@/components/Login/LoginForm'
import { ForgotPasswordForm, VerifyCodeForm,ResetPasswordForm } from '@/components/PasswordRecovery'



type Step = 'login' | 'forgot' | 'verify' | 'reset'

export default function LoginPage() {
  const [step, setStep] = useState<Step>('login')
  const [email, setEmail] = useState('')

  return (
    <LoginLayout>
      <div className="h-full flex flex-col justify-center items-center w-full max-w-md mx-auto">
        {step === 'login' && (
          <div className="w-full">
            <LoginForm onToggleForgotPassword={() => setStep('forgot')} />
          </div>
        )}

        {step === 'forgot' && (
          <div className="w-full">
            <h2 className="!text-3xl !font-bold !mb-2">Esqueceu sua senha?</h2>
            <p className="!text-sm !mb-6 opacity-90">
              Digite seu e-mail abaixo e enviaremos um <strong>código de verificação</strong>.
            </p>

            <ForgotPasswordForm
              onSent={(emailValue: string) => {
                setEmail(emailValue)
                setStep('verify')
              }}
            />

            <p className="!mt-6 !text-sm !text-center">
              <button
                type="button"
                onClick={() => setStep('login')}
                className="!text-white !underline cursor-pointer"
              >
                Voltar para login
              </button>
            </p>
          </div>
        )}

        {step === 'verify' && (
          <div className="w-full">
            <h2 className="!text-3xl !font-bold !mb-2">Verificar código</h2>
            <p className="!text-sm !mb-6 opacity-90">
              Informe o <strong>código de 6 dígitos</strong> enviado para <span className="font-semibold">{email}</span>.
            </p>

            <VerifyCodeForm
              email={email}
              onBack={() => setStep('forgot')}
              onVerified={() => setStep('reset')}
            />
          </div>
        )}

        {step === 'reset' && (
          <div className="w-full">
            <h2 className="!text-3xl !font-bold !mb-2">Redefinir senha</h2>
            <p className="!text-sm !mb-6 opacity-90">
              Crie uma nova senha para sua conta.
            </p>

            {/* >>> Passando o email aqui agora <<< */}
            <ResetPasswordForm
              email={email}
              onDone={() => setStep('login')}
            />

            <p className="!mt-6 !text-sm !text-center">
              <button
                type="button"
                onClick={() => setStep('login')}
                className="!text-white !underline cursor-pointer"
              >
                Voltar para login
              </button>
            </p>
          </div>
        )}
      </div>
    </LoginLayout>
  )
}
