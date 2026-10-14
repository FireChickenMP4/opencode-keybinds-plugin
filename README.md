# opencode-keybinds-plugin

A scaffold for adding OpenCode keybinds that have no built-in command ID.

Almost everything in the OpenCode TUI already has a command ID, so you can rebind it from `cli.json`
and never touch a plugin — 240 of them, in fact. This package is for the leftovers: the handful of
actions the config schema can't reach. It is a small framework plus one worked example.

```text
tui.ts              builds one keymap layer out of every registered module
src/types.ts        Module / Registration / Keybind
src/commands/       one file per command, added to a list in index.ts
```

`register(context)` runs once per plugin load. The `command` it returns gets a keybind, a `Ctrl+P`
palette entry and a `/slash` command at the same time.

## Commands

| Command | Bind | Slash | What it does |
| --- | --- | --- | --- |
| Toggle alert sounds | `<leader>k` | `/sound` | Flips `attention.sound` in `cli.json`. Applies after a TUI restart. |

### Two kinds of command

The example that ships here is deliberately the second kind.

**Moves only the plugin's own state.** Reads and writes `context.storage`, subscribes to events,
shows toasts. `storage.memory` is gone when the TUI exits; `storage.store` persists and stays synced
across TUI instances. Nothing outside the plugin is touched, so every change is immediate.

**Reaches outside the plugin.** Calls `context.client` (the whole OpenCode server API), spawns
processes, or edits files on disk. These are as immediate as you make them — `/sound` needs a restart
only because `cli.json` is read once at startup, not because the write is deferred.

### Why alert sounds needs a file

`attention.sound` has no command ID — none of the 240 built-in IDs is `attention.*` or `*.sound` —
and the settings panel is the only built-in way to flip it. A plugin cannot do it either:

- `context.attention.notify({ sound })` is vetoed before it plays anything: the internal volume
  resolver starts with `if (!config.attention.sound) return`, so plugin-supplied sounds are skipped
  while the setting is off.
- The CLI has an internal `cli.config.update` RPC that rewrites `cli.json` while preserving its
  formatting, but it is CLI-local; a plugin's `context.client` talks to the server and cannot reach
  it.

So `/sound` reads `cli.json`, flips `attention.sound`, and writes it back with every other key
preserved. `cli.json` is read once at TUI startup, hence the restart. A missing file is created; a
file that is not valid JSON is reported and left untouched.

## Install

OpenCode discovers plugins under `<global-config>/plugins/<name>/`, so cloning straight into that
path is enough:

```sh
git clone https://github.com/FireChickenMP4/opencode-keybinds-plugin \
  ~/.config/opencode/plugins/opencode-keybinds-plugin
```

The entrypoints have to stay where `index.ts` and `tui.ts` are, because a directory plugin is
resolved as `<dir>/index.ts` and `<dir>/tui.ts` — OpenCode does not read `package.json#exports` for
it:

```text
<global-config>/plugins/opencode-keybinds-plugin/
├─ index.ts     <- server entrypoint
├─ tui.ts       <- CLI entrypoint
└─ src/         <- implementation
```

The plugin IDs are `keybinds` (CLI) and `keybinds.server` (server). Keep them outside the `opencode.*`
prefix: that prefix is reserved for built-ins, and OpenCode treats a `plugins` entry whose target
starts with it as a match against built-ins rather than something to load, so a plugin ID under it can
never be enabled or disabled by name from config.

Or keep the checkout anywhere and point `cli.json` at its directory. That form goes through the same
resolver, so it expects the same two files there. Use it when the CLI runs against a remote server,
since `cli.json` plugins stay local:

```jsonc title="~/.config/opencode/cli.json"
{
  "plugins": ["file:///path/to/opencode-keybinds-plugin"]
}
```

OpenCode hot-reloads plugins, but restart the TUI if a new plugin does not show up.

## Binds

`<leader>` is whatever `keybinds.leader` is set to (`ctrl+x` by default). `<leader>k` is unused by
OpenCode itself — check `Ctrl+Alt+K` (which-key) to see what else your config has already taken.

To use another key, edit the `bind` field of the command. It is not configurable from `cli.json`:
OpenCode rejects command IDs it doesn't know about, and a plugin's command ID only exists once the
plugin is loaded.

## Adding a command

One feature is one module in `src/commands/`, registered in one line:

```ts
// src/commands/hello.ts
import type { Context, Registration } from "../types";

export function register(context: Context): Registration {
  return {
    command: {
      id: "keybinds.hello",
      title: "Say hello",
      bind: "<leader>H",
      palette: true,
      slash: { name: "hello", arguments: true },
      run(input) {
        context.ui.toast.show({ message: input?.trim() || "hello" });
      },
    },
  };
}
```

```ts
// src/commands/index.ts
import type { Module } from "../types";
import { register as alertSounds } from "./alert-sounds";
import { register as hello } from "./hello";

export const modules: readonly Module[] = [alertSounds, hello];
```

`register` runs once per plugin load. Anything with a side effect — subscriptions, timers, dialogs —
belongs there, and should be returned as `dispose`. The keymap layer factory in `tui.ts` is
re-evaluated by OpenCode and must stay pure, so it only reads the command list built during
registration.

Give a plugin command an ID under the plugin's own prefix, the way `keybinds.sound` does. The prefix
is a naming convention here, not a mechanism: nothing in the command-ID path is special-cased for
`opencode.*`.

`register` receives the full CLI plugin context: `context.client` (the OpenCode client),
`context.data` (events and cached data), `context.storage`, `context.ui`, and `context.keymap`. See
the [CLI plugin docs](https://opencode.ai/v2/docs/build/plugins/cli).

## Development

```sh
npm install
npm run typecheck
```

Types come from `@opencode/plugin`, pinned to the OpenCode 2.x line, plus `@types/node` for the node
APIs a command is free to use. There is no build step: the entrypoints are TypeScript, and OpenCode
loads them through Bun. A directory plugin loads `index.ts` / `tui.ts` directly; installed as a
package, the same files are reached through `exports`.

## License

MIT
