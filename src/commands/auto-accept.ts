import { cliConfigPath, readCliConfig, withSection, writeCliConfig } from "../cli-config";
import type { Context, Options, Registration } from "../types";

/**
 * 切换 cli.json 里 session.permissions 的模式。
 *
 * 这就是设置面板 Session → Permissions 改的那一项。CLI 自己读它的方式是：
 *
 *     get mode() { return t.auto ? "autoaccept" : r.data.session.permissions }
 *
 * 所以它是**全局**的（不是按会话），打开后所有会话都不再问权限。
 *
 * 插件改不了它，只能写文件：CLI 内部有个保留格式的 cli.config.update，但那是
 * CLI 进程内的 RPC，而插件的 client 连的是服务端。改完能否被正在跑的 TUI 读到
 * 取决于它有没有在 watch 这个文件 —— 没生效就重启 TUI。
 */
export function register(context: Context, options: Options): Registration {
  return {
    command: {
      id: "keybinds.auto-accept",
      title: "切换自动放行（Session → Permissions）",
      description: "改 cli.json 的 session.permissions：prompt ↔ autoaccept",
      group: "keybinds",
      bind: "<leader>p",
      palette: true,
      slash: { name: "autoaccept" },
      async run() {
        const file = cliConfigPath();
        try {
          const config = await readCliConfig(file);
          const on = config.session?.permissions !== "autoaccept";
          await writeCliConfig(file, withSection(config, "session", { permissions: on ? "autoaccept" : "prompt" }));

          if (options.notify) {
            context.ui.toast.show({
              message: on ? "自动放行：ON（所有会话都不再问权限）" : "自动放行：OFF（改回 prompt）",
              variant: on ? "warning" : "success",
            });
          }
        } catch (cause) {
          const why = cause instanceof Error ? cause.message : String(cause);
          await context.ui.dialog.alert({
            title: "自动放行",
            message: `改不了 ${file}：\n\n${why}\n\n配置没有被改动。`,
          });
        }
      },
    },
  };
}
