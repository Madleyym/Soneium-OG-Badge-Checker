import React from "react";

const BadgeStatus = ({ result, Icons }) => {
  // Get badge statuses directly from the API response
  const ogBadgeReceived = result.badges?.ogBadge || false;
  const premiumBadgeReceived = result.badges?.premiumBadge || false;
  
  // Special message for addresses with both badges
  const hasBothBadges = ogBadgeReceived && premiumBadgeReceived;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="font-medium text-gray-700 dark:text-gray-300">Badge Status:</div>
        
        {/* Special indicator when both badges are received */}
        {hasBothBadges && (
          <span className="text-2xs px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
            Both Badges Received ✨
          </span>
        )}
      </div>

      {/* Show badge collection status */}
      <div className="grid grid-cols-1 gap-2">
        {/* OG Badge row */}
        <div className="flex items-center justify-between bg-white dark:bg-gray-700/40 p-1.5 rounded border border-gray-100 dark:border-gray-600">
          <div className="flex items-center space-x-1.5">
            <div className="p-1 rounded-full bg-blue-100 dark:bg-blue-900/50">
              <Icons.Shield className="h-3 w-3 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-gray-700 dark:text-gray-300 font-medium">OG Badge</span>
          </div>
          
          {ogBadgeReceived ? (
            <span className="font-medium text-green-600 dark:text-green-400 flex items-center">
              <Icons.Check className="h-3 w-3 mr-0.5" /> Received
            </span>
          ) : (
            <span className="font-medium text-red-600 dark:text-red-400 flex items-center">
              <Icons.XCircle className="h-3 w-3 mr-0.5" /> Not Received
            </span>
          )}
        </div>

        {/* Premium Badge row - only shown if eligible for premium */}
        {result.premium && (
          <div className="flex items-center justify-between bg-amber-50 dark:bg-amber-900/20 p-1.5 rounded border border-amber-100 dark:border-amber-800/50">
            <div className="flex items-center space-x-1.5">
              <div className="p-1 rounded-full bg-amber-100 dark:bg-amber-800/50">
                <Icons.Award className="h-3 w-3 text-amber-600 dark:text-amber-400" />
              </div>
              <span className="text-amber-700 dark:text-amber-300 font-medium">Premium Badge</span>
            </div>
            
            {premiumBadgeReceived ? (
              <span className="font-medium text-green-600 dark:text-green-400 flex items-center">
                <Icons.Check className="h-3 w-3 mr-0.5" /> Received
              </span>
            ) : (
              <span className="font-medium text-red-600 dark:text-red-400 flex items-center">
                <Icons.XCircle className="h-3 w-3 mr-0.5" /> Not Received
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BadgeStatus;