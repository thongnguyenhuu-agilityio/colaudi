// PreToolUse hook for Bash: blocks commands that skip the git hooks or reach production.
// Exit 2 blocks the call and shows stderr to Claude. Prefix deny rules in settings.json miss
// chained commands such as `cd x && vercel --prod`, so each chained segment is checked.
let input = '';
for await (const chunk of process.stdin) input += chunk;
const cmd = JSON.parse(input).tool_input?.command ?? '';

// Program at the start of the command or right after ; && || | ( — not inside quoted text or heredocs.
const at = prog => String.raw`(?:^|[;&|(]\s*)(?:\w+=\S*\s+)*(?:npx\s+)?${prog}\b[^\n;&|]*`;
const rules = [
  [new RegExp(at('git') + String.raw`\bcommit\b[^\n;&|]*(--no-verify|\s-[a-zA-Z]*n[a-zA-Z]*\b)`), 'Do not skip the pre-commit/commit-msg hooks. Fix the failure instead.'],
  [new RegExp(at('git') + String.raw`(--unset[^\n;&|]*core\.hooksPath|core\.hooksPath(=|\s+)(?!\.githooks\b)[^\s;&|-])`), 'Do not change core.hooksPath; the project hooks live in .githooks/.'],
  // Read-only subcommands (`vercel ls --prod`, `vercel inspect`) are allowed.
  [new RegExp(at(String.raw`vercel\b(?!\s+(?:ls|list|inspect|logs|env)\b)`) + String.raw`(--prod\b|\bpromote\b)`), 'Production only changes when Thong pushes main. Use a preview deployment.'],
  [new RegExp(at('git') + String.raw`\bpush\b[^\n;&|]*(\smain\b|:main\b|--force|\s-f\b)`), 'Never push main or force-push from a session. Ask Thong.'],
  [new RegExp(at('npm') + String.raw`run board\b[^\n;&|]*\b(wipe|rm|close|open)\b`), 'Organiser board commands change a live leaderboard. Ask Thong to run them.']
];
for (const [re, why] of rules) {
  if (re.test(cmd)) { console.error(`Blocked by .claude/hooks/guard-bash.mjs: ${why}`); process.exit(2); }
}
