/**
 * Debounce function to limit how often a function is called
 * @param func - Function to debounce
 * @param waitFor - Time to wait in milliseconds
 * @returns Debounced function
 */
export function debounce<F extends (...args: any[]) => any>(
  func: F,
  waitFor: number
): (...args: Parameters<F>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<F>) => {
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => func(...args), waitFor);
  };
}

/**
 * Download data as CSV file
 * @param filename - Name for the downloaded file
 * @param data - Array of data objects
 * @param headers - Column headers
 */
export function downloadCSV(
  filename: string,
  data: Record<string, any>[],
  headers: string[]
): void {
  const headerRow = headers.join(",");
  const rows = data.map((item) =>
    headers
      .map((header) => {
        const value = item[header] || "";
        // Escape quotes and wrap values with commas in quotes
        const escaped =
          typeof value === "string" ? value.replace(/"/g, '""') : value;
        return /[,"]/.test(String(escaped)) ? `"${escaped}"` : escaped;
      })
      .join(",")
  );

  const csvContent = [headerRow, ...rows].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.display = "none";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Clean up the URL object
  URL.revokeObjectURL(url);
}

/**
 * Gets current timestamp in YYYY-MM-DD format
 * @returns Current date string
 */
export function getCurrentDateString(): string {
  return new Date().toISOString().split("T")[0];
}
