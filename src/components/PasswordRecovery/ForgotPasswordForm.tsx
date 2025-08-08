// src/components/ForgotPassword/ForgotPasswordForm.tsx
import { useState } from 'react'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Button } from '../ui/button'
import { sendForgotPassword } from '@/service/authService'
import { toast } from 'react-toastify'

type Props = {
  onSent: (email: string) => void
}

export default function ForgotPasswordForm({ onSent }: Props) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!email) return

    setLoading(true)
    try {
      await sendForgotPassword(email)
      toast.success('Se houver conta, enviaremos um código para o e-mail informado.')
      onSent(email)
    } catch (err: unknown) {
      let msg = 'Erro ao enviar código. Tente novamente.'

      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response?: { data?: { error?: string } } }
        msg = axiosErr.response?.data?.error || msg
      }

      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="!w-full !space-y-5">
      <div>
        <Label htmlFor="email" className="!block !text-sm !mb-4 text-white">
          E-mail
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="Digite seu e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full !px-4 !py-2 !bg-red-800 !text-white !border !border-red-300 !rounded-full !placeholder-red-300 !focus:outline-none"
        />
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full !bg-white !text-red-900 !font-bold !py-2 !rounded-full !hover:bg-red-200 disabled:opacity-60"
      >
        {loading ? 'Enviando...' : 'Enviar código de verificação'}
      </Button>
    </form>
  )
}
