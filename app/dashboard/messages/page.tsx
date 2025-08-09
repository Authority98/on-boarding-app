"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Search, Users } from "lucide-react"

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)

  const conversations = [
    {
      id: "1",
      name: "John Smith",
      task: "Create Facebook Business Account",
      message: "I need help with this task",
      time: "10:59:43 AM",
      unread: 2,
    },
    {
      id: "2",
      name: "Sarah Johnson",
      task: "Upload Brand Assets",
      message: "Files uploaded successfully",
      time: "9:59:43 AM",
      unread: 0,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Messages</h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 h-[600px]">
        {/* Conversations List */}
        <div className="lg:col-span-1 bg-card rounded-lg border border-border">
          <div className="p-4 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input placeholder="Search conversations..." className="pl-10" />
            </div>
          </div>

          <div className="divide-y divide-border">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`p-4 cursor-pointer hover:bg-muted/50 ${
                  selectedConversation === conversation.id ? "bg-primary/10 border-r-2 border-primary" : ""
                }`}
                onClick={() => setSelectedConversation(conversation.id)}
              >
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>
                      {conversation.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm">{conversation.name}</p>
                      {conversation.unread > 0 && (
                        <Badge variant="default" className="w-5 h-5 p-0 flex items-center justify-center text-xs">
                          {conversation.unread}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-primary font-medium">{conversation.task}</p>
                    <p className="text-sm text-muted-foreground truncate">{conversation.message}</p>
                    <p className="text-xs text-muted-foreground/70 mt-1">{conversation.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-2 bg-card rounded-lg border border-border">
          {selectedConversation ? (
            <div className="h-full flex flex-col">
              <div className="p-4 border-b border-border">
                <h3 className="font-medium">{conversations.find((c) => c.id === selectedConversation)?.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {conversations.find((c) => c.id === selectedConversation)?.task}
                </p>
              </div>
              <div className="flex-1 p-4">
                {/* Chat messages would go here */}
                <div className="text-center text-muted-foreground mt-20">
                  <p>Start messaging with your client</p>
                </div>
              </div>
              <div className="p-4 border-t border-border">
                <Input placeholder="Type a message..." />
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <Users className="w-16 h-16 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">Select a conversation</h3>
              <p className="text-muted-foreground">Choose a conversation from the list to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
