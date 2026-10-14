import { readFile, rename, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";
import type { Context, Registration } from "../types";

/**
 * 切换 cli.json 里的 attention.sound。
 *
 * 这是「第二类」命令的示范：第一类只动插件自己的内存，这一类去动插件之外的东西。
 *
 * 为什么非写文件不可：
 *   - attention.sound 没有命令 ID。内置的 240 个可绑定 ID 里一条 attention.* / *.sound
 *     都没有，官方唯一的入口是设置面板（opencode.settings → Alerts → Sounds）。
 *   - 插件也绕不过去。插件的 context.attention.notify({ sound }) 会先过一道
 *     `if (!config.attention.sound) return;`，开关关着时一律被跳过。
 *   - CLI 自己有个 cli.config.update（保留格式 + 文件锁），但那是 CLI 进程内的 RPC，
 *     插件的 client 是连服务端的，够不着。
 *
 * 代价：cli.json 只在 TUI 启动时读一次，所以这个开关改完要重启 TUI 才生效。
 */

/** cli.json 里我们关心的部分，以及必须原样带过去的其它键。 */
interface CliConfig {
  $schema?: string;
  attention?: {
    notifications?: boolean;
    sound?: boolean;
    volume?: number;
  };
  [key: string]: unknown;
}

const SCHEMA = "https://opencode.ai/v2/cli.json";

/** 与 CLI 自己解析配置的方式一致：环境变量优先，否则 ~/.config/opencode。 */
function cliConfigPath(): string {
  const dir = process.env.OPENCODE_CONFIG_DIR ?? join(homedir(), ".config", "opencode");
  return join(dir, "cli.json");
}

async function readConfig(file: string): Promise<CliConfig> {
  return JSON.parse(await readFile(file, "utf8")) as CliConfig;
}

/** 先写临时文件再改名，避免写到一半把配置截断。 */
async function writeConfig(file: string, config: CliConfig): Promise<void> {
  const tmp = `${file}.tmp`;
  await writeFile(tmp, `${JSON.stringify(config, null, 2)}\n`, "utf8");
  await rename(tmp, file);
}

export function register(context: Context): Registration {
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
          let config: CliConfig = {};
          try {
            config = await readConfig(file);
          } catch (cause) {
            // 文件不存在是正常的（从没配过），其它错误一律不碰。
            if ((cause as NodeJS.ErrnoException).code !== "ENOENT") throw cause;
            config = { $schema: SCHEMA };
          }

          const on = config.attention?.sound !== true;
          const attention = { ...(config.attention ?? {}), sound: on };
          await writeConfig(file, { ...config, attention });

          context.ui.toast.show({
            message: `alert sounds: ${on ? "ON" : "OFF"}（已写入 cli.json，重启 TUI 生效）`,
            variant: on ? "success" : "info",
            duration: 5000,
          });
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
