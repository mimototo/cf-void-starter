#!/bin/sh
# git が別の hooks パスを使っているときは、そこを上書きしない。
if git config --get core.hooksPath >/dev/null 2>&1; then
  echo "core.hooksPath が設定されているため、Lefthook のフックは入れていない。入れる場合は lefthook install --force を実行する。"
  exit 0
fi

lefthook install
