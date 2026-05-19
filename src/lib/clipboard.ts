const readClipboardText = async (): Promise<string | null> => {
  try {
    if (typeof window === "undefined" || typeof navigator === "undefined") return null;
    if (!window.isSecureContext || !navigator.clipboard?.readText) return null;
    return await navigator.clipboard.readText();
  } catch {
    return null;
  }
};

const isClipboardValue = async (text: string) => {
  const current = await readClipboardText();
  return current === null || current === text;
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

  if (copyWithTextarea() && await isClipboardValue(value)) return true;

  try {
    if (typeof window !== "undefined" && window.isSecureContext && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
      return await isClipboardValue(value);
    }
  } catch {
    return false;
  }

  return false;
};