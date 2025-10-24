import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Send,
  Paperclip,
  Smile,
  Menu,
  Settings,
  Info,
  Shield,
  MoreVertical,
  Search,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Contact {
  id: string;
  name: string;
  avatar?: string;
  status: "online" | "offline" | "away";
  lastMessage: string;
  unread: number;
  timestamp: string;
}

interface Message {
  id: string;
  sender: "me" | "them";
  content: string;
  timestamp: string;
  encrypted: boolean;
}

const contacts: Contact[] = [
  {
    id: "1",
    name: "Alice Cooper",
    status: "online",
    lastMessage: "See you tomorrow!",
    unread: 2,
    timestamp: "2m ago",
  },
  {
    id: "2",
    name: "Bob Smith",
    status: "online",
    lastMessage: "Thanks for the update",
    unread: 0,
    timestamp: "1h ago",
  },
  {
    id: "3",
    name: "Carol White",
    status: "away",
    lastMessage: "I'll check that out",
    unread: 1,
    timestamp: "3h ago",
  },
];

const ChatPage = () => {
  const [selectedContact, setSelectedContact] = useState<Contact>(contacts[0]);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "them",
      content: "Hey! How are you?",
      timestamp: "10:30 AM",
      encrypted: true,
    },
    {
      id: "2",
      sender: "me",
      content: "I'm good! Just working on some stuff. You?",
      timestamp: "10:32 AM",
      encrypted: true,
    },
    {
      id: "3",
      sender: "them",
      content: "Same here. Want to grab lunch later?",
      timestamp: "10:33 AM",
      encrypted: true,
    },
    {
      id: "4",
      sender: "me",
      content: "Sure! That sounds great.",
      timestamp: "10:35 AM",
      encrypted: true,
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: "me",
      content: message,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      encrypted: true,
    };

    setMessages([...messages, newMessage]);
    setMessage("");

    // Simulate typing indicator
    setIsTyping(true);
    setTimeout(() => setIsTyping(false), 2000);
  };

  const getStatusColor = (status: Contact["status"]) => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "away":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-80" : "w-0"
        } bg-card border-r border-border transition-all duration-300 flex flex-col overflow-hidden`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Messages</h2>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/settings")}
                className="hover:bg-muted"
              >
                <Settings className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/about")}
                className="hover:bg-muted"
              >
                <Info className="w-5 h-5" />
              </Button>
            </div>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search contacts..."
              className="pl-10 bg-input border-border"
            />
          </div>
        </div>

        {/* Contacts List */}
        <div className="flex-1 overflow-y-auto">
          {contacts.map((contact) => (
            <button
              key={contact.id}
              onClick={() => setSelectedContact(contact)}
              className={`w-full p-4 flex items-start gap-3 hover:bg-muted/50 transition-colors border-b border-border ${
                selectedContact.id === contact.id ? "bg-muted" : ""
              }`}
            >
              <div className="relative">
                <Avatar>
                  <AvatarImage src={contact.avatar} />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground">
                    {contact.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-card ${getStatusColor(
                    contact.status
                  )}`}
                />
              </div>

              <div className="flex-1 text-left min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold truncate">{contact.name}</span>
                  <span className="text-xs text-muted-foreground">{contact.timestamp}</span>
                </div>
                <p className="text-sm text-muted-foreground truncate">{contact.lastMessage}</p>
              </div>

              {contact.unread > 0 && (
                <Badge className="bg-primary text-primary-foreground">{contact.unread}</Badge>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b border-border bg-card flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hover:bg-muted"
            >
              <Menu className="w-5 h-5" />
            </Button>
            
            <div className="relative">
              <Avatar>
                <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground">
                  {selectedContact.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div
                className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-card ${getStatusColor(
                  selectedContact.status
                )}`}
              />
            </div>

            <div>
              <h3 className="font-semibold">{selectedContact.name}</h3>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground capitalize">
                  {selectedContact.status}
                </span>
                {isTyping && (
                  <span className="text-xs text-primary flex items-center gap-1">
                    <span className="w-1 h-1 bg-primary rounded-full animate-typing"></span>
                    <span className="w-1 h-1 bg-primary rounded-full animate-typing" style={{ animationDelay: "0.2s" }}></span>
                    <span className="w-1 h-1 bg-primary rounded-full animate-typing" style={{ animationDelay: "0.4s" }}></span>
                    typing
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-primary/30 text-primary flex items-center gap-1">
              <Shield className="w-3 h-3" />
              Encrypted
            </Badge>
            <Button variant="ghost" size="icon" className="hover:bg-muted">
              <MoreVertical className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background/50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"} animate-fade-in`}
            >
              <div
                className={`max-w-[70%] ${
                  msg.sender === "me"
                    ? "bg-gradient-to-r from-primary to-accent text-primary-foreground"
                    : "bg-card border border-border"
                } rounded-2xl p-4 shadow-sm`}
              >
                <p className="text-sm">{msg.content}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs opacity-70">{msg.timestamp}</span>
                  {msg.encrypted && (
                    <Shield className="w-3 h-3 opacity-70" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-border bg-card">
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="hover:bg-muted"
            >
              <Paperclip className="w-5 h-5" />
            </Button>
            
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="hover:bg-muted"
            >
              <Smile className="w-5 h-5" />
            </Button>

            <Input
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 bg-input border-border"
            />

            <Button
              type="submit"
              className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground"
            >
              <Send className="w-5 h-5" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
