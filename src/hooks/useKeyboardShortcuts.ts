import { useEffect } from "react";

type ShortcutMap = Record<string, () => void>;

// Normaliza a tecla pressionada para comparar com o atalho definido
function normalizeKey(e: KeyboardEvent) {
  const parts = [];
  if (e.altKey) parts.push("Alt");
  if (e.ctrlKey) parts.push("Ctrl");
  if (e.shiftKey) parts.push("Shift");
  if (e.metaKey) parts.push("Meta"); // ⌘ no Mac
  parts.push(e.key.toUpperCase());
  return parts.join("+");
}

export function useKeyboardShortcuts(shortcuts: ShortcutMap) {
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      const key = normalizeKey(e);
      if (shortcuts[key]) {
        e.preventDefault(); // evita comportamento padrão do navegador
        shortcuts[key]();
      }
    };
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [shortcuts]);
}
