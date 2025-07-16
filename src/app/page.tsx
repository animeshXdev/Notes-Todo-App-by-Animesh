/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'react-hot-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { motion } from 'framer-motion'

const schema = z.object({
  email: z.string().email({ message: 'Valid email required' }),
  password: z.string().min(6, { message: 'Minimum 6 characters' }),
})

type FormData = z.infer<typeof schema>

export default function LoginPage() {
  const router = useRouter()

  // ✅ Redirect if already logged in
  useEffect(() => {
    const checkLogin = async () => {
      const res = await fetch('/api/auth/check')
      if (res.ok) {
        router.replace('/dashboard/notes')
      }
    }
    checkLogin()
  }, [router])

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message || 'Login failed')
      }

      toast.success('Login successful!')
      router.push('/dashboard/notes')
    } catch (err: any) {
      toast.error(err.message)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 text-foreground transition-colors">
      <motion.h1
        className="text-3xl md:text-4xl font-bold mb-8 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Notes / Todo App <span className="text-primary">by Animesh</span>
      </motion.h1>

      <motion.div
        className="w-full max-w-sm"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="p-4 shadow-lg">
          <CardContent>
            <h2 className="text-xl font-semibold mb-4 text-center">
              Login to Continue
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Input
                  type="email"
                  placeholder="Email"
                  {...register('email')}
                />
                {errors.email && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <Input
                  type="password"
                  placeholder="Password"
                  {...register('password')}
                />
                {errors.password && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Logging in...' : 'Login'}
              </Button>

              <p className="text-center text-sm text-muted-foreground mt-2">
                Don&apos;t have an account?{' '}
                <a href="/signup" className="text-primary hover:underline">
                  Signup
                </a>
              </p>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
