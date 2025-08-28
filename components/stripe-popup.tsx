'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { LoadingButton } from '@/components/ui/loading-button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CreditCard, X, Plus, AlertCircle, CheckCircle } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'

interface PaymentMethod {
  id: string
  brand: string
  last4: string
  expMonth: number
  expYear: number
  funding: string
  created: number
}

interface StripePopupProps {
  isOpen: boolean
  onClose: () => void
  planName: string
  priceId: string
  price: string
}

export function StripePopup({ isOpen, onClose, planName, priceId, price }: StripePopupProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null)
  const [showSavedCards, setShowSavedCards] = useState(false)
  const [paymentMethodsLoading, setPaymentMethodsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const { user, refreshSubscription } = useAuth()
  const router = useRouter()

  // Fetch saved payment methods when popup opens
  const fetchPaymentMethods = async () => {
    if (!user?.id) return
    
    setPaymentMethodsLoading(true)
    setError('')
    
    try {
      const response = await fetch(`/api/stripe/payment-methods?userId=${user.id}`)
      const data = await response.json()
      
      if (response.ok) {
        setPaymentMethods(data.paymentMethods || [])
        if (data.paymentMethods?.length > 0) {
          setShowSavedCards(true)
          setSelectedPaymentMethod(data.paymentMethods[0].id) // Select first card by default
        }
      } else {
        console.error('Failed to fetch payment methods:', data.error)
      }
    } catch (error) {
      console.error('Error fetching payment methods:', error)
    } finally {
      setPaymentMethodsLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen && user?.id) {
      fetchPaymentMethods()
    }
  }, [isOpen, user?.id])

  // Handle upgrade with saved payment method
  const handleUpgradeWithSavedCard = async () => {
    if (!user || !selectedPaymentMethod) {
      setError('Please select a payment method')
      return
    }

    setIsLoading(true)
    setError('')
    
    try {
      const response = await fetch('/api/stripe/upgrade-with-saved-card', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          userId: user.id,
          planName,
          paymentMethodId: selectedPaymentMethod,
        }),
      })

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      if (data.requiresAction) {
        // Handle 3D Secure or other authentication
        setError('Payment requires additional authentication. Please use the regular checkout flow.')
        return
      }

      if (data.success) {
        setSuccess(true)
        
        // Refresh subscription data immediately after successful upgrade
        try {
          console.log('🔄 StripePopup: Refreshing subscription after successful saved card upgrade')
          await refreshSubscription()
          
          // Set a flag to indicate recent upgrade for pricing plans component
          localStorage.setItem('recent_upgrade_plan', planName)
          
          // Wait a bit more to ensure subscription data is properly updated
          await new Promise(resolve => setTimeout(resolve, 1000))
        } catch (error) {
          console.error('Failed to refresh subscription:', error)
        }
        
        // Use Next.js router for session-preserving redirect
        setTimeout(() => {
          const planParam = encodeURIComponent(planName)
          router.push(`/upgrade-success?session_id=saved_card_upgrade&plan=${planParam}`)
        }, 2000)
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  // Handle regular Stripe Checkout (fallback)
  const handleCheckout = async () => {
    if (!user) {
      setError('Please sign in to continue')
      return
    }

    setIsLoading(true)
    setError('')
    
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          userId: user.id,
          planName,
        }),
      })

      const { url, error } = await response.json()

      if (error) {
        throw new Error(error)
      }

      if (url) {
        // Use router.push for better session handling, but for external Stripe URLs we still need window.location
        if (url.startsWith('http')) {
          window.location.href = url
        } else {
          router.push(url)
        }
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const getBrandColor = (brand: string) => {
    switch (brand?.toLowerCase()) {
      case 'visa':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      case 'mastercard':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      case 'amex':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'discover':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  if (!isOpen) return null

  if (success) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md mx-4 relative">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            
            <h3 className="text-xl font-bold mb-2">Upgrade Successful!</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              You've successfully upgraded to {planName}. Redirecting to dashboard...
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-lg mx-4 relative max-h-[80vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCard className="w-8 h-8 text-blue-600" />
          </div>
          
          <h3 className="text-xl font-bold mb-2">Subscribe to {planName}</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-2">
            You're about to subscribe to the {planName} plan
          </p>
          <p className="text-2xl font-bold text-blue-600 mb-4">{price}</p>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 mb-4">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {paymentMethodsLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Loading payment methods...</p>
          </div>
        ) : showSavedCards && paymentMethods.length > 0 ? (
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-3">Choose a payment method</h4>
              <div className="space-y-2">
                {paymentMethods.map((pm) => (
                  <Card 
                    key={pm.id} 
                    className={`cursor-pointer transition-colors ${
                      selectedPaymentMethod === pm.id ? 'ring-2 ring-blue-500 border-blue-500' : 'hover:border-blue-300'
                    }`}
                    onClick={() => setSelectedPaymentMethod(pm.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <CreditCard className="w-5 h-5 text-gray-400" />
                          <div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className={getBrandColor(pm.brand)}>
                                {pm.brand?.toUpperCase()}
                              </Badge>
                              <span className="font-medium">•••• {pm.last4}</span>
                            </div>
                            <div className="text-sm text-gray-500">
                              Expires {String(pm.expMonth).padStart(2, '0')}/{pm.expYear}
                            </div>
                          </div>
                        </div>
                        {selectedPaymentMethod === pm.id && (
                          <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            
            <div className="flex gap-3">
              <LoadingButton
                onClick={handleUpgradeWithSavedCard}
                loading={isLoading}
                disabled={!selectedPaymentMethod}
                className="flex-1"
              >
                Subscribe Now
              </LoadingButton>
              
              <Button 
                onClick={() => setShowSavedCards(false)}
                variant="outline"
                disabled={isLoading}
              >
                <Plus className="w-4 h-4 mr-2" />
                New Card
              </Button>
            </div>
            
            <Button 
              onClick={onClose}
              variant="ghost"
              className="w-full"
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {paymentMethods.length > 0 && (
              <Button
                onClick={() => setShowSavedCards(true)}
                variant="outline"
                className="w-full mb-3"
                disabled={isLoading}
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Use Saved Payment Method
              </Button>
            )}
            
            <LoadingButton
              onClick={handleCheckout}
              loading={isLoading}
              className="w-full"
            >
              Continue to Payment
            </LoadingButton>
            
            <Button 
              onClick={onClose}
              variant="outline"
              className="w-full"
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}