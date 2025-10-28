// Minimal TypeScript declaration for papaparse to satisfy the compiler
// If you want richer typings, install `@types/papaparse` or expand these declarations.
declare module 'papaparse' {
  interface ParseConfig {
    header?: boolean;
    skipEmptyLines?: boolean | RegExp;
    [key: string]: any;
  }

  interface ParseResult<T = any> {
    data: T[];
    errors: any[];
    meta: any;
  }

  export function parse<T = any>(csv: string, config?: ParseConfig): ParseResult<T>;

  const Papa: {
    parse: typeof parse;
  };

  export default Papa;
}
