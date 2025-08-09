import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThemeToggle } from "@/components/theme-toggle"
import { CheckCircle, Clock, Users, BarChart3, MessageSquare, FileText, Star, ArrowRight, Calendar } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-lg">PlankPort</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-muted-foreground hover:text-foreground">Home</Link>
            <Link href="/pricing" className="text-muted-foreground hover:text-foreground">Pricing</Link>
            <Link href="/about" className="text-muted-foreground hover:text-foreground">About</Link>
          </nav>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/signin" className="text-muted-foreground hover:text-foreground">Sign in</Link>
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
            Streamline Your <span className="text-primary">Client Onboarding</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
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
          <p className="text-sm text-muted-foreground">
            Free forever • No credit card required • Setup in 5 minutes
          </p>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto max-w-5xl">
          <Card className="shadow-2xl">
            <CardContent className="p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-2">Welcome back, Sarah!</h2>
                <p className="text-muted-foreground">Complete your onboarding tasks to get started</p>
              </div>
              
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Overall Progress</span>
                  <span className="text-sm text-muted-foreground">2 of 4 completed</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: '50%' }}></div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div className="flex-1">
                      <h3 className="font-medium">Create Facebook Business Account</h3>
                      <p className="text-sm text-muted-foreground">Set up your Facebook Business Manager</p>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">Completed</Badge>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div className="flex-1">
                      <h3 className="font-medium">Upload Brand Assets</h3>
                      <p className="text-sm text-muted-foreground">Provide logo and brand materials</p>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">Completed</Badge>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <div className="flex-1">
                      <h3 className="font-medium">Record Introduction Video</h3>
                      <p className="text-sm text-muted-foreground">Create a 2-minute intro video</p>
                    </div>
                    <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">In Progress</Badge>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg border border-border">
                    <Clock className="w-5 h-5 text-muted-foreground" />
                    <div className="flex-1">
                      <h3 className="font-medium">Set up Google Ads Account</h3>
                      <p className="text-sm text-muted-foreground">Create your Google Ads account</p>
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
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From initial contact to campaign launch, PlankPort handles every step of your client 
              onboarding process.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Client Portal</h3>
              <p className="text-muted-foreground">
                Give each client their own secure dashboard to track progress and complete 
                tasks.
              </p>
            </Card>

            <Card className="p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Task Management</h3>
              <p className="text-muted-foreground">
                Create custom onboarding workflows with account creation, file uploads, and manual 
                tasks.
              </p>
            </Card>

            <Card className="p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Progress Tracking</h3>
              <p className="text-muted-foreground">
                Real-time visibility into client progress with visual indicators and status updates.
              </p>
            </Card>

            <Card className="p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <MessageSquare className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Communication</h3>
              <p className="text-muted-foreground">
                Built-in messaging system for seamless client-agency communication.
              </p>
            </Card>

            <Card className="p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Templates</h3>
              <p className="text-muted-foreground">
                Build reusable onboarding templates and assign them to new clients instantly.
              </p>
            </Card>

            <Card className="p-6">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Analytics</h3>
              <p className="text-muted-foreground">
                Track completion rates, identify bottlenecks, and optimize your onboarding 
                process.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Trusted by 500+ marketing agencies</h2>
            <p className="text-xl text-muted-foreground">
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
                  <p className="text-sm text-muted-foreground">Digital Growth Agency</p>
                </div>
              </div>
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-muted-foreground">
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
                  <p className="text-sm text-muted-foreground">Performance Marketing Co</p>
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
                  <p className="text-sm text-muted-foreground">Creative Services Agency</p>
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
      <section className="py-20 px-4 bg-primary text-primary-foreground">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-primary-foreground/70">Agencies Trust Us</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">10,000+</div>
              <div className="text-primary-foreground/70">Businesses Onboarded</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">60%</div>
              <div className="text-primary-foreground/70">Faster Onboarding</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">95%</div>
              <div className="text-primary-foreground/70">Client Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to transform your client onboarding?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            PlankPort started when our founders, Alex and Sarah, were running their own marketing 
            agency. Help us transform how agencies onboard clients. Start with PlankPort today.
          </p>
          <Button size="lg" className="px-8" asChild>
            <Link href="/signup">
              Get Started <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            Free forever • No setup fees • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-gray-950 text-white py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="font-semibold text-lg">PlankPort</span>
              </div>
              <p className="text-gray-400 dark:text-gray-500 mb-4">
                Streamline your agency's client onboarding with professional workflows.
              </p>
              <div className="flex gap-4">
                <Link href="#" className="text-gray-400 dark:text-gray-500 hover:text-white">Twitter</Link>
                <Link href="#" className="text-gray-400 dark:text-gray-500 hover:text-white">LinkedIn</Link>
                <Link href="#" className="text-gray-400 dark:text-gray-500 hover:text-white">GitHub</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <div className="space-y-2">
                <Link href="#" className="block text-gray-400 dark:text-gray-500 hover:text-white">Features</Link>
                <Link href="/pricing" className="block text-gray-400 dark:text-gray-500 hover:text-white">Pricing</Link>
                <Link href="#" className="block text-gray-400 dark:text-gray-500 hover:text-white">Integrations</Link>
                <Link href="#" className="block text-gray-400 dark:text-gray-500 hover:text-white">API</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <div className="space-y-2">
                <Link href="#" className="block text-gray-400 dark:text-gray-500 hover:text-white">Help Center</Link>
                <Link href="#" className="block text-gray-400 dark:text-gray-500 hover:text-white">Contact Us</Link>
                <Link href="#" className="block text-gray-400 dark:text-gray-500 hover:text-white">Status</Link>
                <Link href="#" className="block text-gray-400 dark:text-gray-500 hover:text-white">Community</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <div className="space-y-2">
                <Link href="#" className="block text-gray-400 dark:text-gray-500 hover:text-white">Privacy Policy</Link>
                <Link href="#" className="block text-gray-400 dark:text-gray-500 hover:text-white">Terms of Service</Link>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 dark:border-gray-700 mt-8 pt-8 text-center text-gray-400 dark:text-gray-500">
            <p>© 2025 PlankPort. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
