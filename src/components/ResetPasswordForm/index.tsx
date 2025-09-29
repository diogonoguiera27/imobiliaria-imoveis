
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { resetPassword } from '@/service/authService'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

type Props = {
  email: string
  onDone?: () => void
}

export default function ResetPasswordForm({ email, onDone }: Props) {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (password !== confirm) {
      setError('As senhas não coincidem.')
      return
    }
    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.')
      return
    }

    setError(null)
    setLoading(true)
    try {
      await resetPassword(email, password)
      toast.success('Senha alterada com sucesso!')
      onDone?.() 
    } catch (err: unknown) {
      let msg = 'Erro ao redefinir senha. Tente novamente.'
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response?: { data?: { error?: string } } }
        msg = axiosErr.response?.data?.error || msg
      }
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      
      <ToastContainer position="top-right" />
      <form onSubmit={handleSubmit} className="w-full !space-y-5">
        <div>
          <Label htmlFor="password" className="!block !text-sm !mb-4 text-white">
            Nova senha
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="Digite a nova senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full !px-4 !py-2 !bg-red-800 !text-white !border !border-red-300 !rounded-full !placeholder-red-300 !focus:outline-none"
          />
        </div>

        <div>
          <Label htmlFor="confirm" className="!block !text-sm !mb-4 text-white">
            Confirmar senha
          </Label>
          <Input
            id="confirm"
            type="password"
            placeholder="Confirme a nova senha"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            className="w-full !px-4 !py-2 !bg-red-800 !text-white !border !border-red-300 !rounded-full !placeholder-red-300 !focus:outline-none"
          />
        </div>

        {error && <p className="text-red-200 text-sm">{error}</p>}

        <Button
          type="submit"
          disabled={loading}
          className="w-full !bg-white !text-red-900 !font-bold !py-2 !rounded-full !hover:bg-red-200 disabled:opacity-60"
        >
          {loading ? 'Salvando...' : 'Redefinir senha'}
        </Button>
      </form>
    </>
  )
}
