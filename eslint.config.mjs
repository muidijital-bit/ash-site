import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Captured responsive images are already optimized; stylesheet links use React precedence.
  { files: ["src/components/theme/**/*.tsx", "src/app/**/*.tsx"], rules: {
    "@next/next/no-img-element": "off", "@next/next/no-css-tags": "off"
  } },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
