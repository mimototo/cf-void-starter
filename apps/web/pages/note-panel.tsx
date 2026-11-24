import { Button } from "@astryxdesign/core/Button";
import { useState } from "react";
import { Input, Label, TextField } from "react-aria-components";

type Note = {
  createdAt: string;
  id: string;
  text: string;
};

/** サインイン中だけメモを追加する。保存先は Valibot で検証する API。 */
export function NotePanel({ notes }: { notes: Note[] }) {
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function submit() {
    setPending(true);
    setError(null);
    const response = await fetch("/api/notes", {
      body: JSON.stringify({ text }),
      headers: { "content-type": "application/json" },
      method: "POST",
    });
    setPending(false);
    if (!response.ok) {
      setError("メモを保存できませんでした。");
      return;
    }
    window.location.assign("/");
  }

  return (
    <section className="grid gap-3">
      <h2 className="text-xl">メモ</h2>
      {notes.length === 0 ? <p>まだメモはありません。</p> : null}
      <ul className="grid gap-2">
        {notes.map((note) => (
          <li className="rounded-md border border-border px-3 py-2" key={note.id}>
            {note.text}
          </li>
        ))}
      </ul>
      <form
        className="grid gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          void submit();
        }}
      >
        <TextField className="grid gap-1 text-sm" isRequired onChange={setText} value={text}>
          <Label>新しいメモ</Label>
          <Input className="rounded-md border border-border bg-surface px-3 py-2" />
        </TextField>
        {error ? <p className="text-sm text-danger">{error}</p> : null}
        <Button isDisabled={pending} label="メモを保存" type="submit" />
      </form>
    </section>
  );
}
