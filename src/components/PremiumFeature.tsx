
import React from 'react';
import { Lock } from 'lucide-react';
import { useUserStore } from '@/store/useUserStore';

type PremiumFeatureProps = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

export const PremiumFeature: React.FC<PremiumFeatureProps> = ({
  children,
  fallback
}) => {
  const { plan } = useUserStore();
  const isPremium = plan === 'premium';

  if (isPremium) {
    return <>{children}</>;
  }

  return (
    <div className="relative group">
      <div className="absolute inset-0 bg-gray-100/90 rounded flex items-center justify-center">
        <div className="text-center p-4">
          <Lock className="w-6 h-6 mx-auto mb-2 text-amber-500" />
          <p className="text-sm text-gray-600">Premium feature</p>
        </div>
      </div>
      {fallback || children}
    </div>
  );
};
