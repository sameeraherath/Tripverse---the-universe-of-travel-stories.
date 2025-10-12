/**
 * Utility functions for handling HTML content
 */

/**
 * Strips HTML tags from a string and returns plain text
 * @param {string} htmlString - The HTML string to strip tags from
 * @returns {string} - Plain text without HTML tags
 */
export const stripHtmlTags = (htmlString) => {
  if (!htmlString) return '';
  return htmlString.replace(/<[^>]*>/g, '');
};

/**
 * Gets a preview of text content by stripping HTML and limiting length
 * @param {string} htmlString - The HTML string to create preview from
 * @param {number} maxLength - Maximum length of the preview (default: 150)
 * @returns {string} - Plain text preview
 */
export const getTextPreview = (htmlString, maxLength = 150) => {
  const plainText = stripHtmlTags(htmlString);
  if (plainText.length <= maxLength) return plainText;
  return plainText.substring(0, maxLength) + '...';
};
