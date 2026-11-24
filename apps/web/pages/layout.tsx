import "./style.css";
import { useShared } from "@void/react";
import { useEffect, useState, type ReactNode } from "react";
import { VoidFateClient } from "void-fate/react";
import { startAnalytics } from "./analytics";

startAnalytics();

/**
 * サーバー描画では子だけを返す。
 * fate の生成クライアントはブラウザの Vite 環境で解決する。
 */
export default function Layout({ children }: { children: ReactNode }) {
  const shared = useShared();
  const userId = shared.auth?.user?.id ?? null;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return children;
  }

  return <VoidFateClient userId={userId}>{children}</VoidFateClient>;
}
