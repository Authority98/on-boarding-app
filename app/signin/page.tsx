import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar, ArrowLeft, Eye } from "lucide-react"

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex items-center justify-center gap-2 text-blue-600 hover:text-blue-700 mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center">
            <Calendar className="w-8 h-8 text-white" />
          </div>
        </div>

        <h2 className="text-center text-3xl font-bold text-gray-900 mb-2">Sign in to PlankPort</h2>
        <p className="text-center text-gray-600 mb-8">Access your client onboarding dashboard</p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-sm rounded-lg sm:px-10">
          <form className="space-y-6">
            <div>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="Enter your email"
                className="h-12"
              />
            </div>

            <div>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="Enter your password"
                  className="h-12 pr-10"
                />
                <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <Eye className="h-4 w-4 text-gray-400" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" />
                <span className="text-sm text-gray-600">Remember me</span>
              </div>
              <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-500">
                Forgot your password?
              </Link>
            </div>

            <Button type="submit" className="w-full h-12 text-base">
              Sign in
            </Button>

            <div className="text-center">
              <span className="text-gray-600">Don't have an account? </span>
              <Link href="/signup" className="text-blue-600 hover:text-blue-500 font-medium">
                Sign up here
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
