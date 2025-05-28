"use client"
import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Play } from "lucide-react"
import { authApi } from "../../app/api/auth"
import ErrorAlert from "@/components/ui/ErrorAlert"
import LoadingSpinner from "@/components/ui/LoadingSpinner"
import { useAuth } from "@/hooks/useAuth"

export default function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const credentials = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    }

    try {
      const data = await authApi.login(credentials);
      if (data.success) {
        await login(data.token, data.user);
        router.push("/feed");
      }
      else
        setError(data.message)
    }
    catch (error) {
      setError("Login failed. Please check your connection and try again.")
    }
    finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome Back</CardTitle>
        <CardDescription>Sign in to your Boom account</CardDescription>
      </CardHeader>
      <CardContent>
        <ErrorAlert error={error} />
        <form onSubmit={handleSubmit} className="space-y-4">
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
                Signing In...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Sign In
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}