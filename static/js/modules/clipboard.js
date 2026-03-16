/**
 * Clipboard Module
 * Handles copy-to-clipboard functionality using modern Clipboard API
 */

export function initClipboard() {
  const copyButtons = document.querySelectorAll('[data-copy-target]');

  copyButtons.forEach(button => {
    button.addEventListener('click', async (e) => {
      e.preventDefault();

      const targetId = button.getAttribute('data-copy-target');
      const targetElement = document.getElementById(targetId);

      if (!targetElement) {
        console.error(`Copy target not found: ${targetId}`);
        return;
      }

      const text = extractText(targetElement);

      try {
        await navigator.clipboard.writeText(text);
        showCopySuccess(button);
      } catch (err) {
        console.error('Failed to copy:', err);
        // Fallback for older browsers
        fallbackCopy(text, button);
      }
    });
  });
}

/**
 * Extract text from various element types
 */
function extractText(element) {
  // For code blocks and pre elements
  if (element.tagName === 'PRE' || element.tagName === 'CODE') {
    return element.textContent.trim();
  }

  // For GitHub Gist embeds - try multiple selectors
  const gistCode = element.querySelector('.blob-code-inner') ||
                   element.querySelector('.gist-data');

  if (gistCode) {
    // Extract text from all code lines
    const codeLines = element.querySelectorAll('.blob-code-inner');
    if (codeLines.length > 0) {
      return Array.from(codeLines)
        .map(line => line.textContent)
        .join('\n')
        .trim();
    }
  }

  // Default: return trimmed text content
  return element.textContent.trim();
}

/**
 * Show visual feedback when copy succeeds
 */
function showCopySuccess(button) {
  const iconCopy = button.querySelector('.icon-copy');
  const iconCheck = button.querySelector('.icon-check');

  // Add success class
  button.classList.add('copied');

  // Swap icons
  if (iconCopy) iconCopy.hidden = true;
  if (iconCheck) iconCheck.hidden = false;

  // Reset after 2 seconds
  setTimeout(() => {
    button.classList.remove('copied');
    if (iconCopy) iconCopy.hidden = false;
    if (iconCheck) iconCheck.hidden = true;
  }, 2000);
}

/**
 * Fallback copy method for older browsers
 */
function fallbackCopy(text, button) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-999999px';
  textArea.style.top = '-999999px';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    const successful = document.execCommand('copy');
    if (successful) {
      showCopySuccess(button);
    }
  } catch (err) {
    console.error('Fallback copy failed:', err);
  }

  document.body.removeChild(textArea);
}
