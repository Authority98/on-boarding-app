import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Users, CheckCircle, Clock, TrendingUp, Plus, Crown } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Agency Dashboard</h1>
          <p className="text-gray-600">Manage your agency, employees, clients, and onboarding workflows</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Client
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Clients</p>
                <p className="text-2xl font-bold">2</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold">0</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg Tasks/Client</p>
                <p className="text-2xl font-bold">1</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Client Success</p>
                <p className="text-2xl font-bold">0%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Clients */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Clients</CardTitle>
            <Link href="/dashboard/clients" className="text-sm text-blue-600 hover:text-blue-700">
              View All
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>JS</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">John Smith</p>
                  <p className="text-sm text-gray-600">Tech Startup Inc</p>
                  <p className="text-xs text-gray-500">Added 8/2/2025</p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                active
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>SJ</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">Sarah Johnson</p>
                  <p className="text-sm text-gray-600">Design Co</p>
                  <p className="text-xs text-gray-500">Added 7/26/2025</p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                active
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>MW</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">Mike Wilson</p>
                  <p className="text-sm text-gray-600">Wilson Consulting</p>
                  <p className="text-xs text-gray-500">Added 7/19/2025</p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                inactive
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Current Employees */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Current Employees</CardTitle>
            <Link href="/dashboard/settings" className="text-sm text-blue-600 hover:text-blue-700">
              Manage Team
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>DU</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium flex items-center gap-2">
                    Demo User
                    <Crown className="w-4 h-4 text-yellow-500" />
                  </p>
                  <p className="text-sm text-gray-600">dasdasd@dsad.com</p>
                  <p className="text-xs text-gray-500">Owner</p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Owner
              </Badge>
            </div>

            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-5 h-5 text-yellow-600" />
                <p className="font-medium text-yellow-800">Free Plan - 1 Employee</p>
              </div>
              <p className="text-sm text-yellow-700 mb-3">Upgrade to add more team members</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
