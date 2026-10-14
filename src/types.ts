import type { Context, KeymapCommand } from "@opencode/plugin/tui/context";

export type { Context };

/** 一条命令。opencode 要求进面板/斜杠必须有 id，所以这里把它收窄成必填。 */
export type Keybind = KeymapCommand & { readonly id: string };

/** 模块注册后交回的东西：命令本身，外加可选的清理函数。 */
export interface Registration {
  readonly command: Keybind;
  readonly dispose?: () => void;
}

/**
 * 一个 keybind 模块。
 *
 * 注册只在 setup 里跑一次，订阅事件之类的副作用都放这里；命令定义会被收进
 * 同一个 keymap 层，而层工厂由 opencode 反复求值，必须保持纯净。
 */
export type Module = (context: Context) => Registration;
