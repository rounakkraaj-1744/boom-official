"use client"
import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload } from "lucide-react"
import { authApi } from "../../app/api/auth"
import ErrorAlert from "@/components/ui/ErrorAlert"
import LoadingSpinner from "@/components/ui/LoadingSpinner"

export default function RegisterForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const userData = {
      username: formData.get("username") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    }

    try {
      const data = await authApi.register(userData)
      if (data.success) {
        localStorage.setItem("token", data.token);
        router.push("/feed");
      }
      else
        setError(data.message);
    }
    catch (error) {
      setError("Registration failed. Please check your connection and try again.");
    }
    finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Join Boom</CardTitle>
        <CardDescription>Create your account and start streaming</CardDescription>
      </CardHeader>
      <CardContent>
        <ErrorAlert error={error} />
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input id="username" name="username" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <LoadingSpinner />
                Creating Account...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Create Account
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}