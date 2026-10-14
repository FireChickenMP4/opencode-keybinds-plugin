import { Plugin } from "@opencode/plugin/tui";
import type { Keybind, Options } from "./src/types";
import { modules } from "./src/commands/index";

/**
 * 终端侧入口：把每个模块的命令收进同一个 keymap 层。
 *
 * 放在仓库根目录不是风格选择：opencode 解析目录形态的插件时只找 `<目录>/index.ts`
 * 和 `<目录>/tui.ts`，不会读 package.json 的 exports。
 */
export default Plugin.define({
  id: "keybinds",
  setup(context) {
    const commands: Keybind[] = [];
    const disposers: Array<() => void> = [];
    const options: Options = {
      notify: context.options.notify === true,
    };

    // 注册只跑一次；下面的层工厂会被反复求值，所以只读这份已经建好的数组。
    for (const module of modules) {
      const registration = module(context, options);
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
