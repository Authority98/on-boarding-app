import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CreditCard, Trash2, AlertCircle } from 'lucide-react'

interface PaymentMethod {
  id: string
  brand: string
  last4: string
  expMonth: number
  expYear: number
  funding: string
  created: number
}

interface SavedPaymentMethodsProps {
  paymentMethods: PaymentMethod[]
  onDelete: (paymentMethodId: string) => Promise<void>
  isLoading: boolean
}

const getBrandIcon = (brand: string) => {
  // You can extend this to include specific brand icons
  return <CreditCard className="w-4 h-4" />
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

export default function SavedPaymentMethods({ paymentMethods, onDelete, isLoading }: SavedPaymentMethodsProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (paymentMethodId: string) => {
    if (confirm('Are you sure you want to remove this payment method?')) {
      setDeletingId(paymentMethodId)
      try {
        await onDelete(paymentMethodId)
      } finally {
        setDeletingId(null)
      }
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-16 bg-muted rounded-lg"></div>
          </div>
        ))}
      </div>
    )
  }

  if (paymentMethods.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <CreditCard className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p>No saved payment methods</p>
        <p className="text-sm">Add a payment method to get started</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {paymentMethods.map((pm) => (
        <Card key={pm.id} className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getBrandIcon(pm.brand)}
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={getBrandColor(pm.brand)}>
                    {pm.brand?.toUpperCase()}
                  </Badge>
                  <span className="font-medium">•••• {pm.last4}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Expires {String(pm.expMonth).padStart(2, '0')}/{pm.expYear}
                  {pm.funding && (
                    <span className="ml-2">
                      • {pm.funding.charAt(0).toUpperCase() + pm.funding.slice(1)}
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(pm.id)}
              disabled={deletingId === pm.id}
              className="text-muted-foreground hover:text-red-600 dark:hover:text-red-400"
            >
              {deletingId === pm.id ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
            </Button>
          </div>
        </Card>
      ))}
    </div>
  )
}