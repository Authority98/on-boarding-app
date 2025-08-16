"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Calendar } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ThemeToggle } from "@/components/theme-toggle"
import { useAuth } from "@/lib/auth-context"
import { PricingPlans } from "@/components/pricing-plans"

export default function PricingPage() {
  const { user, loading } = useAuth()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-lg">PlankPort</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-muted-foreground hover:text-foreground">
              Home
            </Link>
            <Link href="/pricing" className="text-blue-600 font-medium">
              Pricing
            </Link>
            <Link href="/about" className="text-muted-foreground hover:text-foreground">
              About
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            {loading ? (
              <div className="w-20 h-9 bg-muted animate-pulse rounded"></div>
            ) : user ? (
              <Button asChild>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <>
                <Link href="/signin" className="text-muted-foreground hover:text-foreground">
                  Sign in
                </Link>
                <Button asChild>
                  <Link href="/signup">Get Started</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>



      {/* Pricing Cards */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <PricingPlans showBillingToggle={false} />
          
          <div className="text-center mt-8">
            <p className="text-gray-600 mb-2">Need help choosing a plan?</p>
            <Button variant="link" className="text-blue-600">
              Contact our sales team
            </Button>
          </div>
        </div>
      </section>

      {/* Enterprise Section */}
      <section className="py-20 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4">Need something custom?</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Large agencies can get custom solutions with dedicated support and integrations.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div className="text-center">
              <h3 className="font-semibold mb-2">Custom Integrations</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Connect with your existing CRM, project management, and analytics tools.
              </p>
            </div>
            <div className="text-center">
              <h3 className="font-semibold mb-2">On-Premise Deployment</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Host PlankPort on your own infrastructure for maximum control.</p>
            </div>
            <div className="text-center">
              <h3 className="font-semibold mb-2">Dedicated Support</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">Get a dedicated customer success manager and priority support.</p>
            </div>
          </div>

          <Button size="lg">Contact Enterprise Sales</Button>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>

          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-left">Can I change plans at any time?</AccordionTrigger>
              <AccordionContent>
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately and billing is
                prorated.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger className="text-left">What happens when I exceed my employee limit?</AccordionTrigger>
              <AccordionContent>
                We'll notify you when you're approaching your employee limit. You can upgrade your plan or remove
                inactive employees to stay within your limit.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger className="text-left">Is there a setup fee?</AccordionTrigger>
              <AccordionContent>
                No setup fees ever. You only pay the monthly subscription fee for your chosen plan.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger className="text-left">Do you offer annual discounts?</AccordionTrigger>
              <AccordionContent>
                Yes! Save 20% when you pay annually. Contact our sales team for annual pricing details.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger className="text-left">What kind of support do you provide?</AccordionTrigger>
              <AccordionContent>
                Free plans get community support, Startup gets priority email support, and Agency gets dedicated phone
                support with SLA.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6">
              <AccordionTrigger className="text-left">Can I cancel anytime?</AccordionTrigger>
              <AccordionContent>
                Absolutely. Cancel anytime with no penalties. Your account remains active until the end of your billing
                period.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-blue-600 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to get started?</h2>
          <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8">
            Get Started
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <span className="font-semibold text-lg">PlankPort</span>
              </div>
              <p className="text-gray-400 mb-4">
                Streamline your agency's client onboarding with professional workflows.
              </p>
              <div className="flex gap-4">
                <Link href="#" className="text-gray-400 hover:text-white">
                  Twitter
                </Link>
                <Link href="#" className="text-gray-400 hover:text-white">
                  LinkedIn
                </Link>
                <Link href="#" className="text-gray-400 hover:text-white">
                  GitHub
                </Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <div className="space-y-2">
                <Link href="#" className="block text-gray-400 hover:text-white">
                  Features
                </Link>
                <Link href="/pricing" className="block text-gray-400 hover:text-white">
                  Pricing
                </Link>
                <Link href="#" className="block text-gray-400 hover:text-white">
                  Integrations
                </Link>
                <Link href="#" className="block text-gray-400 hover:text-white">
                  API
                </Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <div className="space-y-2">
                <Link href="#" className="block text-gray-400 hover:text-white">
                  Help Center
                </Link>
                <Link href="#" className="block text-gray-400 hover:text-white">
                  Contact Us
                </Link>
                <Link href="#" className="block text-gray-400 hover:text-white">
                  Status
                </Link>
                <Link href="#" className="block text-gray-400 hover:text-white">
                  Community
                </Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <div className="space-y-2">
                <Link href="#" className="block text-gray-400 hover:text-white">
                  Privacy Policy
                </Link>
                <Link href="#" className="block text-gray-400 hover:text-white">
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© 2025 PlankPort. All rights reserved.</p>
          </div>
        </div>
      </footer>


    </div>
  )
}
