import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { enterpriseApi } from '@/utils/api';

const enterpriseSchema = z.object({
  enterpriseName: z.string().min(2, 'Enterprise name must be at least 2 characters'),
  subdomain: z.string()
    .min(3, 'Subdomain must be at least 3 characters')
    .max(20, 'Subdomain must be less than 20 characters')
    .regex(/^[a-z0-9-]+$/, 'Subdomain can only contain lowercase letters, numbers, and hyphens')
    .refine((val) => !val.startsWith('-') && !val.endsWith('-'), 'Subdomain cannot start or end with a hyphen'),
  adminEmail: z.string().email('Invalid email address'),
  adminName: z.string().min(2, 'Name must be at least 2 characters'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type EnterpriseFormData = z.infer<typeof enterpriseSchema>;

export default function CreateEnterprise() {
  const [isLoading, setIsLoading] = useState(false);
  const [subdomainAvailable, setSubdomainAvailable] = useState<boolean | null>(null);
  const [checkingSubdomain, setCheckingSubdomain] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<EnterpriseFormData>({
    resolver: zodResolver(enterpriseSchema),
  });

  const subdomain = watch('subdomain');

  // Check subdomain availability
  const checkSubdomain = async (value: string) => {
    if (!value || value.length < 3) {
      setSubdomainAvailable(null);
      return;
    }

    setCheckingSubdomain(true);
    try {
      const response = await enterpriseApi.checkSubdomain(value);
      setSubdomainAvailable(response.available);
    } catch (error) {
      console.error('Error checking subdomain:', error);
      setSubdomainAvailable(null);
    } finally {
      setCheckingSubdomain(false);
    }
  };

  // Debounce subdomain check
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (subdomain) {
        checkSubdomain(subdomain);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [subdomain]);

  const onSubmit = async (data: EnterpriseFormData) => {
    setIsLoading(true);
    try {
      const response = await enterpriseApi.createEnterprise({
        name: data.enterpriseName,
        subdomain: data.subdomain,
        admin: {
          name: data.adminName,
          email: data.adminEmail,
          password: data.password,
        },
      });

      // Store enterprise info
      localStorage.setItem('enterprise', JSON.stringify(response.enterprise));
      
      // Redirect to the new subdomain
      const newUrl = `${window.location.protocol}//${data.subdomain}.${window.location.host.replace(/^[^.]+\./, '')}`;
      window.location.href = `${newUrl}/login?new=true`;
    } catch (error: any) {
      console.error('Error creating enterprise:', error);
      alert(error.response?.data?.message || 'Failed to create enterprise. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4 py-4">
          <Link to="/" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Home</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Building2 className="h-16 w-16 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Create Your Enterprise
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Set up your organization and get your own dedicated workspace
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Enterprise Name */}
              <div>
                <Label htmlFor="enterpriseName">Enterprise Name</Label>
                <Input
                  id="enterpriseName"
                  {...register('enterpriseName')}
                  placeholder="Acme Corporation"
                  className="mt-1"
                />
                {errors.enterpriseName && (
                  <p className="text-sm text-red-600 mt-1">{errors.enterpriseName.message}</p>
                )}
              </div>

              {/* Subdomain */}
              <div>
                <Label htmlFor="subdomain">Choose Your Subdomain</Label>
                <div className="mt-1 flex items-center">
                  <Input
                    id="subdomain"
                    {...register('subdomain')}
                    placeholder="acme"
                    className="rounded-r-none"
                  />
                  <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-sm">
                    .yourapp.com
                  </span>
                </div>
                {checkingSubdomain && (
                  <p className="text-sm text-gray-500 mt-1 flex items-center">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Checking availability...
                  </p>
                )}
                {!checkingSubdomain && subdomainAvailable === true && (
                  <p className="text-sm text-green-600 mt-1">✓ Subdomain is available</p>
                )}
                {!checkingSubdomain && subdomainAvailable === false && (
                  <p className="text-sm text-red-600 mt-1">✗ Subdomain is already taken</p>
                )}
                {errors.subdomain && (
                  <p className="text-sm text-red-600 mt-1">{errors.subdomain.message}</p>
                )}
              </div>

              {/* Admin Details */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Administrator Account
                </h3>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="adminName">Full Name</Label>
                    <Input
                      id="adminName"
                      {...register('adminName')}
                      placeholder="John Doe"
                      className="mt-1"
                    />
                    {errors.adminName && (
                      <p className="text-sm text-red-600 mt-1">{errors.adminName.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="adminEmail">Email Address</Label>
                    <Input
                      id="adminEmail"
                      type="email"
                      {...register('adminEmail')}
                      placeholder="john@acme.com"
                      className="mt-1"
                    />
                    {errors.adminEmail && (
                      <p className="text-sm text-red-600 mt-1">{errors.adminEmail.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      {...register('password')}
                      placeholder="••••••••"
                      className="mt-1"
                    />
                    {errors.password && (
                      <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      {...register('confirmPassword')}
                      placeholder="••••••••"
                      className="mt-1"
                    />
                    {errors.confirmPassword && (
                      <p className="text-sm text-red-600 mt-1">{errors.confirmPassword.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isLoading || subdomainAvailable === false}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Creating Enterprise...
                  </>
                ) : (
                  'Create Enterprise'
                )}
              </Button>

              <p className="text-sm text-center text-gray-500 dark:text-gray-400">
                By creating an enterprise, you agree to our{' '}
                <a href="#" className="text-blue-600 hover:underline">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-blue-600 hover:underline">
                  Privacy Policy
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
