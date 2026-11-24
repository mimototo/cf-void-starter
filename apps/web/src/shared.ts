import type { AuthUser } from "void/auth";

declare module "void" {
  interface CloudContextVariables {
    shared: {
      auth: {
        user: AuthUser | null;
      };
    };
  }
}
