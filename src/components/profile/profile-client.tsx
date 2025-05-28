"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserProfile } from "@/types/health-metrics";
import { saveUserProfile, generateAndSaveReferralCode } from "@/app/actions/health-actions";
import { UserIcon, RulerIcon, ScaleIcon, CalendarIcon, ActivityIcon, LogOutIcon, SettingsIcon, BellIcon, HeartIcon, BadgeIcon, Users } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { StandaloneReferral } from "@/components/health-tracker/standalone-referral";
import { toast } from "sonner";

interface ProfileClientProps {
  userId: string;
  user: {
    id: string;
    name?: string;
    email?: string;
    image?: string | null;
  } | null;
  initialProfile: UserProfile | null;
}

export function ProfileClient({ userId, user, initialProfile }: ProfileClientProps) {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(initialProfile);
  const [isEditing, setIsEditing] = useState(false);

  // Form state
  const [height, setHeight] = useState<number>(initialProfile?.height || 170);
  const [weight, setWeight] = useState<number | undefined>(initialProfile?.weight);
  const [age, setAge] = useState<number | undefined>(initialProfile?.age);
  const [gender, setGender] = useState<string | undefined>(initialProfile?.gender);
  const [activityLevel, setActivityLevel] = useState<"sedentary" | "light" | "moderate" | "active" | "very_active" | undefined>(initialProfile?.activityLevel);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingReferralCode, setIsGeneratingReferralCode] = useState(false);

  const handleSaveProfile = async () => {
    if (!userId) return;

    try {
      setIsLoading(true);

      const updatedProfile: UserProfile = {
        id: userId, // Include the userId as the profile id
        height,
        weight: weight || 0,
        age: age || 0,
        gender: gender || "",
        activityLevel: activityLevel || "moderate",
        // Preserve existing referral data if available
        referralCode: profile?.referralCode,
        referredBy: profile?.referredBy,
        referralCount: profile?.referralCount || 0,
        referrals: profile?.referrals || [],
      };

      // If no referral code exists, generate one
      if (!updatedProfile.referralCode && user?.name) {
        setIsGeneratingReferralCode(true);
        const code = await generateAndSaveReferralCode(userId, user.name);
        if (code) {
          updatedProfile.referralCode = code;
          toast.success("Generated your unique referral code!");
        }
        setIsGeneratingReferralCode(false);
      }

      // Save to database
      await saveUserProfile(updatedProfile);

      // Update local state
      setProfile(updatedProfile);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save profile:", error);
      toast.error("Failed to save profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      router.push("/login");
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Profile Card */}
        <div className="md:w-1/3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Your Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center space-y-4">
                <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden relative">
                  {user?.image ? (
                    <Image 
                      src={user.image} 
                      alt="Profile" 
                      fill 
                      sizes="96px"
                      className="object-cover" 
                      priority
                      unoptimized={false}
                    />
                  ) : (
                    <UserIcon className="h-12 w-12 text-primary" />
                  )}
                </div>
                <h2 className="text-xl font-semibold">{user?.name || (user?.email ? user.email.split("@")[0] : "Health Tracker User")}</h2>
                <div className="w-full space-y-2 mt-4">
                  <Button variant="outline" className="w-full flex justify-start" onClick={() => setIsEditing(true)}>
                    <SettingsIcon className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Button>

                  <Button variant="outline" className="w-full flex justify-start" onClick={() => router.push("/settings/notifications")}>
                    <BellIcon className="mr-2 h-4 w-4" />
                    Notifications
                  </Button>

                  <Button variant="outline" className="w-full flex justify-start" onClick={() => router.push("/settings/goals")}>
                    <BadgeIcon className="mr-2 h-4 w-4" />
                    Goals & Targets
                  </Button>

                  <Button variant="outline" className="w-full flex justify-start text-destructive" onClick={handleLogout}>
                    <LogOutIcon className="mr-2 h-4 w-4" />
                    Log Out
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Details */}
        <div className="md:w-2/3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">{isEditing ? "Edit Your Details" : "Your Details"}</CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="height">Height (cm)</Label>
                      <div className="flex items-center">
                        <RulerIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                        <Input id="height" type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))} />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="weight">Weight (kg)</Label>
                      <div className="flex items-center">
                        <ScaleIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="weight"
                          type="number"
                          value={weight || ""}
                          onChange={(e) => setWeight(e.target.value ? Number(e.target.value) : undefined)}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="age">Age</Label>
                      <div className="flex items-center">
                        <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                        <Input id="age" type="number" value={age || ""} onChange={(e) => setAge(e.target.value ? Number(e.target.value) : undefined)} />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Select value={gender} onValueChange={setGender}>
                        <SelectTrigger id="gender">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="activity">Activity Level</Label>
                      <div className="flex items-center">
                        <ActivityIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                        <Select value={activityLevel} onValueChange={(value) => setActivityLevel(value as any)}>
                          <SelectTrigger id="activity" className="flex-1">
                            <SelectValue placeholder="Select activity level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sedentary">Sedentary (little to no exercise)</SelectItem>
                            <SelectItem value="light">Light (exercise 1-3 days/week)</SelectItem>
                            <SelectItem value="moderate">Moderate (exercise 3-5 days/week)</SelectItem>
                            <SelectItem value="active">Active (exercise 6-7 days/week)</SelectItem>
                            <SelectItem value="very_active">Very Active (professional athlete level)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button variant="outline" onClick={() => setIsEditing(false)} disabled={isLoading}>
                      Cancel
                    </Button>
                    <Button onClick={handleSaveProfile} disabled={isLoading}>
                      {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                        <RulerIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Height</p>
                        <p className="font-medium">{profile?.height || "-"} cm</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                        <ScaleIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Weight</p>
                        <p className="font-medium">{profile?.weight || "-"} kg</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                        <CalendarIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Age</p>
                        <p className="font-medium">{profile?.age || "-"}</p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                        <UserIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Gender</p>
                        <p className="font-medium">{profile?.gender ? profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1) : "-"}</p>
                      </div>
                    </div>

                    <div className="flex items-center md:col-span-2">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                        <ActivityIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Activity Level</p>
                        <p className="font-medium">
                          {profile?.activityLevel
                            ? profile.activityLevel === "sedentary"
                              ? "Sedentary (little to no exercise)"
                              : profile.activityLevel === "light"
                              ? "Light (exercise 1-3 days/week)"
                              : profile.activityLevel === "moderate"
                              ? "Moderate (exercise 3-5 days/week)"
                              : profile.activityLevel === "active"
                              ? "Active (exercise 6-7 days/week)"
                              : "Very Active (professional athlete level)"
                            : "-"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button onClick={() => setIsEditing(true)}>Edit Details</Button>
                  </div>
                </div>
              )}

              {/* Health Metrics Summary */}
              <div className="mt-8 pt-6 border-t">
                <h3 className="text-lg font-medium mb-4">Health Metrics</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <HeartIcon className="h-5 w-5 mr-2 text-red-500" />
                          <h4 className="font-medium">BMI</h4>
                        </div>
                        <span className="text-lg font-bold">
                          {profile?.weight && profile?.height ? (profile.weight / Math.pow(profile.height / 100, 2)).toFixed(1) : "-"}
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <HeartIcon className="h-5 w-5 mr-2 text-red-500" />
                          <h4 className="font-medium">Daily Calories</h4>
                        </div>
                        <span className="text-lg font-bold">
                          {profile?.weight && profile?.height && profile?.age && profile?.gender && profile?.activityLevel
                            ? calculateDailyCalories(profile.weight, profile.height, profile.age, profile.gender, profile.activityLevel)
                            : "-"}
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <HeartIcon className="h-5 w-5 mr-2 text-red-500" />
                          <h4 className="font-medium">Water Goal</h4>
                        </div>
                        <span className="text-lg font-bold">{profile?.weight ? `${Math.round(profile.weight * 30)} ml` : "-"}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Referral Section */}
              <StandaloneReferral userId={userId} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Helper function to calculate daily calories
function calculateDailyCalories(weight: number, height: number, age: number, gender: string, activityLevel: string): string {
  // Calculate BMR using Mifflin-St Jeor Equation
  let bmr = 0;
  if (gender === "male") {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }

  // Apply activity multiplier
  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  };

  const multiplier = activityMultipliers[activityLevel as keyof typeof activityMultipliers] || 1.2;
  const calories = Math.round(bmr * multiplier);

  return `${calories} kcal`;
}
