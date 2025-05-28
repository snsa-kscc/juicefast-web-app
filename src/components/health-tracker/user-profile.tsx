"use client";

import { useState } from "react";
import { UserProfile as UserProfileType } from "@/types/health-metrics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User } from "lucide-react";
import { StandaloneReferral } from "./standalone-referral";

interface UserProfileProps {
  userId: string;
  profile: UserProfileType | null;
  onUpdateProfile: (profile: UserProfileType) => void;
}

export function UserProfile({ userId, profile, onUpdateProfile }: UserProfileProps) {
  const [isEditing, setIsEditing] = useState(!profile);
  const [height, setHeight] = useState(profile?.height || 170);
  const [weight, setWeight] = useState(profile?.weight || 70);
  const [age, setAge] = useState(profile?.age || 30);
  const [gender, setGender] = useState(profile?.gender || "");
  const [activityLevel, setActivityLevel] = useState<UserProfileType['activityLevel']>(
    profile?.activityLevel || "moderate"
  );
  
  const handleSaveProfile = () => {
    const updatedProfile: UserProfileType = {
      ...profile, // Preserve existing fields like referralCode
      height,
      weight,
      age,
      gender,
      activityLevel,
    };
    
    onUpdateProfile(updatedProfile);
    setIsEditing(false);
  };
  
  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-gray-500" />
            <span>User Profile</span>
            {!isEditing && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="ml-auto"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Height (cm)</label>
                  <Input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Weight (kg)</label>
                  <Input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(Number(e.target.value))}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Age</label>
                  <Input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Gender</label>
                  <Select value={gender} onValueChange={setGender}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                      <SelectItem value="not_specified">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Activity Level</label>
                <Select 
                  value={activityLevel || "moderate"} 
                  onValueChange={(value) => setActivityLevel(value as UserProfileType['activityLevel'])}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select activity level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedentary">Sedentary (little or no exercise)</SelectItem>
                    <SelectItem value="light">Light (light exercise 1-3 days/week)</SelectItem>
                    <SelectItem value="moderate">Moderate (moderate exercise 3-5 days/week)</SelectItem>
                    <SelectItem value="active">Active (hard exercise 6-7 days/week)</SelectItem>
                    <SelectItem value="very_active">Very Active (very hard exercise, physical job)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                variant="default" 
                className="w-full mt-2"
                onClick={handleSaveProfile}
              >
                Save Profile
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-xs text-gray-500 mb-1">Height</div>
                  <div className="font-medium">{profile?.height} cm</div>
                </div>
                
                {profile?.weight && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-xs text-gray-500 mb-1">Weight</div>
                    <div className="font-medium">{profile.weight} kg</div>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {profile?.age && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-xs text-gray-500 mb-1">Age</div>
                    <div className="font-medium">{profile.age} years</div>
                  </div>
                )}
                
                {profile?.gender && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-xs text-gray-500 mb-1">Gender</div>
                    <div className="font-medium">{profile.gender}</div>
                  </div>
                )}
              </div>
              
              {profile?.activityLevel && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="text-xs text-gray-500 mb-1">Activity Level</div>
                  <div className="font-medium">
                    {profile.activityLevel === "sedentary" && "Sedentary (little or no exercise)"}
                    {profile.activityLevel === "light" && "Light (light exercise 1-3 days/week)"}
                    {profile.activityLevel === "moderate" && "Moderate (moderate exercise 3-5 days/week)"}
                    {profile.activityLevel === "active" && "Active (hard exercise 6-7 days/week)"}
                    {profile.activityLevel === "very_active" && "Very Active (very hard exercise, physical job)"}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Add the Referral Section */}
      <StandaloneReferral userId={userId} />
    </>
  );
}
