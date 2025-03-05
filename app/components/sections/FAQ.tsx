import React from "react";

const FAQ: React.FC = () => {
  return (
    <div className="border-t dark:border-gray-700 pt-3 mt-2">
      <details className="group">
        <summary className="flex justify-between items-center font-medium cursor-pointer text-sm text-gray-600 dark:text-gray-300 p-2">
          <span>Frequently Asked Questions</span>
          <span className="transition group-open:rotate-180">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </span>
        </summary>
        <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-3 space-y-3 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
          {/* Question 1 */}
          <details className="group/item border-b border-gray-200 dark:border-gray-700 pb-2">
            <summary className="flex justify-between items-center cursor-pointer font-medium text-gray-700 dark:text-gray-300 py-2 px-1">
              <span className="pr-6">
                What's the minimum transaction requirement?
              </span>
              <span className="transition-transform group-open/item:rotate-180 flex-shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-3 w-3 text-gray-500 dark:text-gray-400"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </span>
            </summary>
            <div className="mt-2 px-1 text-justify">
              <p className="mb-2">
                A minimum of{" "}
                <span className="font-semibold">45 transactions</span> before
                block #3747022 is required to be eligible for the OG Badge.
              </p>
              <p className="mb-2">
                Any successful token transfer will be counted, including methods
                like: execute, withdraw, mint, getReward, multicall, and similar
                operations. Failed transactions will be excluded from this
                count.
              </p>
              <p className="mb-2">
                You can check your transaction status on the{" "}
                <a
                  href="https://soneium.blockscout.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  Soneium Block Explorer
                </a>
                .
              </p>

              <div className="bg-blue-50 dark:bg-blue-900/30 p-3 mt-2 rounded-lg border border-blue-100 dark:border-blue-800">
                <p className="font-medium text-blue-700 dark:text-blue-300">
                  How to verify your transaction count:
                </p>
                <div className="mt-2 border-l-4 border-blue-300 dark:border-blue-600 pl-2">
                  <p className="font-medium text-gray-700 dark:text-gray-300">
                    In the Soneium Block Explorer, you'll see two different
                    numbers:
                  </p>
                  <div className="mt-1.5 space-y-2">
                    <div className="bg-white dark:bg-gray-800 p-2 rounded border border-gray-200 dark:border-gray-700 flex flex-wrap items-center">
                      <span className="font-mono text-blue-600 dark:text-blue-400 font-bold mr-2">
                        Transactions:
                      </span>
                      <span className="font-mono">45</span>
                      <span className="w-full mt-1 text-green-500 text-xs">
                        This is the number that matters! ✓
                      </span>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-2 rounded border border-gray-200 dark:border-gray-700 flex flex-wrap items-center">
                      <span className="font-mono text-gray-600 dark:text-gray-400 mr-2">
                        Transfers:
                      </span>
                      <span className="font-mono">92</span>
                      <span className="w-full mt-1 text-gray-500 text-xs">
                        (Different metric, not relevant)
                      </span>
                    </div>
                  </div>
                  <p className="mt-2 font-semibold text-green-600 dark:text-green-400">
                    If the number after 'Transactions' is 45 or more, you're
                    eligible! ✅
                  </p>
                </div>

                <div className="mt-3 bg-indigo-50 dark:bg-indigo-900/20 p-2.5 rounded-lg border border-indigo-100 dark:border-indigo-800/40">
                  <p className="font-medium text-indigo-700 dark:text-indigo-300 flex items-center">
                    <span className="mr-1">💡</span> Transaction Score Formula:
                  </p>
                  <div className="mt-1.5 pl-2">
                    <div className="bg-white dark:bg-gray-800 p-2 rounded">
                      <span className="font-mono text-sm">
                        <span className="text-indigo-600 dark:text-indigo-400">
                          if
                        </span>{" "}
                        (Tx ≥ 45){" "}
                        <span className="text-green-600 dark:text-green-400">
                          → Eligible
                        </span>
                      </span>
                      <div className="text-xs mt-1 text-gray-600 dark:text-gray-400">
                        The higher your transaction count, the stronger your
                        status as an early network supporter! Having more than
                        the minimum shows greater engagement with the Soneium
                        ecosystem.
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 mt-2">
                      <div className="flex-1 bg-white dark:bg-gray-800 p-2 rounded border-l-4 border-yellow-400 dark:border-yellow-500">
                        <span className="text-xs font-medium">Minimum</span>
                        <div className="font-mono mt-1">
                          45 tx = Eligibility
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="mt-3 text-xs text-blue-600 dark:text-blue-400">
                  Note: Contract calls are also safe to include since token
                  transfers typically occur after contract calls.
                </p>
              </div>
            </div>
          </details>

          {/* Question 2 */}
          <details className="group/item border-b border-gray-200 dark:border-gray-700 pb-2">
            <summary className="flex justify-between items-center cursor-pointer font-medium text-gray-700 dark:text-gray-300 py-2 px-1">
              <span className="pr-6">
                What is the difference between OG Badge and Premium OG Badge?
              </span>
              <span className="transition-transform group-open/item:rotate-180 flex-shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-3 w-3 text-gray-500 dark:text-gray-400"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </span>
            </summary>
            <div className="mt-2 px-1 text-justify">
              <p className="mb-2">
                The badges represent different levels of participation in the
                Soneium ecosystem:
              </p>
              <ul className="space-y-2 pl-1">
                <li className="flex">
                  <span className="text-blue-600 dark:text-blue-400 mr-2 flex-shrink-0">
                    -
                  </span>
                  <span>
                    <span className="font-medium">OG Badge</span>: For early
                    users with at least 45 transactions before block #3747022.
                  </span>
                </li>
                <li className="flex">
                  <span className="text-amber-500 dark:text-amber-400 mr-2 flex-shrink-0">
                    -
                  </span>
                  <span>
                    <span className="font-medium">Premium OG Badge</span>: An
                    additional recognition for users who made significant
                    contributions through bridging assets.
                  </span>
                </li>
              </ul>
            </div>
          </details>

          {/* Question 3 */}
          <details className="group/item border-b border-gray-200 dark:border-gray-700 pb-2">
            <summary className="flex justify-between items-center cursor-pointer font-medium text-gray-700 dark:text-gray-300 py-2 px-1">
              <span className="pr-6">
                How do I qualify for the Premium OG Badge?
              </span>
              <span className="transition-transform group-open/item:rotate-180 flex-shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-3 w-3 text-gray-500 dark:text-gray-400"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </span>
            </summary>
            <div className="mt-2 px-1 text-justify">
              <p className="mb-2">
                You need to have met one of these criteria before the snapshot
                at block #3747022:
              </p>
              <ul className="space-y-2 pl-1">
                <li className="flex">
                  <span className="text-amber-500 dark:text-amber-400 mr-2 flex-shrink-0">
                    -
                  </span>
                  <span>Bridged 1 ETH via the native bridge</span>
                </li>
                <li className="flex">
                  <span className="text-amber-500 dark:text-amber-400 mr-2 flex-shrink-0">
                    -
                  </span>
                  <span>Bridged ~70K ASTR (≈1 ETH) via Astar Network CCIP</span>
                </li>
                <li className="flex">
                  <span className="text-amber-500 dark:text-amber-400 mr-2 flex-shrink-0">
                    -
                  </span>
                  <span>Bridged $2.5K USDC via the native bridge</span>
                </li>
              </ul>
            </div>
          </details>

          {/* Question 4 */}
          <details className="group/item border-b border-gray-200 dark:border-gray-700 pb-2">
            <summary className="flex justify-between items-center cursor-pointer font-medium text-gray-700 dark:text-gray-300 py-2 px-1">
              <span className="pr-6">Can I check multiple wallets?</span>
              <span className="transition-transform group-open/item:rotate-180 flex-shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-3 w-3 text-gray-500 dark:text-gray-400"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </span>
            </summary>
            <div className="mt-2 px-1 text-justify">
              <p>
                Yes, you can check multiple addresses simultaneously by entering
                them one per line in the input field. This batch checking allows
                you to efficiently verify eligibility across all your wallets.
              </p>
            </div>
          </details>

          {/* Question 5 */}
          <details className="group/item border-b border-gray-200 dark:border-gray-700 pb-2">
            <summary className="flex justify-between items-center cursor-pointer font-medium text-gray-700 dark:text-gray-300 py-2 px-1">
              <span className="pr-6">When will badges be distributed?</span>
              <span className="transition-transform group-open/item:rotate-180 flex-shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-3 w-3 text-gray-500 dark:text-gray-400"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </span>
            </summary>
            <div className="mt-2 px-1 text-justify">
              <p>
                Both OG Badge and Premium OG Badge will be distributed in the
                first week of March 2025 as Soulbound tokens. These
                non-transferable tokens will permanently recognize your early
                contributions to the Soneium ecosystem.
              </p>
            </div>
          </details>

          {/* NEW Question - How to view/import my badges */}
          <details className="group/item border-b border-gray-200 dark:border-gray-700 pb-2">
            <summary className="flex justify-between items-center cursor-pointer font-medium text-gray-700 dark:text-gray-300 py-2 px-1">
              <span className="pr-6">
                How can I view my badges in my wallet?
              </span>
              <span className="transition-transform group-open/item:rotate-180 flex-shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-3 w-3 text-gray-500 dark:text-gray-400"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </span>
            </summary>
            <div className="mt-2 px-1 text-justify">
              <p className="mb-3">
                You can import your badges to any wallet supporting NFTs using
                the following details:
              </p>

              <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg border border-amber-200 dark:border-amber-800">
                <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">
                  Badge Contract Information:
                </h4>

                <div className="space-y-3">
                  <div className="bg-white dark:bg-gray-800 p-2 rounded-lg border border-gray-200 dark:border-gray-700">
                    <p className="font-medium text-gray-600 dark:text-gray-300 mb-1">
                      Contract Address:
                    </p>
                    <div className="flex items-center gap-2">
                      <code className="text-xs sm:text-sm bg-gray-100 dark:bg-gray-900 p-1 px-2 rounded font-mono break-all">
                        0xEE70e6d461F0888Fd9DB60cb5B2e933adF5f4c7C
                      </code>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(
                            "0xEE70e6d461F0888Fd9DB60cb5B2e933adF5f4c7C"
                          );
                        }}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                        title="Copy to clipboard"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-3.5 w-3.5"
                        >
                          <rect
                            x="9"
                            y="9"
                            width="13"
                            height="13"
                            rx="2"
                            ry="2"
                          ></rect>
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-blue-50 dark:bg-blue-900/30 p-2 rounded-lg border border-blue-100 dark:border-blue-800">
                      <p className="font-medium text-blue-700 dark:text-blue-300 mb-1">
                        OG Badge:
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700 dark:text-gray-300">
                          Token ID:
                        </span>
                        <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                          0
                        </span>
                      </div>
                    </div>

                    <div className="bg-amber-50 dark:bg-amber-900/30 p-2 rounded-lg border border-amber-100 dark:border-amber-800">
                      <p className="font-medium text-amber-700 dark:text-amber-300 mb-1">
                        Premium OG Badge:
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-700 dark:text-gray-300">
                          Token ID:
                        </span>
                        <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
                          1
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded-lg border border-green-100 dark:border-green-800">
                    <p className="font-medium text-green-700 dark:text-green-300 mb-1">
                      How to import:
                    </p>
                    <ol className="list-decimal pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                      <li>Go to your wallet's NFT section</li>
                      <li>Select "Import NFT" or similar option</li>
                      <li>Enter the contract address above</li>
                      <li>Enter Token ID (1 for Premium, 2 for OG)</li>
                      <li>Confirm import</li>
                    </ol>
                  </div>

                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Note: These are Soulbound tokens (non-transferable) that
                    permanently recognize your contribution to the Soneium
                    ecosystem.
                  </p>
                </div>
              </div>
            </div>
          </details>

          {/* Question 6 */}
          <details className="group/item border-b border-gray-200 dark:border-gray-700 pb-2">
            <summary className="flex justify-between items-center cursor-pointer font-medium text-gray-700 dark:text-gray-300 py-2 px-1">
              <span className="pr-6">How accurate is this checker?</span>
              <span className="transition-transform group-open/item:rotate-180 flex-shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-3 w-3 text-gray-500 dark:text-gray-400"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </span>
            </summary>
            <div className="mt-2 px-1 text-justify">
              <p>
                This checker uses publicly available Soneium blockchain data to
                determine eligibility, providing accurate results based on the
                snapshot at block #3747022. The verification process includes:
              </p>
              <ul className="mt-1 space-y-2 pl-1">
                <li className="flex">
                  <span className="text-blue-600 dark:text-blue-400 mr-2 flex-shrink-0">
                    -
                  </span>
                  <span>Transaction history verification</span>
                </li>
                <li className="flex">
                  <span className="text-blue-600 dark:text-blue-400 mr-2 flex-shrink-0">
                    -
                  </span>
                  <span>Bridge activity analysis</span>
                </li>
                <li className="flex">
                  <span className="text-blue-600 dark:text-blue-400 mr-2 flex-shrink-0">
                    -
                  </span>
                  <span>Exact transaction count confirmation</span>
                </li>
              </ul>
            </div>
          </details>

          {/* Question 7 */}
          <details className="group/item border-b border-gray-200 dark:border-gray-700 pb-2">
            <summary className="flex justify-between items-center cursor-pointer font-medium text-gray-700 dark:text-gray-300 py-2 px-1">
              <span className="pr-6">
                What's the minimum transaction requirement?
              </span>
              <span className="transition-transform group-open/item:rotate-180 flex-shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-3 w-3 text-gray-500 dark:text-gray-400"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </span>
            </summary>
            <div className="mt-2 px-1 text-justify">
              <p>
                A minimum of{" "}
                <span className="font-semibold">45 transactions</span> before
                block #3747022 is required to be eligible for the OG Badge. This
                threshold was established to recognize users who have been
                actively engaging with the Soneium network during its early
                stages.
              </p>
            </div>
          </details>
        </div>
      </details>
    </div>
  );
};

export default FAQ;
