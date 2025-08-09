import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CheckCircle, Clock, Users, BarChart3, MessageSquare, FileText, Star, ArrowRight, Calendar } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
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
            <Link href="/" className="text-gray-600 hover:text-gray-900">Home</Link>
            <Link href="/pricing" className="text-gray-600 hover:text-gray-900">Pricing</Link>
            <Link href="/about" className="text-gray-600 hover:text-gray-900">About</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/signin" className="text-gray-600 hover:text-gray-900">Sign in</Link>
            <Button asChild>
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Streamline Your <span className="text-blue-600">Client Onboarding</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Transform your agency's client onboarding with automated workflows, real-time 
            progress tracking, and professional client portals that impress from day one.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-4">
            <Button size="lg" className="px-8" asChild>
              <Link href="/signup">
                Get Started <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="px-8">
              Learn More
            </Button>
          </div>
          <p className="text-sm text-gray-500">
            Free forever • No credit card required • Setup in 5 minutes
          </p>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-5xl">
          <Card className="shadow-2xl">
            <CardContent className="p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-2">Welcome back, Sarah!</h2>
                <p className="text-gray-600">Complete your onboarding tasks to get started</p>
              </div>
              
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Overall Progress</span>
                  <span className="text-sm text-gray-600">2 of 4 completed</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '50%' }}></div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div className="flex-1">
                    <h3 className="font-medium">Create Facebook Business Account</h3>
                    <p className="text-sm text-gray-600">Set up your Facebook Business Manager</p>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">Completed</Badge>
                </div>

                <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div className="flex-1">
                    <h3 className="font-medium">Upload Brand Assets</h3>
                    <p className="text-sm text-gray-600">Provide logo and brand materials</p>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">Completed</Badge>
                </div>

                <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <div className="flex-1">
                    <h3 className="font-medium">Record Introduction Video</h3>
                    <p className="text-sm text-gray-600">Create a 2-minute intro video</p>
                  </div>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">In Progress</Badge>
                </div>

                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <div className="flex-1">
                    <h3 className="font-medium">Set up Google Ads Account</h3>
                    <p className="text-sm text-gray-600">Create your Google Ads account</p>
                  </div>
                  <Badge variant="secondary">Pending</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Everything you need to onboard clients professionally
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From initial contact to campaign launch, PlankPort handles every step of your client 
              onboarding process.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Client Portal</h3>
              <p className="text-gray-600">
                Give each client their own secure dashboard to track progress and complete 
                tasks.
              </p>
            </Card>

            <Card className="p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Task Management</h3>
              <p className="text-gray-600">
                Create custom onboarding workflows with account creation, file uploads, and manual 
                tasks.
              </p>
            </Card>

            <Card className="p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Progress Tracking</h3>
              <p className="text-gray-600">
                Real-time visibility into client progress with visual indicators and status updates.
              </p>
            </Card>

            <Card className="p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <MessageSquare className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Communication</h3>
              <p className="text-gray-600">
                Built-in messaging system for seamless client-agency communication.
              </p>
            </Card>

            <Card className="p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Templates</h3>
              <p className="text-gray-600">
                Build reusable onboarding templates and assign them to new clients instantly.
              </p>
            </Card>

            <Card className="p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Analytics</h3>
              <p className="text-gray-600">
                Track completion rates, identify bottlenecks, and optimize your onboarding 
                process.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Trusted by 500+ marketing agencies</h2>
            <p className="text-xl text-gray-600">
              See what agency owners are saying about PlankPort.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <Avatar>
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>SJ</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-semibold">Sarah Johnson</h4>
                  <p className="text-sm text-gray-600">Digital Growth Agency</p>
                </div>
              </div>
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-600">
                "PlankPort reduced our client onboarding time by 60%. Our clients love the 
                transparency and professional experience."
              </p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <Avatar>
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>MC</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-semibold">Mike Chen</h4>
                  <p className="text-sm text-gray-600">Performance Marketing Co</p>
                </div>
              </div>
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-600">
                "PlankPort reduced our client onboarding time by 60%. Our clients love the 
                transparency and professional experience."
              </p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <Avatar>
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>ER</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-semibold">Emily Rodriguez</h4>
                  <p className="text-sm text-gray-600">Creative Services Agency</p>
                </div>
              </div>
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-600">
                "PlankPort's template system is a game-changer. We can onboard new clients in 
                minutes instead of hours."
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-blue-600 text-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-blue-100">Agencies Trust Us</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">10,000+</div>
              <div className="text-blue-100">Businesses Onboarded</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">60%</div>
              <div className="text-blue-100">Faster Onboarding</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">95%</div>
              <div className="text-blue-100">Client Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to transform your client onboarding?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            PlankPort started when our founders, Alex and Sarah, were running their own marketing 
            agency. Help us transform how agencies onboard clients. Start with PlankPort today.
          </p>
          <Button size="lg" className="px-8" asChild>
            <Link href="/signup">
              Get Started <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
          <p className="text-sm text-gray-500 mt-4">
            Free forever • No setup fees • Cancel anytime
          </p>
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
                <Link href="#" className="text-gray-400 hover:text-white">Twitter</Link>
                <Link href="#" className="text-gray-400 hover:text-white">LinkedIn</Link>
                <Link href="#" className="text-gray-400 hover:text-white">GitHub</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <div className="space-y-2">
                <Link href="#" className="block text-gray-400 hover:text-white">Features</Link>
                <Link href="/pricing" className="block text-gray-400 hover:text-white">Pricing</Link>
                <Link href="#" className="block text-gray-400 hover:text-white">Integrations</Link>
                <Link href="#" className="block text-gray-400 hover:text-white">API</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <div className="space-y-2">
                <Link href="#" className="block text-gray-400 hover:text-white">Help Center</Link>
                <Link href="#" className="block text-gray-400 hover:text-white">Contact Us</Link>
                <Link href="#" className="block text-gray-400 hover:text-white">Status</Link>
                <Link href="#" className="block text-gray-400 hover:text-white">Community</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <div className="space-y-2">
                <Link href="#" className="block text-gray-400 hover:text-white">Privacy Policy</Link>
                <Link href="#" className="block text-gray-400 hover:text-white">Terms of Service</Link>
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
