export type FateContext = {
  request: Request;
};

export function createContext({ request }: { request: Request }): FateContext {
  return { request };
}
