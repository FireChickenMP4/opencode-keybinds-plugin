import { Plugin } from "@opencode/plugin";

/**
 * 服务端入口。这个插件做的事全在终端侧（见 tui.ts），这里是个空壳：被自动发现的
 * 插件要按发布包的布局来摆，服务端和 TUI 入口放在一起。
 */
export default Plugin.define({
  id: "opencode.keybinds.server",
  setup() {},
});
