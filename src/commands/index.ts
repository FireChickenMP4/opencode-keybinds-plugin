import type { Module } from "../types";
import { register as alertSounds } from "./alert-sounds";

/**
 * 所有 keybind 模块。加一条新命令就往这里加一行，它会同时拿到快捷键、
 * Ctrl+P 面板项和 /斜杠命令。
 */
export const modules: readonly Module[] = [alertSounds];
