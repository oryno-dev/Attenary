declare module '*/package.json' {
  export const name: string;
  export const version: string;
  export const main: string;
  export const scripts: Record<string, string>;
  export const dependencies: Record<string, string>;
  export const private: boolean;
}
