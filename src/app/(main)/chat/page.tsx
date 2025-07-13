"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Settings } from "lucide-react";
import Link from "next/link";

interface ChatOption {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  href: string;
}

export default function ChatPage() {
  const chatOptions: ChatOption[] = [
    {
      id: "nutritionist",
      name: "Chat with our nutritionist",
      description: "Our nutrition experts are waiting to help out",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="54" height="54" viewBox="0 0 44 44" fill="none">
          <path d="M7 12H17" stroke="#E1D5B9" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="3" y="3" width="18" height="18" rx="4" stroke="#E1D5B9" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M7 8H17" stroke="#E1D5B9" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M7 16H12" stroke="#E1D5B9" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      href: `/chat/nutritionist`,
    },
    {
      id: "ai",
      name: "Chat with Juicefast AI wellness expert",
      description: "Get instant answers from our AI assistant",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="54" height="54" viewBox="0 0 44 44" fill="none">
          <path
            d="M7 10.0001C7.395 9.51512 7.935 9.24012 8.5 9.24012C9.065 9.24012 9.59 9.51512 10 10.0001"
            stroke="#FE8E77"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M14 10.0001C14.395 9.51512 14.935 9.24012 15.5 9.24012C16.065 9.24012 16.59 9.51512 17 10.0001"
            stroke="#FE8E77"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M18.364 5.63604C21.8787 9.15076 21.8787 14.8492 18.364 18.3639C14.8493 21.8787 9.1508 21.8787 5.6361 18.3639C2.12138 14.8492 2.12138 9.15074 5.6361 5.63604C9.15082 2.12132 14.8493 2.12132 18.364 5.63604"
            stroke="#FE8E77"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M15.5 14.6885C15.5 14.6885 14.187 16.0005 12 16.0005C9.812 16.0005 8.5 14.6885 8.5 14.6885"
            stroke="#FE8E77"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      href: `/chat/ai`,
    },
  ];

  return (
    <div className="min-h-screen bg-[#FCFBF8] px-4 py-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold">Talk to us</h1>
        <button className="p-2">
          <Settings className="h-6 w-6 text-gray-400" />
        </button>
      </div>

      <div className="mb-10">
        <p className="text-lg text-gray-700">Choose your chat experience</p>
      </div>

      <div className="space-y-4 max-w-md mx-auto">
        {chatOptions.map((option) => (
          <Link key={option.id} href={option.href} className="block">
            <Card className="bg-white rounded-lg hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start">
                  <div>{option.icon}</div>
                  <div>
                    <h3 className="font-medium text-lg pb-4">{option.name}</h3>
                    <p className="text-gray-500">{option.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
