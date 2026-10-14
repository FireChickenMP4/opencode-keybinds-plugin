import { readFile, rename, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";

/**
 * cli.json 的读写。
 *
 * 这里是 CLI 自己的配置，不是服务端配置（那是 opencode.json）。插件能改它的
 * 唯一办法就是写文件：CLI 内部那个会保留格式的 cli.config.update 是 CLI 进程
 * 内的 RPC，插件的 client 连的是服务端，够不着。
 */

/** cli.json 的形状。只声明认得的键，其余原样带过去。 */
export interface CliConfig {
  $schema?: string;
  session?: {
    permissions?: "prompt" | "autoaccept";
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

export const SCHEMA = "https://opencode.ai/v2/cli.json";

/** 与 CLI 自己解析配置的方式一致：环境变量优先，否则 ~/.config/opencode。 */
export function cliConfigPath(): string {
  const dir = process.env.OPENCODE_CONFIG_DIR ?? join(homedir(), ".config", "opencode");
  return join(dir, "cli.json");
}

/** 文件不存在算空配置；JSON 坏掉则抛错，调用方负责报错并保证不写盘。 */
export async function readCliConfig(file: string): Promise<CliConfig> {
  try {
    return JSON.parse(await readFile(file, "utf8")) as CliConfig;
  } catch (cause) {
    if ((cause as NodeJS.ErrnoException).code === "ENOENT") return { $schema: SCHEMA };
    throw cause;
  }
}

/** 先写临时文件再改名，避免写到一半把配置截断。 */
export async function writeCliConfig(file: string, config: CliConfig): Promise<void> {
  const tmp = `${file}.tmp`;
  await writeFile(tmp, `${JSON.stringify(config, null, 2)}\n`, "utf8");
  await rename(tmp, file);
}
