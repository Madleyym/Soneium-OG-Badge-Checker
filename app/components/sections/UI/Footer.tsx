import React from "react";
import { Github } from "lucide-react"; // Using lucide-react for the GitHub icon

const Footer: React.FC = () => {
  return (
    <div className="text-center pt-4 relative overflow-hidden">
      {/* Animated premium gradient top border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-indigo-600 to-amber-400 dark:from-blue-500 dark:via-indigo-400 dark:to-amber-300 animate-pulse"></div>

      {/* Subtle background gradient with more pronounced premium feel */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-amber-50/20 dark:to-amber-900/20 rounded-b-lg opacity-80"></div>

      <div className="space-y-4 pt-2 relative z-10">
        {/* Official statement with premium typography */}
        <p className="text-xs text-gray-700 dark:text-gray-300 font-semibold tracking-wider uppercase">
          Official Soneium Social Channels
        </p>

        {/* Social media links with enhanced hover effects */}
        <div className="flex items-center justify-center space-x-5">
          {/* Website */}
          <a
            href="https://soneium.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs sm:text-sm text-gray-800 dark:text-gray-200 hover:text-amber-600 dark:hover:text-amber-400 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl px-3 py-1.5 rounded-xl hover:bg-amber-100 dark:hover:bg-amber-900/50 flex items-center border border-transparent hover:border-amber-200 dark:hover:border-amber-700"
          >
            🌐 <span className="ml-1 font-medium">Website</span>
          </a>

          {/* X (Twitter) */}
          <a
            href="https://x.com/soneium"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs sm:text-sm text-gray-800 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl px-3 py-1.5 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/50 flex items-center border border-transparent hover:border-blue-200 dark:hover:border-blue-700"
          >
            🐦 <span className="ml-1 font-medium">X @soneium</span>
          </a>

          {/* Discord */}
          <a
            href="https://discord.com/invite/soneium"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs sm:text-sm text-gray-800 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl px-3 py-1.5 rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-900/50 flex items-center border border-transparent hover:border-indigo-200 dark:hover:border-indigo-700"
          >
            🔮 <span className="ml-1 font-medium">Discord</span>
          </a>
        </div>

        {/* Hashtags with premium styling */}
        <div className="flex flex-wrap justify-center gap-2 text-xs mt-3">
          <a
            href="#"
            className="text-blue-700 hover:text-white dark:text-blue-400 dark:hover:text-white transition-all duration-300 bg-blue-100 hover:bg-blue-700 dark:bg-blue-900/50 dark:hover:bg-blue-700 px-3 py-1.5 rounded-full shadow-md hover:shadow-xl border border-blue-200 dark:border-blue-700 font-semibold"
          >
            #SoneiumOG
          </a>
          <a
            href="#"
            className="text-amber-700 hover:text-white dark:text-amber-400 dark:hover:text-white transition-all duration-300 bg-gradient-to-r from-amber-100 to-yellow-100 hover:from-amber-600 hover:to-yellow-600 dark:from-amber-900/50 dark:to-yellow-900/50 dark:hover:from-amber-700 dark:hover:to-yellow-700 px-3 py-1.5 rounded-full shadow-md hover:shadow-xl border border-amber-200 dark:border-amber-700 font-semibold"
          >
            #PremiumOG
          </a>
        </div>

        {/* Version with GitHub link */}
        <div className="text-xs text-gray-600 dark:text-gray-400 font-light pt-1 pb-2 flex items-center justify-center space-x-2">
          {/* Premium version badge with GitHub link */}
          <a
            href="https://github.com/Madleyym/Soneium-OG-Badge-Checker"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center bg-gradient-to-r from-blue-50 to-amber-50 dark:from-gray-800 dark:to-gray-700 px-4 py-1 rounded-full shadow-md border border-gray-200 dark:border-gray-600 transform hover:scale-105 transition-all duration-300 group"
          >
            <span className="text-xs font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent mr-2">
              V-2.1.2
            </span>
            <Github className="w-4 h-4 text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
          </a>
        </div>
      </div>

      {/* Bottom premium gradient accent */}
      <div className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-transparent via-amber-300 to-transparent dark:via-amber-500 opacity-50"></div>
    </div>
  );
};

export default Footer;
