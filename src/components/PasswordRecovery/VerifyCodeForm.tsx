// src/components/ForgotPassword/VerifyCodeForm.tsx
import { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { verifyResetCode, sendForgotPassword } from '@/service/authService'
import { toast } from 'react-toastify'

type Props = {
  email: string
  onBack?: () => void
  onVerified: (code: string) => void
}

export default function VerifyCodeForm({ email, onBack, onVerified }: Props) {
  const [code, setCode] = useState('')
  const [seconds, setSeconds] = useState(30)
  const [loading, setLoading] = useState(false)
  const canResend = seconds <= 0

  useEffect(() => {
    if (seconds <= 0) return
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000)
    return () => clearTimeout(t)
  }, [seconds])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (code.length !== 6) return

    setLoading(true)
    try {
      await verifyResetCode(email, code)
      toast.success('Código verificado!')
      onVerified(code)
    } catch (err: unknown) {
      let msg = 'Código inválido ou expirado.'
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response?: { data?: { error?: string } } }
        msg = axiosErr.response?.data?.error || msg
      }
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (!canResend) return
    try {
      await sendForgotPassword(email)
      setSeconds(30)
      toast.info('Novo código enviado para seu e-mail.')
    } catch (err: unknown) {
      let msg = 'Não foi possível reenviar o código.'
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response?: { data?: { error?: string } } }
        msg = axiosErr.response?.data?.error || msg
      }
      toast.error(msg)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full !space-y-5">
      <p className="!text-sm opacity-90">
        Enviamos um código para <span className="font-semibold">{email}</span>.
      </p>

      <div>
        <Label htmlFor="code" className="!block !text-sm !mb-4 text-white">
          Código de verificação
        </Label>
        <Input
          id="code"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={6}
          placeholder="••••••"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
          required
          className="w-full !tracking-widest !text-center !px-4 !py-2 !bg-red-800 !text-white !border !border-red-300 !rounded-full !placeholder-red-300 !focus:outline-none"
        />

        <div className="flex items-center justify-between !mt-2 text-xs opacity-90">
          <button type="button" onClick={onBack} className="underline cursor-pointer">
            Voltar
          </button>

          <button
            type="button"
            disabled={!canResend}
            onClick={handleResend}
            className={`underline ${!canResend ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {canResend ? 'Reenviar código' : `Reenviar em ${seconds}s`}
          </button>
        </div>
      </div>

      <Button
        type="submit"
        disabled={code.length !== 6 || loading}
        className="w-full !bg-white !text-red-900 !font-bold !py-2 !rounded-full !hover:bg-red-200 disabled:opacity-60"
      >
        {loading ? 'Verificando...' : 'Verificar código'}
      </Button>
    </form>
  )
}
