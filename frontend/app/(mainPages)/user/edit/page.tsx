'use client';

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { me, updateUser } from '@/services/userService';
import { User } from '@/types/userTypes';
import { useEffect, useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2, Camera } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function UserEdit() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Create form without initial values
  const form = useForm<User>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      avatar: '',
    },
  });

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        const response = await me();
        const userData = response.data as User;
        setUser(userData);

        // Initialize form with user data after it's loaded
        form.reset({
          avatar: userData.avatar,
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
        });

        // Set initial avatar preview
        if (userData.avatar) {
          setAvatarPreview(userData.avatar);
        }
      } catch {
        toast('Error loading user data', {
          description: 'Failed to load your profile information.',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [form]);

  // Watch for form changes to enable/disable save button
  useEffect(() => {
    const subscription = form.watch((value) => {
      if (!user) return;

      // Check if any field has changed from original values
      const changed =
        value.firstName !== user.firstName ||
        value.lastName !== user.lastName ||
        value.email !== user.email ||
        avatarPreview !== user.avatar;

      setHasChanges(changed);
    });

    return () => subscription.unsubscribe();
  }, [form, user, avatarPreview]);

  // Handle avatar file selection
  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file?.type.startsWith('image/') && file.size > 0) {
      // Preview the selected image
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
        setHasChanges(true);
      };
      reader.readAsDataURL(file);
    }
  };

  // Form submission handler
  const onSubmit = async (data: {
    firstName: string;
    lastName: string;
    avatar: string;
  }) => {
    if (!user || !hasChanges) return;

    try {
      setIsSaving(true);
      let avatar = null;

      // Check if we have a new avatar to upload
      if (avatarPreview && avatarPreview !== user.avatar) {
        const formData = new FormData();
        avatar = fileInputRef.current?.files?.[0];
        if (avatar) {
          formData.append('avatar', avatar);
          // Send avatar update first
        }
      }
      const response = await updateUser({
        firstName: data.firstName,
        lastName: data.lastName,
        avatar: avatar,
      });
      console.log('response', response);
      // Update local user data
      setUser(response.data);
      setHasChanges(false);

      toast('Profile updated', {
        description: 'Your profile information has been updated successfully.',
      });
    } catch {
      toast('Update failed', {
        description: 'There was a problem updating your profile information.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <p className="mt-2 text-gray-500">Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-2xl font-bold text-blue-500 mb-4">Edit User</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full max-w-md"
        >
          <div className="flex flex-col gap-4 rounded-lg p-6 bg-white shadow-md">
            {/* Avatar upload section */}
            <div className="flex flex-col items-center mb-4">
              <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200">
                  {avatarPreview ? (
                    <Image
                      src={avatarPreview}
                      alt="Avatar preview"
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Camera className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/png, image/jpeg"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="absolute bottom-0 right-0 rounded-full p-1"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-between mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/user/me')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-blue-500 text-white"
                disabled={!hasChanges || isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save'
                )}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
