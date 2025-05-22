"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserProfile } from "@/types/health-metrics";
import { loadUserProfile, saveUserProfile } from "@/lib/daily-tracking-store";
import { UserIcon, RulerIcon, ScaleIcon, CalendarIcon, ActivityIcon, LogOutIcon, SettingsIcon, BellIcon, HeartIcon, BadgeIcon } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form state
  const [height, setHeight] = useState<number>(170);
  const [weight, setWeight] = useState<number | undefined>(undefined);
  const [age, setAge] = useState<number | undefined>(undefined);
  const [gender, setGender] = useState<string | undefined>(undefined);
  const [activityLevel, setActivityLevel] = useState<"sedentary" | "light" | "moderate" | "active" | "very_active" | undefined>(undefined);

  // Load user profile on mount
  useEffect(() => {
    const userProfile = loadUserProfile();
    if (userProfile) {
      setProfile(userProfile);
      setHeight(userProfile.height);
      setWeight(userProfile.weight);
      setAge(userProfile.age);
      setGender(userProfile.gender);
      setActivityLevel(userProfile.activityLevel);
    }
  }, []);

  const handleSaveProfile = () => {
    const updatedProfile: UserProfile = {
      id: profile?.id || `user-${Date.now()}`,
      height,
      weight,
      age,
      gender,
      activityLevel,
      referralCode: profile?.referralCode || `REF${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      referredBy: profile?.referredBy,
      referralCount: profile?.referralCount || 0,
      referrals: profile?.referrals || [],
    };

    setProfile(updatedProfile);
    saveUserProfile(updatedProfile);
    setIsEditing(false);
  };

  const handleSignOut = () => {
    authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/"); // redirect to login page
        },
      },
    });
  };

  return (
    <div className="py-6 font-sans">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-primary/10 mb-4">
          <UserIcon className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-2xl font-bold">{profile?.id ? "Your Profile" : "Create Profile"}</h1>
        <p className="text-gray-500 mt-1">Manage your personal information</p>
      </div>

      {!isEditing ? (
        <>
          {/* Profile Summary Card */}
          <Card className="mb-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center">
                  <RulerIcon className="h-5 w-5 mr-3 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-500">Height</div>
                    <div className="font-medium">{profile?.height || "--"} cm</div>
                  </div>
                </div>

                <div className="flex items-center">
                  <ScaleIcon className="h-5 w-5 mr-3 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-500">Weight</div>
                    <div className="font-medium">{profile?.weight ? `${profile.weight} kg` : "--"}</div>
                  </div>
                </div>

                <div className="flex items-center">
                  <CalendarIcon className="h-5 w-5 mr-3 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-500">Age</div>
                    <div className="font-medium">{profile?.age || "--"}</div>
                  </div>
                </div>

                <div className="flex items-center">
                  <UserIcon className="h-5 w-5 mr-3 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-500">Gender</div>
                    <div className="font-medium">{profile?.gender || "--"}</div>
                  </div>
                </div>

                <div className="flex items-center">
                  <ActivityIcon className="h-5 w-5 mr-3 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-500">Activity Level</div>
                    <div className="font-medium">
                      {profile?.activityLevel
                        ? profile.activityLevel.replace("_", " ").charAt(0).toUpperCase() + profile.activityLevel.replace("_", " ").slice(1)
                        : "--"}
                    </div>
                  </div>
                </div>
              </div>

              <Button className="w-full mt-6" onClick={() => setIsEditing(true)}>
                Edit Profile
              </Button>
            </CardContent>
          </Card>

          {/* Referral Card */}
          <Card className="mb-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl flex items-center">
                <BadgeIcon className="h-5 w-5 mr-2 text-primary" />
                Referral Program
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-500 mb-1">Your Referral Code</div>
                  <div className="flex">
                    <div className="bg-primary/10 text-primary font-mono font-medium p-2 rounded-l-md flex-grow">
                      {profile?.referralCode || "Create profile to get code"}
                    </div>
                    <Button
                      variant="outline"
                      className="rounded-l-none"
                      disabled={!profile?.referralCode}
                      onClick={() => {
                        if (profile?.referralCode) {
                          navigator.clipboard.writeText(profile.referralCode);
                        }
                      }}
                    >
                      Copy
                    </Button>
                  </div>
                </div>

                <div>
                  <div className="text-sm text-gray-500 mb-1">Referrals</div>
                  <div className="font-medium">{profile?.referralCount || 0} friends joined</div>
                </div>

                <div className="bg-primary/10 p-3 rounded-md text-sm">
                  <p className="text-gray-700">Invite friends.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Links */}
          <div className="space-y-2">
            {/* <Button variant="outline" className="w-full justify-start">
              <SettingsIcon className="h-4 w-4 mr-2" />
              Settings
            </Button>

            <Button variant="outline" className="w-full justify-start">
              <BellIcon className="h-4 w-4 mr-2" />
              Notifications
            </Button>

            <Button variant="outline" className="w-full justify-start" onClick={() => router.push("/health-data")}>
              <HeartIcon className="h-4 w-4 mr-2" />
              Health Data
            </Button> */}

            <Button onClick={() => handleSignOut()} variant="outline" className="w-full justify-start text-red-500 hover:text-red-600">
              <LogOutIcon className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </>
      ) : (
        /* Edit Profile Form */
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Edit Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="height">Height (cm) *</Label>
                <Input id="height" type="number" value={height || ""} onChange={(e) => setHeight(parseInt(e.target.value) || 0)} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input id="weight" type="number" value={weight || ""} onChange={(e) => setWeight(parseInt(e.target.value) || undefined)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input id="age" type="number" value={age || ""} onChange={(e) => setAge(parseInt(e.target.value) || undefined)} />
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
                    <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="activity-level">Activity Level</Label>
                <Select value={activityLevel} onValueChange={(value: "sedentary" | "light" | "moderate" | "active" | "very_active") => setActivityLevel(value)}>
                  <SelectTrigger id="activity-level">
                    <SelectValue placeholder="Select activity level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedentary">Sedentary (little to no exercise)</SelectItem>
                    <SelectItem value="light">Light (1-3 days per week)</SelectItem>
                    <SelectItem value="moderate">Moderate (3-5 days per week)</SelectItem>
                    <SelectItem value="active">Active (6-7 days per week)</SelectItem>
                    <SelectItem value="very_active">Very Active (twice per day)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2 pt-4">
                <Button variant="outline" className="flex-1" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleSaveProfile}
                  disabled={!height} // Height is required
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
