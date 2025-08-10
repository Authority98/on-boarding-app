"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Construction } from "lucide-react"

interface FeatureInProgressDialogProps {
  children: React.ReactNode
  featureName?: string
}

export function FeatureInProgressDialog({ children, featureName = "This feature" }: FeatureInProgressDialogProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Construction className="w-6 h-6 text-orange-500" />
            <DialogTitle>Feature In Progress</DialogTitle>
          </div>
          <DialogDescription>
            {featureName} is currently under development and will be available soon.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
            <p className="text-sm text-orange-800 dark:text-orange-200">
              We're working hard to bring you this feature. Stay tuned for updates!
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => setOpen(false)}>
            Got it
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}