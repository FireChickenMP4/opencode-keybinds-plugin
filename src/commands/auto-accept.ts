import type { Context, Registration } from "../types";

/**
 * 把当前会话的权限规则改成自动放行，再按一次还原。
 *
 * 走的是原生那条路：client.session.update({ permissions })，也就是服务端
 * ctx.permission.rules() 的同一个机制。不写文件、不用重启、即时生效。
 *
 * 语义对着 --auto（"auto-approve permissions that are not explicitly denied"）：
 * 把当前 agent 规则里 effect 为 "ask" 的改成 "allow"，deny 原样保留，所以明确
 * 拒绝的东西依然被拒。关掉时清空会话规则，回到 agent 自己的规则。
 *
 * 按会话生效，跟内置的 session.permissions 一致；子会话继承建立时的规则。
 */

/** 一条权限规则，字段与 client 的 PermissionRule 一致。 */
export interface Rule {
  action: string;
  resource: string;
  effect: "allow" | "deny" | "ask";
}

export function register(context: Context): Registration {
  const location = context.location ?? context.data.location.default();

  /** 会话正在用的 agent 的规则；认不出 agent 就退回第一个非子代理。 */
  function agentRules(agentID: string | undefined): Rule[] {
    const agents = context.data.location.agent.list(location) ?? [];
    const agent = agents.find((entry) => entry.id === agentID) ?? agents.find((entry) => entry.mode !== "subagent");
    return agent?.permissions ?? [];
  }

  return {
    command: {
      id: "keybinds.auto-accept",
      title: "切换自动放行（auto accept）",
      description: "只对当前会话生效；agent 规则里的 ask 改成 allow，deny 保留",
      group: "keybinds",
      bind: "<leader>p",
      palette: true,
      slash: { name: "autoaccept" },
      async run() {
        const route = context.ui.router.current();
        if (route.type !== "session") {
          context.ui.toast.show({
            message: "自动放行是按会话来的：先进一个会话再按",
            variant: "warning",
          });
          return;
        }

        try {
          const session = context.data.session.get(route.sessionID);
          // 会话自己带规则 = 开着。状态从会话读，不自己记账，重启也不会错位。
          const open = (session?.permissions?.length ?? 0) > 0;
          const next: Rule[] = open
            ? []
            : agentRules(session?.agent).map((rule) =>
                rule.effect === "ask" ? { ...rule, effect: "allow" as const } : rule,
              );

          await context.client.session.update({ sessionID: route.sessionID, permissions: next });
          context.ui.toast.show({
            message: open
              ? "自动放行：关（本会话恢复 agent 自己的规则）"
              : `自动放行：开（本会话 ${next.length} 条规则，deny 仍然生效）`,
            variant: open ? "success" : "warning",
          });
        } catch (cause) {
          const why = cause instanceof Error ? cause.message : String(cause);
          context.ui.toast.show({ message: `改权限失败：${why}`, variant: "error" });
        }
      },
    },
  };
}
