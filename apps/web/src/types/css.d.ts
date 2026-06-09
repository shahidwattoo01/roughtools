// apps/web/src/types/css.d.ts
// Tells TypeScript that .css files are valid imports (side-effect imports)
declare module "*.css" {
  const content: Record<string, string>;
  export default content;
}