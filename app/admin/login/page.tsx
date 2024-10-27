'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function AdminLogin() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const response = await signIn('credentials', {
      email: formData.get('email'),
      password: formData.get('password'),
      redirect: false,
    });

    if (response?.error) {
      toast({
        title: "Error",
        description: response.error,
        variant: "destructive",
      });
    } else {
      router.push('/admin/dashboard');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 text-gray-900">
      {/* Logo and Title Section */}
      <div className="mb-8 text-center">
        <div className="w-24 h-24 mb-4 mx-auto">
          <img 
            src="/csi_logo.png" 
            alt="CSI Logo" 
            className="w-full h-full object-contain"
          />
        </div>
        <h1 className="text-3xl font-bold text-[#2196f3] mb-1">Computer Society of India</h1>
        <p className="text-gray-600">Admin Portal</p>
      </div>

      {/* Login Form */}
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Administrator Login
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="email" className="text-gray-700 font-medium">
              Email Address
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              placeholder="admin@csi-india.org"
            />
          </div>
          <div>
            <Label htmlFor="password" className="text-gray-700 font-medium">
              Password
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
              placeholder="••••••••"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-[#2196f3] hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-gray-600">
        <p>Empowering the Future of Technology</p>
        <p className="text-sm mt-2">Est. 1955</p>
      </div>
    </div>
  );
};
