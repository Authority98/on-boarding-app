"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Users, Send, MessageSquare, Clock, CheckCheck, Check } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { chatOperations, type ChatRoom, type ChatMessage } from "@/lib/chat-operations"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

export default function MessagesPage() {
  const { user } = useAuth()
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null)
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([])
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMessages, setIsLoadingMessages] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [unsubscribe, setUnsubscribe] = useState<(() => void) | null>(null)

  // Load chat rooms for the agency user
  useEffect(() => {
    if (user?.id) {
      loadChatRooms()
    }
  }, [user])

  // Set up real-time subscriptions for the selected room
  useEffect(() => {
    if (selectedRoomId) {
      loadMessages(selectedRoomId)
      
      // Set up real-time subscription
      const unsubscribeFn = chatOperations.subscribeToMessages(
        selectedRoomId,
        (message) => {
          setMessages(prev => {
            // Avoid duplicates
            if (prev.some(m => m.id === message.id)) {
              return prev.map(m => m.id === message.id ? message : m)
            }
            return [...prev, message]
          })
        },
        (error) => {
          console.error('Error in real-time subscription:', error)
        }
      )
      
      setUnsubscribe(() => unsubscribeFn)
      
      return () => {
        unsubscribeFn()
      }
    }
  }, [selectedRoomId])

  const loadChatRooms = async () => {
    if (!user?.id) return
    
    try {
      setIsLoading(true)
      const rooms = await chatOperations.getChatRoomsForAgency(user.id)
      setChatRooms(rooms)
    } catch (error) {
      console.error('Error loading chat rooms:', error)
      toast.error('Failed to load conversations')
    } finally {
      setIsLoading(false)
    }
  }

  const loadMessages = async (roomId: string) => {
    try {
      setIsLoadingMessages(true)
      const roomMessages = await chatOperations.getMessages(roomId)
      setMessages(roomMessages)
    } catch (error) {
      console.error('Error loading messages:', error)
      toast.error('Failed to load messages')
    } finally {
      setIsLoadingMessages(false)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedRoomId || !user?.id) return
    
    try {
      setIsSending(true)
      await chatOperations.sendMessage(
        selectedRoomId,
        'agency',
        user.id,
        'Support Team',
        newMessage.trim()
      )
      setNewMessage("")
    } catch (error) {
      console.error('Error sending message:', error)
      toast.error('Failed to send message')
    } finally {
      setIsSending(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2)
  }

  const selectedRoom = chatRooms.find(room => room.id === selectedRoomId)
  const filteredRooms = chatRooms.filter(room => 
    room.clients?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    room.clients?.company?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Messages</h1>
        </div>
        <div className="grid lg:grid-cols-3 gap-6 h-[600px]">
          <div className="lg:col-span-1 bg-card rounded-lg border border-border p-4">
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-muted rounded-full animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                    <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-2 bg-card rounded-lg border border-border flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="w-16 h-16 text-muted-foreground/50 mb-4 mx-auto" />
              <p className="text-muted-foreground">Loading conversations...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Messages</h1>
          <p className="text-muted-foreground">Communicate with your clients</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">
            {chatRooms.length} conversation{chatRooms.length !== 1 ? 's' : ''}
          </Badge>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 h-[600px]">
        {/* Conversations List */}
        <div className="lg:col-span-1 bg-card rounded-lg border border-border">
          <div className="p-4 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input 
                placeholder="Search conversations..." 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="divide-y divide-border max-h-[500px] overflow-y-auto">
            {filteredRooms.length === 0 ? (
              <div className="p-8 text-center">
                <MessageSquare className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
                <p className="text-muted-foreground">No conversations found</p>
                <p className="text-sm text-muted-foreground/70 mt-1">
                  Conversations will appear when clients message you
                </p>
              </div>
            ) : (
              filteredRooms.map((room) => (
                <div
                  key={room.id}
                  className={cn(
                    "p-4 cursor-pointer hover:bg-muted/50 transition-colors",
                    selectedRoomId === room.id && "bg-primary/10 border-r-2 border-primary"
                  )}
                  onClick={() => setSelectedRoomId(room.id)}
                >
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>
                        {getInitials(room.clients?.name || 'Client')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-sm truncate">
                          {room.clients?.name || 'Unknown Client'}
                        </p>
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-green-500 rounded-full" />
                        </div>
                      </div>
                      {room.clients?.company && (
                        <p className="text-xs text-muted-foreground">
                          {room.clients.company}
                        </p>
                      )}
                      <p className="text-sm text-primary font-medium">{room.title}</p>
                      <p className="text-xs text-muted-foreground/70 mt-1">
                        Last activity: {new Date(room.last_message_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-2 bg-card rounded-lg border border-border">
          {selectedRoom ? (
            <div className="h-full flex flex-col">
              {/* Chat Header */}
              <div className="p-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>
                      {getInitials(selectedRoom.clients?.name || 'Client')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{selectedRoom.clients?.name || 'Unknown Client'}</h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedRoom.clients?.company || selectedRoom.title}
                    </p>
                  </div>
                  <div className="ml-auto flex items-center gap-2">
                    <div className="flex items-center gap-1 text-xs text-green-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span>Active</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {isLoadingMessages ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50 animate-pulse" />
                      <p className="text-muted-foreground">Loading messages...</p>
                    </div>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-muted-foreground">No messages yet</p>
                      <p className="text-sm text-muted-foreground/70 mt-1">
                        Start the conversation by sending a message
                      </p>
                    </div>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={cn(
                        "flex gap-3",
                        message.sender_type === 'agency' ? "justify-end" : "justify-start"
                      )}
                    >
                      {message.sender_type === 'client' && (
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="text-xs">
                            {getInitials(message.sender_name)}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      
                      <div className={cn(
                        "max-w-[70%] space-y-1",
                        message.sender_type === 'agency' ? "items-end" : "items-start"
                      )}>
                        <div className={cn(
                          "rounded-lg px-3 py-2",
                          message.sender_type === 'agency'
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        )}>
                          <p className="text-sm">{message.message_text}</p>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>{formatTime(message.created_at)}</span>
                          {message.sender_type === 'agency' && (
                            <span className="ml-1">
                              {message.is_read ? (
                                <CheckCheck className="w-3 h-3 text-blue-500" />
                              ) : (
                                <Check className="w-3 h-3" />
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-border">
                <div className="flex gap-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={`Message ${selectedRoom.clients?.name || 'client'}...`}
                    disabled={isSending}
                    className="flex-1"
                  />
                  <Button 
                    onClick={sendMessage} 
                    disabled={isSending || !newMessage.trim()}
                    size="icon"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
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
