import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle, CreditCard, CheckCircle } from 'lucide-react'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface AddPaymentMethodFormProps {
  userId: string
  onSuccess: () => void
  onCancel: () => void
}

function AddPaymentMethodForm({ userId, onSuccess, onCancel }: AddPaymentMethodFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>('')

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      setError('Stripe has not loaded yet. Please try again.')
      return
    }

    const cardElement = elements.getElement(CardElement)
    if (!cardElement) {
      setError('Card element not found')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      // Create Setup Intent on the server
      const response = await fetch('/api/stripe/setup-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      })

      const { clientSecret, error: apiError } = await response.json()

      if (apiError || !clientSecret) {
        throw new Error(apiError || 'Failed to create setup intent')
      }

      // Confirm the Setup Intent with the payment method
      const { error: confirmError, setupIntent } = await stripe.confirmCardSetup(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              // You can add billing details here if needed
            },
          },
        }
      )

      if (confirmError) {
        throw new Error(confirmError.message || 'Payment method setup failed')
      }

      if (setupIntent && setupIntent.status === 'succeeded') {
        onSuccess()
      } else {
        throw new Error('Payment method setup was not successful')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: 'hsl(var(--foreground))',
        '::placeholder': {
          color: 'hsl(var(--muted-foreground))',
        },
        backgroundColor: 'transparent',
      },
      invalid: {
        color: 'hsl(var(--destructive))',
        iconColor: 'hsl(var(--destructive))',
      },
    },
    hidePostalCode: true,
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Add Payment Method
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-4 border rounded-lg">
            <CardElement options={cardElementOptions} />
          </div>
          
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <div className="flex gap-3">
            <Button
              type="submit"
              disabled={!stripe || isLoading}
              className="flex-1"
            >
              {isLoading ? 'Adding...' : 'Add Payment Method'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">
            Your payment information is securely processed by Stripe. We do not store your card details.
          </p>
        </form>
      </CardContent>
    </Card>
  )
}

interface AddPaymentMethodProps {
  userId: string
  onSuccess: () => void
  onCancel: () => void
}

export default function AddPaymentMethod({ userId, onSuccess, onCancel }: AddPaymentMethodProps) {
  return (
    <Elements stripe={stripePromise}>
      <AddPaymentMethodForm userId={userId} onSuccess={onSuccess} onCancel={onCancel} />
    </Elements>
  )
}