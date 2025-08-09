"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { User, Building, CreditCard, Bell, Shield } from "lucide-react"

const settingsNavigation = [
  { name: "Profile", icon: User, id: "profile" },
  { name: "Agency", icon: Building, id: "agency" },
  { name: "Billing", icon: CreditCard, id: "billing" },
  { name: "Notifications", icon: Bell, id: "notifications" },
  { name: "Security", icon: Shield, id: "security" },
]

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("notifications")

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your account, agency, and subscription settings</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <Card className="lg:col-span-1">
          <CardContent className="p-4">
            <nav className="space-y-1">
              {settingsNavigation.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeSection === item.id
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </button>
              ))}
            </nav>
          </CardContent>
        </Card>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          {activeSection === "notifications" && (
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-medium mb-4">Email Notifications</h3>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Checkbox id="new-task" defaultChecked />
                      <div className="grid gap-1.5 leading-none">
                        <label htmlFor="new-task" className="text-sm font-medium">
                          New task assigned
                        </label>
                        <p className="text-sm text-gray-600">Get notified when a new task is assigned to you</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Checkbox id="task-completed" defaultChecked />
                      <div className="grid gap-1.5 leading-none">
                        <label htmlFor="task-completed" className="text-sm font-medium">
                          Task completed
                        </label>
                        <p className="text-sm text-gray-600">Get notified when a client completes a task</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Checkbox id="task-overdue" defaultChecked />
                      <div className="grid gap-1.5 leading-none">
                        <label htmlFor="task-overdue" className="text-sm font-medium">
                          Task overdue
                        </label>
                        <p className="text-sm text-gray-600">Get notified when tasks become overdue</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Checkbox id="new-messages" defaultChecked />
                      <div className="grid gap-1.5 leading-none">
                        <label htmlFor="new-messages" className="text-sm font-medium">
                          New messages
                        </label>
                        <p className="text-sm text-gray-600">Get notified when you receive new messages</p>
                      </div>
                    </div>
                  </div>
                </div>
                <Button>Save Preferences</Button>
              </CardContent>
            </Card>
          )}

          {activeSection === "profile" && (
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarFallback>DU</AvatarFallback>
                  </Avatar>
                  <div>
                    <Button variant="outline" size="sm">
                      Change Avatar
                    </Button>
                    <p className="text-sm text-gray-600 mt-1">JPG, PNG or GIF. Max size 2MB.</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <Input defaultValue="Demo User" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <Input defaultValue="dasdasd@dsad.com" disabled />
                    <p className="text-sm text-gray-600 mt-1">Contact support to change your email address</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <Input placeholder="+1 (555) 123-4567" />
                </div>

                <Button>Save Changes</Button>
              </CardContent>
            </Card>
          )}

          {activeSection === "security" && (
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-medium mb-4">Password</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                      <Input type="password" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                      <Input type="password" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                      <Input type="password" />
                    </div>
                    <Button>Update Password</Button>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="font-medium mb-2">Two-Factor Authentication</h3>
                  <p className="text-sm text-gray-600 mb-4">Secure your account with 2FA</p>
                  <p className="text-sm text-gray-600 mb-4">Add an extra layer of security to your account</p>
                  <Button variant="outline">Enable 2FA</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeSection === "agency" && (
            <Card>
              <CardHeader>
                <CardTitle>Agency Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Agency Name</label>
                    <Input placeholder="Your Agency Name" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                    <Input placeholder="https://youragency.com" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <Input placeholder="+1 (555) 123-4567" />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-600 rounded border"></div>
                      <Input defaultValue="#3B82F6" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Color</label>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-800 rounded border"></div>
                      <Input defaultValue="#1F2937" />
                    </div>
                  </div>
                </div>

                <Button>Save Changes</Button>
              </CardContent>
            </Card>
          )}

          {activeSection === "billing" && (
            <Card>
              <CardHeader>
                <CardTitle>Billing & Subscription</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="font-medium text-blue-900 mb-2">Free Plan</h3>
                  <p className="text-sm text-blue-800 mb-3">You're currently on the Free plan</p>
                  <div className="space-y-1 text-sm text-blue-800">
                    <p>• Up to 3 clients</p>
                    <p>• Basic task management</p>
                    <p>• Email support</p>
                  </div>
                  <Button className="mt-4" size="sm">
                    Upgrade Plan
                  </Button>
                </div>

                <div>
                  <h3 className="font-medium mb-4">Payment Method</h3>
                  <p className="text-sm text-gray-600 mb-4">No payment method on file</p>
                  <Button variant="outline">Add Payment Method</Button>
                </div>

                <div>
                  <h3 className="font-medium mb-4">Billing History</h3>
                  <p className="text-sm text-gray-600">No billing history available</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
