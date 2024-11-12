export const slugify = (text: string, handleAmpersand = false): string => {
  if (!text) return ""; // Return empty string if input is null or undefined

  let processedText = text.toString().toLowerCase();

  // Handle ampersands if requested
  if (handleAmpersand) {
    processedText = processedText.replace(/\s*&\s*/g, "-and-");
  }

  // Normalize common accented terms
  const accentMap: { [key: string]: string } = {
    décor: "decor",
    // Add more mappings as needed
  };

  Object.entries(accentMap).forEach(([accented, plain]) => {
    processedText = processedText.replace(accented.toLowerCase(), plain);
  });

  return processedText
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start
    .replace(/-+$/, ""); // Trim - from end
};
