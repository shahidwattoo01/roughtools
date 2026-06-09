// Providers
export { ThemeProvider, useTheme } from "./providers/theme";

// Hooks
export {
  useClipboard,
  useRecentTools,
  useFavorites,
  useMediaQuery,
  useIsMobile,
  useIsTablet,
  useIsDesktop,
  usePrefersReducedMotion,
} from "./hooks/index";
export type { RecentTool } from "./hooks/index";

// Layout
export { SkipLink } from "./components/layout/skip-link";
export { ToolLayout } from "./components/layout/tool-layout";

// Input
export {
  TextInput,
  SelectInput,
  TextareaInput,
  FileUpload,
} from "./components/input/index";

// Output
export {
  ResultCard,
  CodeOutput,
  TableOutput,
} from "./components/output/index";

// Feedback
export {
  Skeleton,
  ToolCardSkeleton,
  ToolGridSkeleton,
  ToolLayoutSkeleton,
  ErrorBoundary,
  EmptyState,
} from "./components/feedback/index";

// Navigation
export {
  Breadcrumb,
  SearchBar,
  ThemeToggle,
} from "./components/navigation/index";
export type {
  BreadcrumbItem,
  SearchResult,
} from "./components/navigation/index";

// Tool Widgets
export {
  RecentTools,
  FavoriteButton,
} from "./components/tool-widgets/index";

// Print
export { PrintArea, triggerPrint } from "./components/print/print-area";

// Button
export { Button } from "./components/Button";
export type { ButtonProps } from "./components/Button";

// Utils
export { cn } from "./utils/cn";

