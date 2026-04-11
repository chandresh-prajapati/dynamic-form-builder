/**
 * Same output as `@dnd-kit/utilities` `CSS.Transform.toString` (translate3d + scale).
 * Kept locally so app code does not import `@dnd-kit/utilities` directly — some setups report
 * "Cannot find module" even though the package is a transitive dependency of `@dnd-kit/sortable`.
 */
export type SortableTransform = {
  x: number;
  y: number;
  scaleX: number;
  scaleY: number;
};

export function sortableTransformToCss(
  transform: SortableTransform | null | undefined
): string | undefined {
  if (!transform) return undefined;
  const { x, y, scaleX, scaleY } = transform;
  const translate = `translate3d(${x ? Math.round(x) : 0}px, ${y ? Math.round(y) : 0}px, 0)`;
  const scale = `scaleX(${scaleX}) scaleY(${scaleY})`;
  return `${translate} ${scale}`;
}
