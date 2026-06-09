export interface RobotsTxtConfig {
    siteUrl: string;
    disallow?: string[];
    allow?: string[];
    sitemaps?: string[];
    additionalDirectives?: string[];
}
/**
 * Generate a robots.txt file content.
 */
export declare function buildRobotsTxt(config: RobotsTxtConfig): string;
/**
 * Default production robots.txt config.
 */
export declare const defaultRobotsConfig: RobotsTxtConfig;
/**
 * Development robots.txt — block all crawlers.
 */
export declare const devRobotsConfig: RobotsTxtConfig;
//# sourceMappingURL=robots.d.ts.map