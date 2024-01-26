/**
 * [ONI]-TODO: implement useToast
 * I wonder if that should be passed as a prop instead of a hook.
 * Getting just the text is not enough for powerful replacement.
 */
export function useToast() {
  return { showToastPopup: (_text: string) => {} };
}
