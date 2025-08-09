import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Users, Lightbulb, Handshake, Award, ArrowRight } from 'lucide-react'

export default function AboutPage() {
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
            <Link href="/about" className="text-blue-600 font-medium">About</Link>
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
            We're on a mission to transform <span className="text-blue-600">agency-client relationships</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            PlankPort was born from the frustration of manual, chaotic client onboarding processes. 
            We believe every agency deserves professional, streamlined workflows that impress 
            clients and save time.
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  PlankPort started when our founders, Alex and Sarah, 
                  were running their own marketing agency. They were 
                  frustrated with the manual, error-prone process of 
                  onboarding new clients.
                </p>
                <p>
                  Spreadsheets, email chains, and forgotten tasks were 
                  eating countless hours of their team's time. They 
                  knew there had to be a better way.
                </p>
                <p>
                  After trying existing solutions and finding them 
                  lacking, they decided to build the onboarding 
                  platform they wished they had. PlankPort was born 
                  from real agency experience and real pain points.
                </p>
                <p>
                  Today, we're proud to help hundreds of agencies 
                  create professional, efficient onboarding experiences 
                  that strengthen client relationships from day one.
                </p>
              </div>
            </div>
            <div className="relative">
              <Image
                src="/images/team-photo.png"
                alt="Team working together"
                width={600}
                height={400}
                className="rounded-lg shadow-lg"
              />
              <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-lg shadow-lg">
                <div className="text-2xl font-bold text-blue-600">500+</div>
                <div className="text-sm text-gray-600">Agencies Trust Us</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Our Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These principles guide everything we do, from product development to customer 
              support.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Client-Focused</h3>
              <p className="text-gray-600">
                Everything we build is designed to improve the client experience and 
                strengthen agency-client relationships.
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Lightbulb className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Innovation</h3>
              <p className="text-gray-600">
                We continuously innovate to stay ahead of industry needs and 
                provide cutting-edge solutions.
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Handshake className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Partnership</h3>
              <p className="text-gray-600">
                We see ourselves as partners in your success, not just a software 
                vendor.
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Award className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Excellence</h3>
              <p className="text-gray-600">
                We maintain the highest standards in everything we do, from code 
                quality to customer support.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Meet Our Team */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-600">
              We're a passionate team of agency veterans, engineers, and customer success experts.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="p-6 text-center">
              <Avatar className="w-20 h-20 mx-auto mb-4">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>AT</AvatarFallback>
              </Avatar>
              <h3 className="text-xl font-semibold mb-1">Alex Thompson</h3>
              <p className="text-blue-600 font-medium mb-3">CEO & Co-Founder</p>
              <p className="text-sm text-gray-600">
                Former agency owner with 10+ years of experience scaling 
                marketing agencies. Built PlankPort to solve the onboarding 
                challenges.
              </p>
            </Card>

            <Card className="p-6 text-center">
              <Avatar className="w-20 h-20 mx-auto mb-4">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>SK</AvatarFallback>
              </Avatar>
              <h3 className="text-xl font-semibold mb-1">Sarah Kim</h3>
              <p className="text-blue-600 font-medium mb-3">CTO & Co-Founder</p>
              <p className="text-sm text-gray-600">
                Previously led engineering teams at top SaaS companies. 
                Passionate about building reliable, scalable solutions that 
                agencies can depend on.
              </p>
            </Card>

            <Card className="p-6 text-center">
              <Avatar className="w-20 h-20 mx-auto mb-4">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>MR</AvatarFallback>
              </Avatar>
              <h3 className="text-xl font-semibold mb-1">Marcus Rodriguez</h3>
              <p className="text-blue-600 font-medium mb-3">Head of Product</p>
              <p className="text-sm text-gray-600">
                Product leader with deep expertise in workflow automation and user 
                experience design. Ensures PlankPort stays intuitive and 
                powerful.
              </p>
            </Card>

            <Card className="p-6 text-center">
              <Avatar className="w-20 h-20 mx-auto mb-4">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>EC</AvatarFallback>
              </Avatar>
              <h3 className="text-xl font-semibold mb-1">Emily Chen</h3>
              <p className="text-blue-600 font-medium mb-3">Head of Customer Success</p>
              <p className="text-sm text-gray-600">
                Dedicated to helping agencies maximize their success with 
                PlankPort. Leads our customer success team with a focus on 
                results.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Journey */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Our Journey</h2>
            <p className="text-xl text-gray-600">
              From a small agency's pain point to a platform trusted by hundreds.
            </p>
          </div>

          <div className="space-y-8">
            <div className="flex gap-6">
              <div className="flex flex-col items-center">
                <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
                <div className="w-px h-16 bg-gray-300"></div>
              </div>
              <div>
                <div className="text-blue-600 font-semibold mb-1">2022</div>
                <h3 className="text-xl font-semibold mb-2">Company Founded</h3>
                <p className="text-gray-600">
                  Started by agency owners who experienced onboarding pain firsthand.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex flex-col items-center">
                <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
                <div className="w-px h-16 bg-gray-300"></div>
              </div>
              <div>
                <div className="text-blue-600 font-semibold mb-1">2023</div>
                <h3 className="text-xl font-semibold mb-2">First 100 Agencies</h3>
                <p className="text-gray-600">
                  Reached our first major milestone with agencies across 15 countries.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex flex-col items-center">
                <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
                <div className="w-px h-16 bg-gray-300"></div>
              </div>
              <div>
                <div className="text-blue-600 font-semibold mb-1">2024</div>
                <h3 className="text-xl font-semibold mb-2">Series A Funding</h3>
                <p className="text-gray-600">
                  Raised $5M to accelerate product development and team growth.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex flex-col items-center">
                <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
              </div>
              <div>
                <div className="text-blue-600 font-semibold mb-1">2024</div>
                <h3 className="text-xl font-semibold mb-2">500+ Agencies</h3>
                <p className="text-gray-600">
                  Now trusted by over 500 agencies managing 10,000+ client onboardings.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-blue-600 text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to join our mission?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            PlankPort started when our founders, Alex and Sarah, were running their own marketing 
            agency. Help us transform how agencies onboard clients. Start with PlankPort today.
          </p>
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
