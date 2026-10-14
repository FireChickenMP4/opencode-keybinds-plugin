import { Plugin } from "@opencode/plugin/tui";
import type { Keybind } from "./types";
import { modules } from "./commands/index";

/**
 * 终端侧入口：把每个模块的命令收进同一个 keymap 层。
 */
export default Plugin.define({
  id: "opencode.keybinds",
  setup(context) {
    const commands: Keybind[] = [];
    const disposers: Array<() => void> = [];

    // 注册只跑一次；下面的层工厂会被反复求值，所以只读这份已经建好的数组。
    for (const module of modules) {
      const registration = module(context);
      commands.push(registration.command);
      if (registration.dispose) disposers.push(registration.dispose);
    }

    context.keymap.layer(() => ({
      mode: "global",
      commands,
      bindings: commands.map((command) => command.id),
    }));

    return () => {
      for (const dispose of disposers) dispose();
    };
  },
});
