'use client'

import { Button } from '@/components/ui/button'
import { Building } from 'lucide-react'

interface StripePopupProps {
  isOpen: boolean
  onClose: () => void
}

export function StripePopup({ isOpen, onClose }: StripePopupProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md mx-4 text-center">
        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
          <Building className="w-8 h-8 text-blue-600" />
        </div>
        <h3 className="text-xl font-bold mb-2">Stripe Integration</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Our payment processing is currently in development. We'll notify you as soon as it's ready!
        </p>
        <Button 
          onClick={onClose}
          className="w-full cursor-pointer"
        >
          Got it
        </Button>
      </div>
    </div>
  )
}