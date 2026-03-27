# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| 0.1.x | Yes |

---

## Reporting a Vulnerability

If you discover a security vulnerability in zdxai, please report it responsibly.

**Do not open a public issue for security vulnerabilities.**

Instead:

1. Email the maintainer directly (or use the repository's private security reporting feature if available).
2. Include a description of the vulnerability, steps to reproduce, and potential impact.
3. Allow reasonable time for a fix before public disclosure.

We will acknowledge receipt within 72 hours and aim to provide a fix or mitigation within 14 days for critical issues.

---

## Security Model

zdxai executes on the user's device with the user's permissions. The security model operates on the following principles:

### Deny-by-Default Tool Permissions

All MCP tools default to `ask` permission. The user must explicitly approve tool executions. Tools can be permanently set to `allow`, `deny`, or `ask` via `/permit`.

### Filesystem Sandboxing

File operations block access to:

- `/etc/shadow`, `/etc/passwd`
- `/root/.ssh`, `~/.ssh`
- `/proc/`, `/sys/`, `/dev/`
- Other system-critical paths

### Shell Command Sandboxing

Shell execution blocks known dangerous patterns:

- `rm -rf /`
- `dd` (disk write operations)
- `mkfs` (filesystem formatting)
- `curl | sh`, `wget | sh` (remote code execution)
- Other destructive or escalation patterns

Shell commands have a 30-second default timeout (120s maximum) and output is truncated at 50 KB.

### Audit Logging

All tool executions are logged to the local database with:

- Tool name, action, timestamp
- Input and output summaries
- Whether execution was permitted or denied

### Network Isolation

zdxai makes no network requests unless the user explicitly invokes:

- Model downloads (`download_models.py`)
- Web search tool (`web.search`)
- Web fetch tool (`web.fetch`)

---

## Known Limitations

- The SQLite database is **not encrypted** at rest. Sensitive conversations or documents are stored in plaintext. Use full-disk encryption if this is a concern.
- Shell sandboxing uses pattern matching and is **not a security sandbox**. Determined users or crafted model outputs could potentially bypass blocked patterns. Always review tool executions.
- AI-generated tool calls depend on model behavior. Models may request unintended operations. The permission system is the primary defense.
- LoRA adapters could alter model behavior. Only use adapters from trusted sources or that you trained yourself.

---

## Recommendations

- Keep tool permissions on `ask` (default) for sensitive tools like `shell.execute` and `filesystem.write`.
- Review the tool audit log periodically (`/stats` or inspect the database directly).
- Run zdxai under a non-root user account.
- Use full-disk encryption if storing sensitive documents.
- Keep zdxai and its dependencies updated.
