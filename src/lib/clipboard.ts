const canUseAsyncClipboard = () =>
  typeof window !== "undefined" &&
  typeof navigator !== "undefined" &&
  window.isSecureContext &&
  !!navigator.clipboard;

const clipboardMatches = async (text: string): Promise<boolean | null> => {
  if (!canUseAsyncClipboard() || !navigator.clipboard.readText) return null;

  try {
    return (await navigator.clipboard.readText()) === text;
  } catch {
    return null;
  }
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  const value = String(text || "");
  if (!value) return false;

  const copyWithTextarea = () => {
    if (typeof document === "undefined") return false;

    const activeElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const textarea = document.createElement("textarea");

    try {
      textarea.value = value;
      textarea.readOnly = true;
      textarea.setAttribute("aria-hidden", "true");
      textarea.style.position = "fixed";
      textarea.style.top = "0";
      textarea.style.left = "0";
      textarea.style.width = "1px";
      textarea.style.height = "1px";
      textarea.style.padding = "0";
      textarea.style.border = "0";
      textarea.style.opacity = "0";
      textarea.style.pointerEvents = "none";
      document.body.appendChild(textarea);
      textarea.focus({ preventScroll: true });
      textarea.select();
      textarea.setSelectionRange(0, value.length);
      return document.execCommand("copy");
    } catch {
      return false;
    } finally {
      textarea.remove();
      activeElement?.focus({ preventScroll: true });
    }
  };

  try {
    if (canUseAsyncClipboard() && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(value);
      return (await clipboardMatches(value)) !== false;
    }
  } catch {
    // Fallback unten versuchen.
  }

  if (copyWithTextarea()) {
    return (await clipboardMatches(value)) === true;
  }

  return false;
};