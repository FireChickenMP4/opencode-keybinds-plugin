import { cliConfigPath, readCliConfig, withSection, writeCliConfig } from "../cli-config";
import type { Context, Options, Registration } from "../types";

/**
 * 切换 cli.json 里 attention.sound。
 *
 * attention.sound 没有命令 ID，官方唯一的入口是设置面板（Alerts → Sounds）；
 * 插件也绕不过去 —— context.attention.notify({ sound }) 会先过一道
 * `if (!config.attention.sound) return;`，开关关着时一律被跳过。
 *
 * cli.json 是启动时读的，所以改完通常要重启 TUI。文件不存在就新建，JSON 坏掉
 * 就报错且不写盘。
 */
export function register(context: Context, options: Options): Registration {
  return {
    command: {
      id: "keybinds.sound",
      title: "切换提示音（alert sounds）",
      description: "改 cli.json 的 attention.sound，重启 TUI 生效",
      group: "keybinds",
      bind: "<leader>k",
      palette: true,
      slash: { name: "sound" },
      async run() {
        const file = cliConfigPath();
        try {
          const config = await readCliConfig(file);
          const on = config.attention?.sound !== true;
          await writeCliConfig(file, withSection(config, "attention", { sound: on }));

          if (options.notify) {
            context.ui.toast.show({
              message: `alert sounds: ${on ? "ON" : "OFF"}（重启 TUI 生效）`,
              variant: on ? "success" : "info",
            });
          }
        } catch (cause) {
          const why = cause instanceof Error ? cause.message : String(cause);
          await context.ui.dialog.alert({
            title: "提示音",
            message: `改不了 ${file}：\n\n${why}\n\n配置没有被改动。`,
          });
        }
      },
    },
  };
}
