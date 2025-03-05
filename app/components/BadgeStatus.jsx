import React from "react";

const BadgeStatus = ({ result, Icons }) => {
  // Function to open badge on Blockscout
  const openBadgeExplorer = (tokenId) => {
    window.open(
      `https://soneium.blockscout.com/token/0x2A21B17E366836e5FFB19bd47edB03b4b551C89d/instance/${tokenId}`,
      "_blank"
    );
  };

  // Both badges received
  if (result.badges?.ogBadge && result.badges?.premiumBadge) {
    return (
      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between bg-green-50 dark:bg-green-900/20 p-1.5 rounded-md">
          <div className="flex items-center">
            <Icons.Check className="h-3.5 w-3.5 text-green-500 mr-1" />
            <span className="font-medium text-green-600 dark:text-green-400">
              Both Badges Received ✨
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Icons.Shield className="h-3 w-3 text-blue-500" />
            <Icons.Award className="h-3 w-3 text-amber-500" />
          </div>
        </div>

        {/* OG Badge Details */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-1.5 rounded-md border border-blue-100 dark:border-blue-800/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Icons.Shield className="h-3.5 w-3.5 text-blue-500 mr-1" />
              <span className="font-medium text-blue-600 dark:text-blue-400">
                Soneium OG Badge
              </span>
            </div>
            <button
              onClick={() => openBadgeExplorer(0)}
              className="text-blue-500 hover:text-blue-700 dark:hover:text-blue-300"
              aria-label="View OG Badge on Blockscout"
            >
              <Icons.ExternalLink className="h-3 w-3" />
            </button>
          </div>
          <div className="text-2xs text-blue-600 dark:text-blue-400 mt-1">
            Awarded for 45+ successful transactions on Soneium network
          </div>
        </div>

        {/* Premium Badge Details */}
        <div className="bg-amber-50 dark:bg-amber-900/20 p-1.5 rounded-md border border-amber-100 dark:border-amber-800/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Icons.Award className="h-3.5 w-3.5 text-amber-500 mr-1" />
              <span className="font-medium text-amber-600 dark:text-amber-400">
                Soneium Premium Badge
              </span>
            </div>
            <button
              onClick={() => openBadgeExplorer(1)}
              className="text-amber-500 hover:text-amber-700 dark:hover:text-amber-300"
              aria-label="View Premium Badge on Blockscout"
            >
              <Icons.ExternalLink className="h-3 w-3" />
            </button>
          </div>
          <div className="text-2xs text-amber-600 dark:text-amber-400 mt-1">
            {result.premiumReason ||
              "Earned by bridging significant assets to Soneium"}
          </div>
        </div>
      </div>
    );
  }

  // Just OG badge received
  if (result.badges?.ogBadge) {
    return (
      <div className="flex flex-col space-y-2">
        {/* OG Badge Details */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-1.5 rounded-md border border-blue-100 dark:border-blue-800/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Icons.Check className="h-3.5 w-3.5 text-green-500 mr-1" />
              <span className="font-medium text-blue-600 dark:text-blue-400">
                Soneium OG Badge Received
              </span>
            </div>
            <button
              onClick={() => openBadgeExplorer(0)}
              className="text-blue-500 hover:text-blue-700 dark:hover:text-blue-300"
              aria-label="View OG Badge on Blockscout"
            >
              <Icons.ExternalLink className="h-3 w-3" />
            </button>
          </div>
          <div className="text-2xs text-blue-600 dark:text-blue-400 mt-1">
            Awarded for 45+ successful transactions on Soneium network
          </div>
        </div>

        {/* Premium Badge Status */}
        {result.premium && (
          <div className="bg-gray-100 dark:bg-gray-700 p-1.5 rounded-md">
            <div className="flex items-center">
              <Icons.Clock className="h-3.5 w-3.5 text-gray-500 mr-1" />
              <span className="text-gray-600 dark:text-gray-400 text-2xs">
                Also eligible for Premium Badge (not received yet)
              </span>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Just Premium badge received (rare case)
  if (result.badges?.premiumBadge) {
    return (
      <div className="flex flex-col space-y-2">
        {/* Premium Badge Details */}
        <div className="bg-amber-50 dark:bg-amber-900/20 p-1.5 rounded-md border border-amber-100 dark:border-amber-800/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Icons.Check className="h-3.5 w-3.5 text-green-500 mr-1" />
              <span className="font-medium text-amber-600 dark:text-amber-400">
                Soneium Premium OG Badge Received
              </span>
            </div>
            <button
              onClick={() => openBadgeExplorer(1)}
              className="text-amber-500 hover:text-amber-700 dark:hover:text-amber-300"
              aria-label="View Premium Badge on Blockscout"
            >
              <Icons.ExternalLink className="h-3 w-3" />
            </button>
          </div>
          <div className="text-2xs text-amber-600 dark:text-amber-400 mt-1">
            {result.premiumReason ||
              "Earned by bridging significant assets to Soneium"}
          </div>
        </div>

        {/* OG Badge Status */}
        <div className="bg-gray-100 dark:bg-gray-700 p-1.5 rounded-md">
          <div className="flex items-center">
            <Icons.Clock className="h-3.5 w-3.5 text-gray-500 mr-1" />
            <span className="text-gray-600 dark:text-gray-400 text-2xs">
              Unusual: Premium Badge received but OG Badge not found
            </span>
          </div>
        </div>
      </div>
    );
  }

  // No badges received
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        <Icons.Clock className="h-3.5 w-3.5 text-gray-500 mr-1" />
        <span className="font-medium text-gray-600 dark:text-gray-400">
          {result.premium
            ? "Eligible for both badges"
            : "Eligible for OG badge"}
        </span>
      </div>
      <div className="flex items-center gap-1.5 text-gray-400">
        <Icons.Shield className="h-3 w-3" />
        {result.premium && <Icons.Award className="h-3 w-3" />}
      </div>
    </div>
  );
};

export default BadgeStatus;
