# opencode-keybinds-plugin

Keybinds for [OpenCode](https://opencode.ai) actions that have no built-in command ID.

Almost everything in the OpenCode TUI already has a command ID, so you can rebind it from `cli.json`
and never touch a plugin. This package is for the leftovers — the handful of actions the config
schema can't reach. Each one gets a keybind, a `Ctrl+P` palette entry and a `/slash` command at the
same time.

## Commands

| Command | Bind | Slash | What it does |
| --- | --- | --- | --- |
| Toggle permission auto-accept | `<leader>o` | `/autoaccept` | While on, every permission request is answered `once` and a toast says so. While off, requests ask as usual. |

`cli.json`'s `session.permissions` is either `"prompt"` or `"autoaccept"`, and the settings panel is
the only built-in way to flip it. This plugin doesn't write that setting; it answers incoming
requests itself, which is immediate and reversible from the keyboard. The setting keeps showing
`"prompt"` — they are two independent switches.

The auto-accept flag lives in memory on purpose. It is never persisted, so a TUI restart always
comes back asking.

## Install

The plugin is a directory that OpenCode discovers by name, so dropping it into the global config
directory is enough:

```text
<global-config>/plugins/opencode-keybinds-plugin/
├─ index.ts
├─ tui.ts
└─ ...
```

Clone into that path directly:

```sh
git clone https://github.com/FireChickenMP4/opencode-keybinds-plugin \
  ~/.config/opencode/plugins/opencode-keybinds-plugin
```

Or keep the checkout anywhere and point `cli.json` at it — use this form when the CLI runs against a
remote server, since `cli.json` plugins stay local:

```jsonc title="~/.config/opencode/cli.json"
{
  "plugins": ["file:///path/to/opencode-keybinds-plugin"]
}
```

Restart the TUI after installing or changing a bind.

## Binds

`<leader>` is whatever `keybinds.leader` is set to (`ctrl+x` by default). `<leader>o` is unused by
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
      id: "opencode.hello",
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
import { register as hello } from "./hello";

export const modules: readonly Module[] = [autoAccept, hello];
```

`register` runs once per plugin load. Anything with a side effect — subscriptions, timers, dialogs —
belongs there, and should be returned as `dispose`. The keymap layer factory in `src/tui.ts` is
re-evaluated by OpenCode and must stay pure, so it only reads the command list built during
registration.

`setup` also receives the full CLI plugin context: `context.client` (the OpenCode client),
`context.data` (events and cached data), `context.storage`, `context.ui`, and `context.keymap`. See
the [CLI plugin docs](https://opencode.ai/v2/docs/build/plugins/cli).

## Development

```sh
npm install
npm run typecheck
```

Types come from `@opencode/plugin`, pinned to the OpenCode 2.x line. There is no build step: OpenCode
resolves the TypeScript entrypoints from `package.json`'s `exports` at runtime.

## License

MIT
