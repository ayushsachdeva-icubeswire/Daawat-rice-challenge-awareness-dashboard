import { yupResolver } from '@hookform/resolvers/yup'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useSearchParams } from 'react-router-dom'
import * as yup from 'yup'

import { useAuthContext } from '@/context/useAuthContext'
import { useNotificationContext } from '@/context/useNotificationContext'
import { API_CONFIG } from '@/config/api'
import type { UserType } from '@/types/auth'

const useSignIn = () => {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const { saveSession } = useAuthContext()
  const [searchParams] = useSearchParams()

  const { showNotification } = useNotificationContext()

  const loginFormSchema = yup.object({
    username: yup.string().required('Please enter your username'),
    password: yup.string().required('Please enter your password'),
  })

  const { control, handleSubmit } = useForm({
    resolver: yupResolver(loginFormSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  })

  type LoginFormFields = yup.InferType<typeof loginFormSchema>

  const redirectUser = () => {
    const redirectLink = searchParams.get('redirectTo')
    if (redirectLink) navigate(redirectLink)
    else navigate('/')
  }

  const login = handleSubmit(async (values: LoginFormFields) => {
    setLoading(true)
    try {
      const response = await fetch(`${API_CONFIG.API_URL}${API_CONFIG.ENDPOINTS.AUTH.LOGIN}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values)
      })
      
      if (response.ok) {
        const data: UserType = await response.json()
        
        if (data.token) {
          saveSession({
            ...data,
            token: data.token,
          })
          redirectUser()
          showNotification({ message: 'Successfully logged in.', variant: 'success' })
        }
      } else {
        const errorData = await response.json().catch(() => ({}))
        
        if (errorData.error) {
          showNotification({ message: errorData.error, variant: 'danger' })
        } else if (errorData.message) {
          showNotification({ message: errorData.message, variant: 'danger' })
        } else {
          showNotification({ message: `Login failed with status: ${response.status}`, variant: 'danger' })
        }
      }
    } catch (error) {
      showNotification({ message: 'Network error. Please try again.', variant: 'danger' })
    } finally {
      setLoading(false)
    }
  })

  return { loading, login, control }
}

export default useSignIn
