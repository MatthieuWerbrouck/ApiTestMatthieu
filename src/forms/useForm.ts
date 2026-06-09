import { useState, useCallback } from 'react'

interface UseFormConfig<T> {
  initialValues: T
  validators?: Partial<Record<keyof T, (v: unknown) => string | null>>
  onSubmit: (values: T) => void | Promise<void>
}

interface UseFormReturn<T> {
  values: T
  errors: Partial<Record<keyof T, string>>
  touched: Partial<Record<keyof T, boolean>>
  isSubmitting: boolean
  handleChange: (field: keyof T) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void
  handleBlur: (field: keyof T) => () => void
  handleSubmit: (e: React.FormEvent) => void
  setFieldValue: (field: keyof T, value: unknown) => void
  reset: () => void
}

export function useForm<T extends Record<string, unknown>>(config: UseFormConfig<T>): UseFormReturn<T> {
  const { initialValues, validators, onSubmit } = config

  const [values, setValues] = useState<T>(initialValues)
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({})
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateField = useCallback(
    (field: keyof T, value: unknown): string | undefined => {
      const validator = validators?.[field]
      if (!validator) return undefined
      const error = validator(value)
      return error ?? undefined
    },
    [validators]
  )

  const validateAll = useCallback(
    (vals: T): Partial<Record<keyof T, string>> => {
      if (!validators) return {}
      const newErrors: Partial<Record<keyof T, string>> = {}
      for (const field in validators) {
        const error = validateField(field as keyof T, vals[field as keyof T])
        if (error) {
          newErrors[field as keyof T] = error
        }
      }
      return newErrors
    },
    [validators, validateField]
  )

  const handleChange = useCallback(
    (field: keyof T) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const value = e.target.type === 'checkbox'
          ? (e.target as HTMLInputElement).checked
          : e.target.value
        setValues(prev => ({ ...prev, [field]: value }))
        if (touched[field]) {
          const error = validateField(field, value)
          setErrors(prev => ({ ...prev, [field]: error }))
        }
      },
    [touched, validateField]
  )

  const handleBlur = useCallback(
    (field: keyof T) => () => {
      setTouched(prev => ({ ...prev, [field]: true }))
      const error = validateField(field, values[field])
      setErrors(prev => ({ ...prev, [field]: error }))
    },
    [values, validateField]
  )

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()

      // Mark all fields as touched
      const allTouched = Object.keys(values).reduce(
        (acc, key) => ({ ...acc, [key]: true }),
        {} as Partial<Record<keyof T, boolean>>
      )
      setTouched(allTouched)

      const newErrors = validateAll(values)
      setErrors(newErrors)

      if (Object.keys(newErrors).length > 0) return

      setIsSubmitting(true)
      Promise.resolve(onSubmit(values)).finally(() => {
        setIsSubmitting(false)
      })
    },
    [values, validateAll, onSubmit]
  )

  const setFieldValue = useCallback(
    (field: keyof T, value: unknown) => {
      setValues(prev => ({ ...prev, [field]: value }))
      if (touched[field]) {
        const error = validateField(field, value)
        setErrors(prev => ({ ...prev, [field]: error }))
      }
    },
    [touched, validateField]
  )

  const reset = useCallback(() => {
    setValues(initialValues)
    setErrors({})
    setTouched({})
    setIsSubmitting(false)
  }, [initialValues])

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    reset,
  }
}
