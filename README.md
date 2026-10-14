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

Two commands ship as examples, one for each kind of reach a command has. Delete them when you write
your own.

| Example | Bind | Slash | Reaches |
| --- | --- | --- | --- |
| Auto-accept for the current session | `<leader>p` | `/autoaccept` | the server, through the client |
| Alert sounds | `<leader>k` | `/sound` | the disk, by editing `cli.json` |

### Reaching the server: auto-accept

The permission mode has no command ID, so it can't be bound from `cli.json`. But a plugin can set the
**session's** permission rules through the same mechanism the server-side API exposes:

```ts
await context.client.session.update({ sessionID, permissions })
```

It reads the current session's agent rules, turns every `effect: "ask"` into `"allow"`, and leaves
`deny` alone — the same semantics as `opencode --auto`, "auto-approve permissions that are not
explicitly denied". Pressing again clears the session rules and the agent's own rules apply.

The result is immediate: no restart, nothing written to disk. The switch is per-session, like the
built-in setting, and the on/off state is read back from the session rather than remembered.

### Reaching the disk: alert sounds

`attention.sound` has no command ID either, and the settings panel is the only built-in way to flip
it. A plugin can't do it the native way:

- `context.attention.notify({ sound })` is vetoed before it plays anything — the internal volume
  resolver starts with `if (!config.attention.sound) return`, so plugin-supplied sounds are skipped
  while the setting is off.
- The CLI's own `cli.config.update` RPC rewrites `cli.json` while preserving its formatting, but it
  is CLI-local; a plugin's `context.client` talks to the server and cannot reach it.

So this example reads `cli.json`, flips the key, and writes it back with every other key preserved.
`cli.json` is read once at TUI startup, so it applies after a restart. A missing file is created; a
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
