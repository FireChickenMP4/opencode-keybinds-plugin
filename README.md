# opencode-keybinds-plugin

A framework for adding OpenCode TUI keybind commands that have no built-in command ID.

OpenCode already lets you rebind almost anything from `cli.json` — 240 command IDs, no plugin
needed. This framework is for the leftovers, the actions the config schema can't reach. It gives you
one file per command and turns each one into a keybind, a `Ctrl+P` palette entry and a `/slash`
command at the same time.

## Layout

```text
index.ts               server entrypoint (required by the plugin layout)
tui.ts                 CLI entrypoint: one keymap layer built from the registered modules
src/types.ts           Module / Registration / Keybind
src/cli-config.ts      reading and writing cli.json
src/commands/          one file per command
src/commands/index.ts  the registry - add a line here
```

`register(context)` runs once per plugin load. It returns a `command`, which goes into a single
keymap layer, and may return a `dispose` for anything it subscribed to.

## Adding a command

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
import { register as hello } from "./hello";

export const modules: readonly Module[] = [hello];
```

Keep side effects in `register`, not in `run`, when they are meant to last: subscriptions, timers.
The keymap layer factory in `tui.ts` is re-evaluated by OpenCode and must stay pure, so it only reads
the command list built during registration.

`register` receives the whole CLI plugin context — `context.client` (the OpenCode client),
`context.data` (events and cached data), `context.storage`, `context.ui`, `context.keymap`. See the
[CLI plugin docs](https://opencode.ai/v2/docs/build/plugins/cli).

## Examples

Two commands ship as examples. Delete them when you write your own.

| Example | Bind | Slash | What it does |
| --- | --- | --- | --- |
| Auto-accept | `<leader>p` | `/autoaccept` | Flips `session.permissions` in `cli.json` between `prompt` and `autoaccept` — the setting the settings panel edits under Session → Permissions. |
| Alert sounds | `<leader>k` | `/sound` | Flips `attention.sound`. |

### Why they edit a file

Both settings live in `cli.json`, and neither has a command ID, so neither can be bound from
`cli.json` alone. A plugin cannot reach them either:

- The settings panel changes them through the CLI's own `cli.config.update`, which rewrites the file
  while preserving its formatting. That RPC lives in the CLI process; a plugin's `context.client`
  talks to the server.
- `session.permissions` is read once as `t.auto ? "autoaccept" : config.session.permissions`. It is
  a **global** CLI setting, not session state, and no API exposes it.
- `context.attention.notify({ sound })` cannot force a sound either — the internal volume resolver
  starts with `if (!config.attention.sound) return`, so plugin-supplied sounds are skipped while the
  setting is off.

So both examples read `cli.json`, flip one key, and write it back with every other key preserved.
Whether a running TUI picks that up without a restart depends on its file watching; restart if the
change does not show. A missing file is created; a file that is not valid JSON is reported and left
untouched.

### What else a command can reach

Files are the last resort, not the only option. A command gets the whole CLI plugin context:

- `context.storage` — `memory` is gone when the TUI exits, `store` persists and stays synced across
  TUI instances.
- `context.data` — the event stream plus cached sessions, agents, models, permissions.
- `context.client` — the whole OpenCode server API. For example, session-scoped permission rules go
  through `context.client.session.update({ sessionID, permissions })`, which is immediate and writes
  nothing to disk.
- `context.ui` — dialogs, toasts, routes, slots, panels.
- Node APIs, including spawning processes.

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

`<leader>` is whatever `keybinds.leader` is set to (`ctrl+x` by default). Check `Ctrl+Alt+K`
(which-key) for what your config already occupies — plugin commands show up there alongside the
built-ins.

To move a command, edit its `bind` field. It is not configurable from `cli.json`: OpenCode validates
`keybinds` against its own ID set and rejects anything else, and a plugin's command ID only exists
once the plugin is loaded.

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
