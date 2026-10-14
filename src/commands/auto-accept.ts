import type { Context, Registration } from "../types";

/**
 * 切换 opencode 的权限模式。
 *
 * cli.json 的 session.permissions 只有 "prompt" 和 "autoaccept" 两个值，改它的
 * 内置入口只有设置面板，也没有对应的命令 ID，所以这里改为自己应答审批请求。
 *
 * 开关只存在内存里，故意不持久化：重启 TUI 一定回到「照常询问」，不会留下一个
 * 自己忘掉的自动放行开关。
 */
export function register(context: Context): Registration {
  const [state, update] = context.storage.memory("autoaccept", { initial: { on: false } });

  const stop = context.data.on("permission.asked", (event) => {
    void (async () => {
      if (!state.on) return;
      const { id, sessionID, action } = event.data;
      try {
        await context.client.permission.reply({ sessionID, requestID: id, decision: "once" });
        context.ui.toast.show({
          message: `自动审批：已允许一次（${action}）`,
          variant: "warning",
          duration: 2000,
        });
      } catch {
        // 审批已经被别处回掉了（比如你自己点了弹窗），无事可做。
      }
    })();
  });

  return {
    dispose: stop,
    command: {
      id: "keybinds.autoaccept",
      title: "切换自动审批（auto accept / prompt）",
      description: "开：审批自动允许一次；关：照常询问",
      group: "keybinds",
      bind: "<leader>o",
      palette: true,
      slash: { name: "autoaccept" },
      run() {
        update((draft) => {
          draft.on = !draft.on;
        });
        context.ui.toast.show({
          message: state.on
            ? "自动审批：开（收到审批就自动允许一次）"
            : "自动审批：关（照常弹窗询问）",
          variant: state.on ? "warning" : "success",
        });
      },
    },
  };
}
