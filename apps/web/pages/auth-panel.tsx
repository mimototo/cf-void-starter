import { auth } from "void/client";
import { useState } from "react";
import { Button, Input, Label, TextField } from "react-aria-components";

const fieldClass = "grid gap-1 text-sm";
const inputClass = "rounded-md border border-border bg-surface px-3 py-2 text-primary";

function messageOf(error: unknown): string {
  if (
    error &&
    typeof error === "object" &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }
  return "認証に失敗しました。";
}

/** メールとパスワードの登録、ログイン、ログアウト。 */
export function AuthPanel({ signedInName }: { signedInName: string | null }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function signUp() {
    setPending(true);
    setError(null);
    const result = await auth.signUp.email({ email, name, password });
    setPending(false);
    if (result.error) {
      setError(messageOf(result.error));
      return;
    }
    window.location.assign("/");
  }

  async function signIn() {
    setPending(true);
    setError(null);
    const result = await auth.signIn.email({ email, password });
    setPending(false);
    if (result.error) {
      setError(messageOf(result.error));
      return;
    }
    window.location.assign("/");
  }

  async function signOut() {
    await auth.signOut();
    window.location.assign("/");
  }

  if (signedInName) {
    return (
      <div className="flex items-center justify-between gap-3">
        <p>{signedInName} としてサインイン中</p>
        <Button className={inputClass} onPress={() => void signOut()}>
          サインアウト
        </Button>
      </div>
    );
  }

  return (
    <form
      className="grid gap-3"
      onSubmit={(event) => {
        event.preventDefault();
        void signIn();
      }}
    >
      <TextField className={fieldClass} onChange={setName} value={name}>
        <Label>名前</Label>
        <Input className={inputClass} />
      </TextField>
      <TextField className={fieldClass} isRequired onChange={setEmail} type="email" value={email}>
        <Label>メールアドレス</Label>
        <Input className={inputClass} />
      </TextField>
      <TextField
        className={fieldClass}
        isRequired
        minLength={8}
        onChange={setPassword}
        type="password"
        value={password}
      >
        <Label>パスワード</Label>
        <Input className={inputClass} />
      </TextField>
      {error ? <p className="text-sm text-danger">{error}</p> : null}
      <div className="flex gap-2">
        <Button className={inputClass} isDisabled={pending} type="submit">
          ログイン
        </Button>
        <Button
          className={inputClass}
          isDisabled={pending}
          onPress={() => void signUp()}
          type="button"
        >
          登録
        </Button>
      </div>
    </form>
  );
}
