"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NutritionistChat } from "@/components/nutritionist/nutritionist-chat";
import { NutritionistAdmin } from "@/components/nutritionist/nutritionist-admin";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function NutritionistDemoPage() {
  const [selectedUserId, setSelectedUserId] = useState("user1");
  const [selectedNutritionistId, setSelectedNutritionistId] = useState("1");

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Nutritionist Messaging Demo</h1>
      
      <Tabs defaultValue="user" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="user">User View</TabsTrigger>
          <TabsTrigger value="nutritionist">Nutritionist View</TabsTrigger>
        </TabsList>
        
        <TabsContent value="user" className="mt-0">
          <Card className="mb-6">
            <CardHeader className="pb-3">
              <CardTitle>User Perspective</CardTitle>
              <CardDescription>
                Simulate a user chatting with a nutritionist
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Select User</label>
                <select 
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  className="w-full max-w-xs p-2 border rounded-md"
                >
                  <option value="user1">John Doe</option>
                  <option value="user2">Jane Smith</option>
                  <option value="user3">Alex Johnson</option>
                </select>
              </div>
            </CardContent>
          </Card>
          
          <div className="h-[calc(100vh-350px)]">
            <NutritionistChat userId={selectedUserId} />
          </div>
        </TabsContent>
        
        <TabsContent value="nutritionist" className="mt-0">
          <Card className="mb-6">
            <CardHeader className="pb-3">
              <CardTitle>Nutritionist Perspective</CardTitle>
              <CardDescription>
                Manage and respond to user messages as a nutritionist
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Select Nutritionist</label>
                <select 
                  value={selectedNutritionistId}
                  onChange={(e) => setSelectedNutritionistId(e.target.value)}
                  className="w-full max-w-xs p-2 border rounded-md"
                >
                  <option value="1">Dr. Sarah Juicefast</option>
                  <option value="2">John Juicefast</option>
                  <option value="3">Jane Juicefast</option>
                  <option value="4">Dr. Michael Green</option>
                  <option value="5">Emma Rodriguez</option>
                </select>
              </div>
            </CardContent>
          </Card>
          
          <div className="h-[calc(100vh-350px)]">
            <NutritionistAdmin nutritionistId={selectedNutritionistId} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
