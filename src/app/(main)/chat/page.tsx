import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserRoundIcon, BrainCircuitIcon, ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import Link from "next/link";

interface ChatOption {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  href: string;
}

export default function ChatPage() {
  const chatOptions: ChatOption[] = [
    {
      id: "nutritionist",
      name: "Nutritionist Chat",
      description: "Chat with our nutrition expert for personalized advice",
      icon: <UserRoundIcon className="h-6 w-6" />,
      color: "bg-green-100 text-green-600",
      href: `/chat/nutritionist`,
    },
    {
      id: "ai",
      name: "AI Assistant",
      description: "Get instant answers from our AI health assistant",
      icon: <BrainCircuitIcon className="h-6 w-6" />,
      color: "bg-purple-100 text-purple-600",
      href: `/chat/ai`,
    },
  ];

  return (
    <div className="py-6 font-sans">
      <div className="flex items-center mb-4">
        <Link href="/">
          <Button variant="ghost" size="icon" className="mr-2">
            <ArrowLeftIcon className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Health Chat</h1>
      </div>

      <div className="text-center mb-6">
        <p className="text-gray-500 mt-1">Choose your chat experience</p>
      </div>

      <div className="space-y-4">
        {chatOptions.map((option) => (
          <Link key={option.id} href={option.href} className="block">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center">
                  <div className={`p-3 rounded-full mr-4 ${option.color}`}>{option.icon}</div>
                  <div className="flex-grow">
                    <h3 className="font-medium">{option.name}</h3>
                    <p className="text-sm text-gray-500">{option.description}</p>
                  </div>
                  <ArrowRightIcon className="h-5 w-5 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
