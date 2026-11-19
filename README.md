# pi-clear-screen

A [pi](https://docs.pi.dev/latest) extension that adds a `/clear` command and a `ctrl+l` shortcut.

Both wipe the terminal screen and scrollback, then redraw pi with its startup banner
above the editor. Only the on-screen transcript is removed: the agent's context and the
session file are left untouched, so the conversation continues exactly where it was.

Clearing is refused while the agent is running, so in-progress output is not lost.

`ctrl+l` installs itself as a shortcut, which replaces pi's default `ctrl+l` binding
for the model selector. Rebind or disable `app.model.select` in `keybindings.json` if
you want both.

## Install

```sh
pi install /path/to/pi-clear-screen
```

Or try it for a single run:

```sh
pi -e /path/to/pi-clear-screen
```
