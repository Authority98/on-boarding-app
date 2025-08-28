"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { User, Building, CreditCard, Bell, Shield, Mail, CheckCircle, AlertCircle } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { getPlanDisplayName, getPlanFeatures } from "@/lib/subscription"

// Helper function to get user initials
function getUserInitials(email: string): string {
  if (!email) return "U"
  const parts = email.split("@")[0].split(".")
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  return email[0].toUpperCase()
}

const settingsNavigation = [
  { name: "Profile", icon: User, id: "profile" },
  { name: "Agency", icon: Building, id: "agency" },
  { name: "Billing", icon: CreditCard, id: "billing" },
  { name: "Notifications", icon: Bell, id: "notifications" },
  { name: "Security", icon: Shield, id: "security" },
]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile")
  const { user, subscription, subscriptionLoading, updateEmail } = useAuth()
  
  // Email change state
  const [newEmail, setNewEmail] = useState("")
  const [emailLoading, setEmailLoading] = useState(false)
  const [emailError, setEmailError] = useState("")
  const [emailSuccess, setEmailSuccess] = useState(false)
  const [showEmailChange, setShowEmailChange] = useState(false)
  
  // Extract user information
  const userEmail = user?.email || ""
  const userName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User"
  const userInitials = getUserInitials(userEmail)

  // Handle email change
  const handleEmailChange = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newEmail || newEmail === userEmail) {
      setEmailError("Please enter a different email address")
      return
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(newEmail)) {
      setEmailError("Please enter a valid email address")
      return
    }

    setEmailLoading(true)
    setEmailError("")
    setEmailSuccess(false)

    const { error } = await updateEmail(newEmail)
    
    setEmailLoading(false)

    if (error) {
      setEmailError(error.message || "Failed to update email")
    } else {
      setEmailSuccess(true)
      setShowEmailChange(false)
      setNewEmail("")
    }
  }

  // Reset email change form
  const handleCancelEmailChange = () => {
    setShowEmailChange(false)
    setNewEmail("")
    setEmailError("")
    setEmailSuccess(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage your account, agency, and subscription settings</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <Card className="lg:col-span-1">
          <CardContent className="p-4">
            <nav className="space-y-1">
              {settingsNavigation.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === item.id
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
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
          {activeTab === "notifications" && (
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
                        <p className="text-sm text-muted-foreground">Get notified when a new task is assigned to you</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Checkbox id="task-completed" defaultChecked />
                      <div className="grid gap-1.5 leading-none">
                        <label htmlFor="task-completed" className="text-sm font-medium">
                          Task completed
                        </label>
                        <p className="text-sm text-muted-foreground">Get notified when a client completes a task</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Checkbox id="task-overdue" defaultChecked />
                      <div className="grid gap-1.5 leading-none">
                        <label htmlFor="task-overdue" className="text-sm font-medium">
                          Task overdue
                        </label>
                        <p className="text-sm text-muted-foreground">Get notified when tasks become overdue</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Checkbox id="new-messages" defaultChecked />
                      <div className="grid gap-1.5 leading-none">
                        <label htmlFor="new-messages" className="text-sm font-medium">
                          New messages
                        </label>
                        <p className="text-sm text-muted-foreground">Get notified when you receive new messages</p>
                      </div>
                    </div>
                  </div>
                </div>
                <Button>Save Preferences</Button>
              </CardContent>
            </Card>
          )}

          {activeTab === "profile" && (
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Success Message */}
                {emailSuccess && (
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <div>
                      <p className="text-green-800 dark:text-green-200 font-medium">Email updated successfully!</p>
                      <p className="text-green-700 dark:text-green-300 text-sm">Please check your new email for a confirmation link.</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Button variant="outline" size="sm">
                      Change Avatar
                    </Button>
                    <p className="text-sm text-muted-foreground mt-1">JPG, PNG or GIF. Max size 2MB.</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
                    <Input defaultValue={userName} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
                    {!showEmailChange ? (
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <Input value={userEmail} disabled className="flex-1" />
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setShowEmailChange(true)}
                            className="whitespace-nowrap"
                          >
                            <Mail className="w-4 h-4 mr-1" />
                            Change
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <form onSubmit={handleEmailChange} className="space-y-3">
                        <Input
                          type="email"
                          placeholder="Enter new email address"
                          value={newEmail}
                          onChange={(e) => {
                            setNewEmail(e.target.value)
                            setEmailError("")
                          }}
                          disabled={emailLoading}
                          className={emailError ? "border-red-500" : ""}
                        />
                        {emailError && (
                          <div className="flex items-center gap-2 text-red-600 text-sm">
                            <AlertCircle className="w-4 h-4" />
                            <span>{emailError}</span>
                          </div>
                        )}
                        <div className="flex gap-2">
                          <Button 
                            type="submit" 
                            size="sm" 
                            disabled={emailLoading || !newEmail}
                            className="flex-1"
                          >
                            {emailLoading ? "Updating..." : "Update Email"}
                          </Button>
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm"
                            onClick={handleCancelEmailChange}
                            disabled={emailLoading}
                          >
                            Cancel
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          You'll receive a confirmation email at your new address.
                        </p>
                      </form>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Phone Number</label>
                  <Input placeholder="+1 (555) 123-4567" defaultValue={user?.user_metadata?.phone || ""} />
                </div>

                <Button>Save Changes</Button>
              </CardContent>
            </Card>
          )}

          {activeTab === "security" && (
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-medium mb-4">Password</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Current Password</label>
                      <Input type="password" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">New Password</label>
                      <Input type="password" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Confirm New Password</label>
                      <Input type="password" />
                    </div>
                    <Button>Update Password</Button>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="font-medium mb-2">Two-Factor Authentication</h3>
                  <p className="text-sm text-muted-foreground mb-4">Secure your account with 2FA</p>
                  <p className="text-sm text-muted-foreground mb-4">Add an extra layer of security to your account</p>
                  <Button variant="outline">Enable 2FA</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "agency" && (
            <Card>
              <CardHeader>
                <CardTitle>Agency Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Agency Name</label>
                    <Input 
                      placeholder="Your Agency Name" 
                      defaultValue={user?.user_metadata?.agency_name || ""}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Website</label>
                    <Input 
                      placeholder="https://youragency.com" 
                      defaultValue={user?.user_metadata?.website || ""}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Agency Phone</label>
                  <Input 
                    placeholder="+1 (555) 123-4567" 
                    defaultValue={user?.user_metadata?.phone || ""}
                  />
                </div>



                <Button>Save Changes</Button>
              </CardContent>
            </Card>
          )}

          {activeTab === "billing" && (
            <Card>
              <CardHeader>
                <CardTitle>Billing & Subscription</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                  {subscriptionLoading ? (
                    <div className="animate-pulse">
                      <div className="h-4 bg-primary/20 rounded mb-2 w-24"></div>
                      <div className="h-3 bg-primary/20 rounded mb-3 w-48"></div>
                      <div className="space-y-2">
                        <div className="h-3 bg-primary/20 rounded w-32"></div>
                        <div className="h-3 bg-primary/20 rounded w-40"></div>
                        <div className="h-3 bg-primary/20 rounded w-28"></div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h3 className="font-medium text-primary mb-2">{getPlanDisplayName(subscription?.plan_name || null)}</h3>
                      <p className="text-sm text-primary/80 mb-3">
                        You're currently on the {getPlanDisplayName(subscription?.plan_name || null)}
                      </p>
                      <div className="space-y-1 text-sm text-primary/80">
                        {getPlanFeatures(subscription?.plan_name || null).map((feature, index) => (
                          <p key={index}>• {feature}</p>
                        ))}
                      </div>
                      {!subscription && (
                        <Button className="mt-4" size="sm" asChild>
                          <a href="/dashboard/upgrade">Upgrade Plan</a>
                        </Button>
                      )}
                    </>
                  )}
                </div>

                <div>
                  <h3 className="font-medium mb-4">Payment Method</h3>
                  <p className="text-sm text-muted-foreground mb-4">No payment method on file</p>
                  <Button variant="outline">Add Payment Method</Button>
                </div>

                <div>
                  <h3 className="font-medium mb-4">Billing History</h3>
                  <p className="text-sm text-muted-foreground">No billing history available</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
