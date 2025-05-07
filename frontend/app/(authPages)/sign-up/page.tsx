'use client';

import type React from 'react';

import { useState } from 'react';
import { Disc3, ArrowLeft, Loader2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { REGEXP_ONLY_DIGITS_AND_CHARS } from 'input-otp';
import { register, verifyEmail, login } from '@/services/authService';
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
  const router = useRouter();

  const [signupStep, setSignupStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Form states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState<string[]>([]);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await register({
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
      });

      if (response.code !== 201) {
        throw new Error(response.message || 'Registration failed');
      }

      toast('Verification email sent', {
        description: 'Please check your inbox for the verification code.',
      });

      toast('Verification email sent', {
        description: 'Please check your inbox for the verification code.',
      });

      setSignupStep(2);
    } catch (error) {
      toast.error('Registration failed', {
        description:
          error instanceof Error ? error.message : 'Please try again later',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const code = Number(verificationCode.join(''));

    try {
      const response = await verifyEmail({
        email,
        code,
      });

      if (response.code !== 201) {
        throw new Error(response.message || 'Verification failed');
      }

      toast('Email verified', {
        description: 'Your account has been successfully created.',
      });

      localStorage.setItem('token', response.data.token);
      router.replace('/user/me');
    } catch (error) {
      toast.error('Verification failed', {
        description:
          error instanceof Error
            ? error.message
            : 'Please check your code and try again',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await login({
        email: loginEmail,
        password: loginPassword,
      });

      if (response.code !== 201) {
        throw new Error(response.message || 'Login failed');
      }

      toast('Login successful', {
        description: 'Welcome back to SoundSphere!',
      });

      localStorage.setItem('token', response.data.token);
      router.push('/user/me');
    } catch (error) {
      toast.error('Login failed', {
        description:
          error instanceof Error ? error.message : 'Invalid email or password',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToSignup = () => {
    setSignupStep(1);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-blue-100">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-4 items-center text-center">
          <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white">
            <Disc3 className="h-6 w-6" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">SoundSphere</h2>
            <p className="text-muted-foreground">
              Your destination for premium vinyl records and music collectibles.
            </p>
          </div>
        </CardHeader>
        <CardContent>
          {signupStep === 2 ? (
            <div className="space-y-6">
              <button
                onClick={handleBackToSignup}
                className="flex items-center text-blue-600 hover:text-blue-800 mb-2"
                disabled={isLoading}
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                <span className="text-sm">Back</span>
              </button>

              <div className="text-center space-y-2">
                <h3 className="text-lg font-medium">Verify your email</h3>
                <p className="text-sm text-muted-foreground">
                  We sent a verification code to{' '}
                  <span className="font-medium">{email}</span>. To continue,
                  please enter it below.
                </p>
              </div>

              <form onSubmit={handleVerifyEmail}>
                <div className="flex justify-center gap-2 mb-4">
                  <InputOTP
                    maxLength={6}
                    pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
                    value={verificationCode.join('')}
                    onChange={(value) => setVerificationCode(value.split(''))}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={
                    isLoading || verificationCode.some((digit) => !digit)
                  }
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    'Verify Email'
                  )}
                </Button>
              </form>

              <p className="text-center text-sm text-muted-foreground">
                Didn`t receive a code?{' '}
                <a href="#" className="text-blue-600 hover:underline">
                  Resend
                </a>
              </p>
            </div>
          ) : (
            <Tabs defaultValue="signup" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
                <TabsTrigger value="login">Login</TabsTrigger>
              </TabsList>
              <TabsContent value="signup" className="space-y-4">
                <form onSubmit={handleCreateAccount} className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Input
                        type="text"
                        placeholder="First Name"
                        className="w-full"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        disabled={isLoading}
                        required
                      />
                    </div>
                    <div>
                      <Input
                        type="text"
                        placeholder="Last Name"
                        className="w-full"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        disabled={isLoading}
                        required
                      />
                    </div>
                  </div>
                  <Input
                    type="email"
                    placeholder="Email Address"
                    className="w-full"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Password"
                      className="w-full pr-10"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                      required
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  <div className="relative">
                    <Input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm Password"
                      className="w-full pr-10"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={isLoading}
                      required
                    />
                    <button
                      type="button"
                      onClick={toggleConfirmPasswordVisibility}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      'Create Account'
                    )}
                  </Button>
                </form>
              </TabsContent>
              <TabsContent value="login" className="space-y-4">
                <form onSubmit={handleLogin} className="space-y-2">
                  <Input
                    type="email"
                    placeholder="Email Address"
                    className="w-full"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    disabled={isLoading}
                    required
                  />
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Password"
                      className="w-full pr-10"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      disabled={isLoading}
                      required
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="remember"
                        className="rounded border-gray-300"
                        disabled={isLoading}
                      />
                      <label
                        htmlFor="remember"
                        className="text-sm text-gray-600"
                      >
                        Remember me
                      </label>
                    </div>
                    <a
                      href="#"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Forgot password?
                    </a>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing In...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 text-center text-sm">
          <div className="flex justify-center space-x-4">
            <a href="#" className="text-blue-600 hover:underline">
              Terms
            </a>
            <a href="#" className="text-blue-600 hover:underline">
              Privacy
            </a>
            <a href="#" className="text-blue-600 hover:underline">
              Help
            </a>
          </div>
          <p className="text-muted-foreground text-xs">
            Join SoundSphere to discover exclusive vinyl releases and
            member-only offers.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
