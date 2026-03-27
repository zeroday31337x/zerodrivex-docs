# zdxai

Local, on-device AI assistant with RAG, MCP tools, LoRA fine-tuning, and intelligent query routing. No cloud. No API keys. Your data stays on your machine.

## Features

- **Private by default** — All inference runs locally using quantized GGUF models. Nothing leaves your device.
- **RAG** — Ingest documents (txt, md, json, csv, pdf) and get answers grounded in your own data.
- **MCP Tools** — Filesystem, shell, web search, system info — all with deny-by-default permissions.
- **LoRA Fine-Tuning** — Train custom adapters from your conversations, documents, or JSONL datasets.
- **Embedding Gravity Wells** — A learned routing system that improves over time, steering queries to the best model or platform.
- **Multi-Platform Routing** — Optional integration with OpenAI, Anthropic, Gemini, and xAI when local isn't enough.
- **Workflows** — Chain tools together into multi-step automated sequences.
- **Cross-Platform** — Linux, macOS, Windows, Termux (Android).

## Quick Start

```bash
git clone https://github.com/ZeroDriveX1/zdxai.git && cd zdxai
bash install.sh
```

That's it. `install.sh` handles dependencies, model download (~3.5 GB), database init, and license activation in one shot.

**Options:**
```bash
bash install.sh --all          # include PDF, MCP, training, web extras
bash install.sh --gpu          # build llama-cpp-python with CUDA
bash install.sh --skip-models  # skip download (models already present)
```

See [INSTALL.md](INSTALL.md) for detailed setup, GPU acceleration, and troubleshooting.

## Usage

```
you> What is the capital of France?
zdxai> The capital of France is Paris.

you> /ingest ~/notes/project-spec.md
Ingested: project-spec.md (12 chunks)

you> What does the spec say about the API?
zdxai> According to the project spec, the API uses REST endpoints with...
```

See [USER_GUIDE.md](USER_GUIDE.md) for the full command reference, RAG, tools, training, and workflows.

## System Requirements

| Component | Minimum | Recommended |
|-----------|---------|-------------|
| Python | 3.10+ | 3.11+ |
| RAM | 6 GB | 8+ GB |
| Disk | 5 GB free | 10 GB free |
| GPU | Not required | NVIDIA with CUDA (optional) |

Systems with less than 6 GB RAM automatically use the smaller TinyLlama model.

## Models

| Model | Size | Use |
|-------|------|-----|
| SmolLM2 1.7B (Q4_K_M) | ~3.5 GB | Primary inference |
| TinyLlama 1.1B (Q4_K_M) | ~1.8 GB | Low-RAM fallback |
| all-MiniLM-L6-v2 | ~43 MB | Embeddings (RAG + routing) |

## Documentation

- [INSTALL.md](INSTALL.md) — Installation, models, GPU setup, troubleshooting
- [USER_GUIDE.md](USER_GUIDE.md) — Commands, RAG, tools, training, workflows
- [SECURITY.md](SECURITY.md) — Security model and reporting
- [PRIVACY_POLICY.md](PRIVACY_POLICY.md) — Data handling policy
- [TERMS_OF_SERVICE.md](TERMS_OF_SERVICE.md) — Terms of use
- [LICENSE](LICENSE) — MIT License

## License

MIT
