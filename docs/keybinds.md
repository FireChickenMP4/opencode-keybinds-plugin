# OpenCode keybinds

Every command ID OpenCode 2.0.27 can bind, read out of the binary, and the rules for rebinding them
from `cli.json`. Anything listed here can be rebound without a plugin — this package exists only for
the handful of actions that appear in no list below.

## Rebinding

```jsonc title="cli.json"
{
  "$schema": "https://opencode.ai/v2/cli.json",
  "keybinds": {
    "leader": "ctrl+x",
    "app.exit": ["ctrl+c", "ctrl+d"],
    "app.debug": false,
    "prompt.paste": { "key": "ctrl+v", "preventDefault": false }
  },
  "leader": { "timeout": 1500 }
}
```

| Value | Meaning |
| --- | --- |
| `"ctrl+p"` | one key |
| `"ctrl+p,ctrl+n"` or `["ctrl+p", "ctrl+n"]` | alternatives |
| `false` or `"none"` | unbind |
| `{ "key": ..., "preventDefault": false }` | when the binding needs event behaviour |
| `"<leader>x"` | expands to whatever `keybinds.leader` is |

Unknown IDs are rejected outright. Add only the keys you want: the rest of `cli.json` is unrelated,
and `Ctrl+Alt+K` (which-key) shows what is actually bound right now.

## Leader combinations already taken

`<leader>` defaults to `ctrl+x`. OpenCode itself claims these:

| Combination | Command |
| --- | --- |
| `<leader>q` | `app.exit, session.queued_prompts` |
| `<leader>e` | `prompt.editor` |
| `<leader>b` | `session.sidebar.toggle` |
| `<leader>left` | `pane.focus.left` |
| `<leader>right` | `pane.focus.right` |
| `<leader>down` | `terminal.select` |
| `<leader>t` | `terminal.toggle` |
| `<leader>up` | `terminal.close` |
| `<leader>s` | `opencode.status` |
| `<leader>x` | `session.export` |
| `<leader>n` | `session.new` |
| `<leader>l` | `session.list` |
| `<leader>w` | `session.tab.close` |
| `<leader>g` | `session.timeline` |
| `<leader>c` | `session.compact` |
| `<leader>1` | `session.quick_switch.1, session.tab.select.1` |
| `<leader>2` | `session.quick_switch.2, session.tab.select.2` |
| `<leader>3` | `session.quick_switch.3, session.tab.select.3` |
| `<leader>4` | `session.quick_switch.4, session.tab.select.4` |
| `<leader>5` | `session.quick_switch.5, session.tab.select.5` |
| `<leader>6` | `session.quick_switch.6, session.tab.select.6` |
| `<leader>7` | `session.quick_switch.7, session.tab.select.7` |
| `<leader>8` | `session.quick_switch.8, session.tab.select.8` |
| `<leader>9` | `session.quick_switch.9, session.tab.select.9` |
| `<leader>0` | `session.tab.select.10` |
| `<leader>m` | `model.list` |
| `<leader>a` | `agent.list` |
| `<leader>y` | `messages.copy` |
| `<leader>u` | `session.undo` |
| `<leader>r` | `session.redo` |
| `<leader>return` | `prompt.queue` |
| `<leader>i` | `prompt.images.view` |

## The table

240 command IDs.

### app (9)

| ID | Default | What it does |
| --- | --- | --- |
| `app.exit` | `ctrl+c,ctrl+d,<leader>q` | Exit the application |
| `app.clear` | `ctrl+l` | Clear the screen in mini |
| `app.debug` | `none` | Toggle debug panel |
| `app.console` | `none` | Toggle console |
| `app.scrap` | `none` | Open scrap screen |
| `app.toggle.animations` | `none` | Toggle animations |
| `app.toggle.file_context` | `none` | Toggle file context |
| `app.toggle.diffwrap` | `none` | Toggle diff wrapping |
| `app.toggle.paste_summary` | `none` | Toggle paste summary |

### command (1)

| ID | Default | What it does |
| --- | --- | --- |
| `command.palette.show` | `ctrl+p` | List available commands |

### help (1)

| ID | Default | What it does |
| --- | --- | --- |
| `help.show` | `none` | Open help dialog |

### docs (1)

| ID | Default | What it does |
| --- | --- | --- |
| `docs.open` | `none` | Open documentation |

### opencode (3)

| ID | Default | What it does |
| --- | --- | --- |
| `opencode.settings` | `none` | Open settings |
| `opencode.status` | `<leader>s` | View status |
| `opencode.debug` | `none` | View debug info |

### server (1)

| ID | Default | What it does |
| --- | --- | --- |
| `server.pair` | `none` | Pair device |

### service (1)

| ID | Default | What it does |
| --- | --- | --- |
| `service.restart` | `none` | Restart service |

### location (1)

| ID | Default | What it does |
| --- | --- | --- |
| `location.reload` | `none` | Reload configuration |

### diff (25)

| ID | Default | What it does |
| --- | --- | --- |
| `diff.open` | `none` | Open diff viewer |
| `diff.close` | `escape,q` | Close diff viewer |
| `diff.down` | `j,down` | Move diff viewer down |
| `diff.up` | `k,up` | Move diff viewer up |
| `diff.page.down` | `pagedown,ctrl+f` | Page diff viewer down |
| `diff.page.up` | `pageup,ctrl+b` | Page diff viewer up |
| `diff.half_page.down` | `ctrl+d` | Scroll diff viewer down half a page |
| `diff.half_page.up` | `ctrl+u` | Scroll diff viewer up half a page |
| `diff.first` | `gg,home` | Go to the start of the diff |
| `diff.last` | `shift+g,end` | Go to the end of the diff |
| `diff.toggle` | `none` | Deprecated: file tree is mouse-controlled |
| `diff.expand` | `none` | Deprecated: file tree is mouse-controlled |
| `diff.expand_all` | `none` | Deprecated: file tree is mouse-controlled |
| `diff.collapse` | `none` | Deprecated: file tree is mouse-controlled |
| `diff.switch_focus` | `none` | Deprecated: keyboard navigation always controls the diff |
| `diff.next_hunk` | `]` | Jump to next diff hunk |
| `diff.previous_hunk` | `[` | Jump to previous diff hunk |
| `diff.next_file` | `n,alt+down` | Jump to next diff file |
| `diff.previous_file` | `p,alt+up` | Jump to previous diff file |
| `diff.toggle_file_tree` | `b` | Toggle diff viewer file tree |
| `diff.single_patch` | `s` | Toggle single patch view |
| `diff.switch_source` | `d` | Switch diff viewer source |
| `diff.toggle_view` | `v` | Toggle diff viewer split or unified view |
| `diff.mark_reviewed` | `m` | Toggle selected diff file reviewed |
| `diff.help` | `?,shift+?,shift+/` | Show more diff viewer shortcuts |

### prompt (18)

| ID | Default | What it does |
| --- | --- | --- |
| `prompt.editor` | `<leader>e` | Open external editor |
| `prompt.submit` | `none` | Submit prompt |
| `prompt.queue` | `<leader>return` | Queue prompt |
| `prompt.editor_context.clear` | `none` | Clear editor context |
| `prompt.images.view` | `<leader>i` | View image attachments |
| `prompt.skills` | `none` | Open skill selector |
| `prompt.stash` | `none` | Stash prompt |
| `prompt.stash.pop` | `none` | Pop stashed prompt |
| `prompt.stash.list` | `none` | List stashed prompts |
| `prompt.clear` | `ctrl+c` | Clear input field |
| `prompt.paste` | `?` | ? |
| `prompt.history.previous` | `up` | Previous history item |
| `prompt.history.next` | `down` | Next history item |
| `prompt.autocomplete.prev` | `up,ctrl+p` | Move to previous autocomplete item |
| `prompt.autocomplete.next` | `down,ctrl+n` | Move to next autocomplete item |
| `prompt.autocomplete.hide` | `escape` | Hide autocomplete |
| `prompt.autocomplete.select` | `return` | Select autocomplete item |
| `prompt.autocomplete.complete` | `tab` | Complete autocomplete item |

### theme (3)

| ID | Default | What it does |
| --- | --- | --- |
| `theme.switch` | `none` | List available themes |
| `theme.switch_mode` | `none` | Switch between light and dark theme mode |
| `theme.mode.lock` | `none` | Lock or unlock theme mode |

### session (70)

| ID | Default | What it does |
| --- | --- | --- |
| `session.sidebar.toggle` | `<leader>b` | Toggle sidebar |
| `session.toggle.scrollbar` | `none` | Toggle session scrollbar |
| `session.export` | `<leader>x` | Export session to editor |
| `session.copy` | `none` | Copy session transcript |
| `session.copy.id` | `none` | Copy session ID |
| `session.move` | `none` | Manage workspaces |
| `session.new` | `<leader>n` | Create a new session |
| `session.list` | `<leader>l` | List all sessions |
| `session.tab.next` | `ctrl+tab,alt+down` | Switch to next open session tab |
| `session.tab.previous` | `ctrl+shift+tab,alt+up` | Switch to previous open session tab |
| `session.tab.history.back` | `none` | Go back in session tab history |
| `session.tab.history.forward` | `ctrl+i` | Go forward in session tab history |
| `session.tab.next_unread` | `alt+shift+down` | Switch to next unread session tab |
| `session.tab.previous_unread` | `alt+shift+up` | Switch to previous unread session tab |
| `session.tab.close` | `<leader>w` | Close current session tab |
| `session.tab.reopen` | `ctrl+shift+t` | Reopen last closed session tab |
| `session.timeline` | `<leader>g` | Show session timeline |
| `session.fork` | `none` | Fork session from message |
| `session.rename` | `ctrl+r` | Rename session |
| `session.delete` | `ctrl+d` | Delete session |
| `session.share` | `none` | Share current session |
| `session.unshare` | `none` | Unshare current session |
| `session.interrupt` | `escape` | Interrupt current session |
| `session.background` | `ctrl+b` | Background blocking session tools |
| `session.compact` | `<leader>c` | Compact the session |
| `session.aside` | `none` | Ask a side question |
| `session.cd` | `none` | Change working directory |
| `session.queued_prompts` | `<leader>q` | Manage queued prompts |
| `session.toggle.exploration_grouping` | `none` | Toggle related tool call grouping |
| `session.verbosity.cycle` | `none` | Cycle transcript verbosity |
| `session.child.first` | `down` | Toggle subagent picker |
| `session.child.next` | `right` | Go to next child session |
| `session.child.previous` | `left` | Go to previous child session |
| `session.parent` | `up` | Go to parent session |
| `session.pin.toggle` | `ctrl+f` | Pin or unpin session in the session list |
| `session.quick_switch.1` | `<leader>1` | Switch to session in quick slot 1 |
| `session.quick_switch.2` | `<leader>2` | Switch to session in quick slot 2 |
| `session.quick_switch.3` | `<leader>3` | Switch to session in quick slot 3 |
| `session.quick_switch.4` | `<leader>4` | Switch to session in quick slot 4 |
| `session.quick_switch.5` | `<leader>5` | Switch to session in quick slot 5 |
| `session.quick_switch.6` | `<leader>6` | Switch to session in quick slot 6 |
| `session.quick_switch.7` | `<leader>7` | Switch to session in quick slot 7 |
| `session.quick_switch.8` | `<leader>8` | Switch to session in quick slot 8 |
| `session.quick_switch.9` | `<leader>9` | Switch to session in quick slot 9 |
| `session.tab.select.1` | `<leader>1,ctrl+1` | Switch to session tab 1 |
| `session.tab.select.2` | `<leader>2,ctrl+2` | Switch to session tab 2 |
| `session.tab.select.3` | `<leader>3,ctrl+3` | Switch to session tab 3 |
| `session.tab.select.4` | `<leader>4,ctrl+4` | Switch to session tab 4 |
| `session.tab.select.5` | `<leader>5,ctrl+5` | Switch to session tab 5 |
| `session.tab.select.6` | `<leader>6,ctrl+6` | Switch to session tab 6 |
| `session.tab.select.7` | `<leader>7,ctrl+7` | Switch to session tab 7 |
| `session.tab.select.8` | `<leader>8,ctrl+8` | Switch to session tab 8 |
| `session.tab.select.9` | `<leader>9,ctrl+9` | Switch to session tab 9 |
| `session.tab.select.10` | `<leader>0,ctrl+0` | Switch to session tab 10 |
| `session.page.up` | `pageup,ctrl+alt+b` | Scroll messages up by one page |
| `session.page.down` | `pagedown,ctrl+alt+f` | Scroll messages down by one page |
| `session.line.up` | `ctrl+alt+y` | Scroll messages up by one line |
| `session.line.down` | `ctrl+alt+e` | Scroll messages down by one line |
| `session.half.page.up` | `ctrl+alt+u` | Scroll messages up by half page |
| `session.half.page.down` | `ctrl+alt+d` | Scroll messages down by half page |
| `session.first` | `ctrl+g,home,alt+home` | Navigate to first message |
| `session.last` | `ctrl+alt+g,end` | Navigate to last message |
| `session.message.next` | `none` | Navigate to next message |
| `session.message.previous` | `none` | Navigate to previous message |
| `session.message.user.next` | `none` | Navigate to next user message |
| `session.message.user.previous` | `none` | Navigate to previous user message |
| `session.messages_last_user` | `alt+end` | Navigate to last user message |
| `session.undo` | `<leader>u` | Undo message |
| `session.redo` | `<leader>r` | Redo message |
| `session.toggle.thinking` | `none` | Toggle thinking blocks visibility |

### pane (2)

| ID | Default | What it does |
| --- | --- | --- |
| `pane.focus.left` | `<leader>left` | Focus session pane |
| `pane.focus.right` | `<leader>right` | Focus right pane |

### terminal (5)

| ID | Default | What it does |
| --- | --- | --- |
| `terminal.select` | `<leader>down` | Select terminal |
| `terminal.toggle` | `<leader>t` | Toggle terminal pane |
| `terminal.close` | `<leader>up` | Close terminal pane |
| `terminal.suspend` | `ctrl+z` | Suspend terminal |
| `terminal.title.toggle` | `none` | Toggle terminal title |

### open (1)

| ID | Default | What it does |
| --- | --- | --- |
| `open.menu` | `ctrl+o` | Open recent sessions and projects |

### queued_prompt (2)

| ID | Default | What it does |
| --- | --- | --- |
| `queued_prompt.undo` | `ctrl+u` | Undo queued prompt |
| `queued_prompt.delete` | `ctrl+d` | Delete queued prompt |

### stash (1)

| ID | Default | What it does |
| --- | --- | --- |
| `stash.delete` | `ctrl+d` | Delete stash entry |

### model (7)

| ID | Default | What it does |
| --- | --- | --- |
| `model.dialog.provider` | `ctrl+a` | Open provider list from model dialog |
| `model.dialog.favorite` | `ctrl+f` | Toggle model favorite status |
| `model.list` | `<leader>m` | List available models |
| `model.cycle_recent` | `f2` | Next recently used model |
| `model.cycle_recent_reverse` | `shift+f2` | Previous recently used model |
| `model.cycle_favorite` | `none` | Next favorite model |
| `model.cycle_favorite_reverse` | `none` | Previous favorite model |

### mcp (1)

| ID | Default | What it does |
| --- | --- | --- |
| `mcp.list` | `none` | List MCP servers |

### provider (1)

| ID | Default | What it does |
| --- | --- | --- |
| `provider.connect` | `none` | Connect integration |

### agent (3)

| ID | Default | What it does |
| --- | --- | --- |
| `agent.list` | `<leader>a` | List agents |
| `agent.cycle` | `shift+tab` | Next agent |
| `agent.cycle.reverse` | `none` | Previous agent |

### variant (2)

| ID | Default | What it does |
| --- | --- | --- |
| `variant.cycle` | `ctrl+t` | Cycle model variants |
| `variant.list` | `none` | List model variants |

### messages (1)

| ID | Default | What it does |
| --- | --- | --- |
| `messages.copy` | `<leader>y` | Copy message |

### input (36)

| ID | Default | What it does |
| --- | --- | --- |
| `input.submit` | `return` | Submit input |
| `input.newline` | `shift+return,ctrl+return,alt+return,ctrl+j` | Insert newline in input |
| `input.move.left` | `left,ctrl+b` | Move cursor left in input |
| `input.move.right` | `right,ctrl+f` | Move cursor right in input |
| `input.move.up` | `up` | Move cursor up in input |
| `input.move.down` | `down` | Move cursor down in input |
| `input.select.left` | `shift+left` | Select left in input |
| `input.select.right` | `shift+right` | Select right in input |
| `input.select.up` | `shift+up` | Select up in input |
| `input.select.down` | `shift+down` | Select down in input |
| `input.line.home` | `ctrl+a` | Move to start of line in input |
| `input.line.end` | `ctrl+e` | Move to end of line in input |
| `input.select.line.home` | `ctrl+shift+a` | Select to start of line in input |
| `input.select.line.end` | `ctrl+shift+e` | Select to end of line in input |
| `input.visual.line.home` | `alt+a` | Move to start of visual line in input |
| `input.visual.line.end` | `alt+e` | Move to end of visual line in input |
| `input.select.visual.line.home` | `alt+shift+a` | Select to start of visual line in input |
| `input.select.visual.line.end` | `alt+shift+e` | Select to end of visual line in input |
| `input.buffer.home` | `none` | Move to start of buffer in input |
| `input.buffer.end` | `none` | Move to end of buffer in input |
| `input.select.buffer.home` | `shift+home` | Select to start of buffer in input |
| `input.select.buffer.end` | `shift+end` | Select to end of buffer in input |
| `input.delete.line` | `ctrl+shift+d` | Delete line in input |
| `input.delete.to.line.end` | `ctrl+k` | Delete to end of line in input |
| `input.delete.to.line.start` | `ctrl+u` | Delete to start of line in input |
| `input.backspace` | `backspace,shift+backspace` | Backspace in input |
| `input.delete` | `ctrl+d,delete,shift+delete` | Delete character in input |
| `input.undo` | `ctrl+-,super+z` | Undo in input |
| `input.redo` | `ctrl+.,super+shift+z` | Redo in input |
| `input.word.forward` | `alt+f,alt+right,ctrl+right` | Move word forward in input |
| `input.word.backward` | `alt+b,alt+left,ctrl+left` | Move word backward in input |
| `input.select.word.forward` | `alt+shift+f,alt+shift+right` | Select word forward in input |
| `input.select.word.backward` | `alt+shift+b,alt+shift+left` | Select word backward in input |
| `input.delete.word.forward` | `alt+d,alt+delete,ctrl+delete` | Delete word forward in input |
| `input.delete.word.backward` | `ctrl+w,ctrl+backspace,alt+backspace` | Delete word backward in input |
| `input.select.all` | `super+a` | Select all in input |

### composer (11)

| ID | Default | What it does |
| --- | --- | --- |
| `composer.subagent.up` | `up` | Previous subagent |
| `composer.subagent.down` | `down` | Next subagent |
| `composer.subagent.select` | `return` | Navigate to subagent |
| `composer.subagent.interrupt` | `ctrl+d` | Interrupt subagent |
| `composer.shell.up` | `up` | Previous shell |
| `composer.shell.down` | `down` | Next shell |
| `composer.shell.select` | `return` | View shell output |
| `composer.shell.kill` | `ctrl+d` | Kill shell command |
| `composer.terminal.up` | `up,k` | Previous terminal |
| `composer.terminal.down` | `down,j` | Next terminal |
| `composer.terminal.select` | `return` | Select terminal |

### dialog (19)

| ID | Default | What it does |
| --- | --- | --- |
| `dialog.select.prev` | `up,ctrl+p` | Move to previous dialog item |
| `dialog.select.next` | `down,ctrl+n` | Move to next dialog item |
| `dialog.select.page_up` | `pageup` | Move up one page in dialog |
| `dialog.select.page_down` | `pagedown` | Move down one page in dialog |
| `dialog.select.home` | `home` | Move to first dialog item |
| `dialog.select.end` | `end` | Move to last dialog item |
| `dialog.select.submit` | `return` | Submit selected dialog item |
| `dialog.prompt.submit` | `return` | Submit dialog prompt |
| `dialog.integration.rename` | `ctrl+r` | Rename integration account |
| `dialog.integration.delete` | `ctrl+d` | Delete integration account |
| `dialog.worktree.generate` | `tab` | Generate worktree name |
| `dialog.move_session.new` | `ctrl+a` | New worktree |
| `dialog.move_session.move` | `ctrl+m` | Move session to worktree |
| `dialog.move_session.delete` | `ctrl+d` | Delete worktree |
| `dialog.move_session.refresh` | `ctrl+r` | Refresh worktrees |
| `dialog.mcp.toggle` | `space` | Toggle MCP server |
| `dialog.plugins.error` | `space` | View plugin error |
| `dialog.plugins.update` | `ctrl+u` | Update plugin from plugin dialog |
| `dialog.plugins.check` | `ctrl+r` | Check for plugin updates from plugin dialog |

### permission (1)

| ID | Default | What it does |
| --- | --- | --- |
| `permission.prompt.fullscreen` | `ctrl+f` | Toggle permission prompt fullscreen |

### plugins (2)

| ID | Default | What it does |
| --- | --- | --- |
| `plugins.toggle` | `return` | Toggle plugin |
| `plugins.list` | `none` | Open plugin manager dialog |

### which-key (11)

| ID | Default | What it does |
| --- | --- | --- |
| `which-key.toggle` | `ctrl+alt+k` | Toggle which-key panel |
| `which-key.layout.toggle` | `ctrl+alt+shift+k` | Switch which-key layout |
| `which-key.pending.toggle` | `ctrl+alt+shift+p` | Toggle which-key pending preview |
| `which-key.group.previous` | `ctrl+alt+left,ctrl+alt+[` | Previous which-key group |
| `which-key.group.next` | `ctrl+alt+right,ctrl+alt+]` | Next which-key group |
| `which-key.scroll.up` | `ctrl+alt+up,ctrl+alt+p` | Scroll which-key up |
| `which-key.scroll.down` | `ctrl+alt+down,ctrl+alt+n` | Scroll which-key down |
| `which-key.page.up` | `ctrl+alt+pageup` | Page which-key up |
| `which-key.page.down` | `ctrl+alt+pagedown` | Page which-key down |
| `which-key.home` | `ctrl+alt+home` | Jump to first which-key binding |
| `which-key.end` | `ctrl+alt+end` | Jump to last which-key binding |

## Plugin commands

A plugin's command ID cannot be rebound from `cli.json`: the `keybinds` object is validated against
the built-in ID set above, and a plugin's ID only exists once that plugin is loaded. And an action
with no command ID at all cannot be bound by any config — that is what this package is for.

Keep plugin IDs outside the `opencode.*` prefix. That prefix is reserved for built-ins, and OpenCode
treats a `plugins` entry whose target starts with it as a match against built-ins rather than
something to load, so a plugin ID under it can never be enabled or disabled by name.

## Notes

**An aside that may use tools.** `session.generate` (and the built-in `/btw`) cannot call tools by
definition. A plugin can get both context and tools by forking, asking, then removing:

```ts
const fork = await client.session.fork({ sessionID: parentID })   // inherits context
await client.session.update({ sessionID: fork.id, permissions: rules })
await client.session.prompt({ sessionID: fork.id, text: question })
// poll session.context(): done when the last assistant message finishes without tool-calls
await client.session.remove({ sessionID: fork.id })
```

V2 permission actions are `read`, `edit` (covers write and patch), `shell`, `glob`, `grep`,
`webfetch`, `websearch`. Writing the V1 names `write` or `bash` matches nothing, silently.

**What `session.undo` does not cover.** It rolls the session and the files back together, but only
for files inside the session's active directory, inside a Git repository, and not ignored. Commits,
processes, databases, network calls and shell side effects are untouched — so "experiment in the
main session and undo it" does not hold; use a worktree or a temporary directory with read-only
rules instead.
