/**
 * Validate Ethereum address format
 * @param address - The address to validate
 * @returns boolean indicating if the address is valid
 */
export function isValidEthereumAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Format address for display by showing only first and last few characters
 * @param address - The full address
 * @param prefixLength - Number of characters to show at the start
 * @param suffixLength - Number of characters to show at the end
 * @returns Formatted address string
 */
export function formatAddress(
  address: string,
  prefixLength = 6,
  suffixLength = 4
): string {
  if (!address) return "";
  if (address.length <= prefixLength + suffixLength) return address;

  return `${address.slice(0, prefixLength)}...${address.slice(-suffixLength)}`;
}

/**
 * Format date to a readable string
 * @param dateString - ISO date string
 * @returns Formatted date string
 */
export function formatDate(dateString?: string): string {
  if (!dateString) return "";

  const date = new Date(dateString);
  return new Intl.DateTimeFormat("default", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}
