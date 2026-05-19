# Master prompt + secrets commands — Docker Hub + GitHub Actions (+ optional EC2)

Copy **§1** into Cursor (or any AI) for a **new** repo. Use **§2** from your machine to set secrets. Adjust placeholders.

---

## §1 — Master prompt (paste into AI)

```
You are helping me add production Docker + GitHub Actions for this repository.

### Goal
- On push to `main`, GitHub Actions must **build a Docker image** and **push** to Docker Hub as `[DOCKERHUB_USER]/[IMAGE_NAME]` with tags `:latest` and `:${{ github.sha }}`.
- Platform: **linux/amd64**.
- Use **Docker Buildx**, **GHA cache** (`cache-from` / `cache-to` type=gha).
- Permissions: `contents: read`, `actions: write`.

### Stack assumptions (edit if wrong)
- Language/framework: [e.g. Next.js 15 App Router / Node API / other]
- If Next.js: enable **`output: "standalone"`** in next.config and use a **multi-stage Dockerfile** (deps → builder → runner) that copies `.next/standalone`, `.next/static`, `public`, runs `node server.js`, **`USER` non-root**, **`EXPOSE 3000`**, **`HOSTNAME=0.0.0.0`**.
- Add `.dockerignore` (exclude `node_modules`, `.next`, `.git`, `.env`, `.env.*`, keep `.env.example` if useful).

### Build-time vs runtime (critical)
- **Bake only** env vars that must be fixed at build (e.g. `NEXT_PUBLIC_*` for Next.js). List them explicitly:
  [LIST EACH NEXT_PUBLIC_* OR SAY "none"]
- **Do not** bake secrets (DB URIs, API keys, session tokens). Those belong in **runtime** (docker-compose `environment` / EC2 `.env`), injected on the server or via a deploy step — not in the image layers.

### Workflow file
- Single workflow YAML under `.github/workflows/` (name it clearly, e.g. `docker-build-push.yml`).
- Jobs:
  1) **build-and-push**: checkout → setup-buildx → docker/login-action → docker/build-push-action with `push: true` and the tags above.
  2) **(Optional)** **deploy**: only if I ask for EC2 — `needs: build-and-push`, `appleboy/scp-action@v1` to upload `docker-compose.yml` to `/home/${{ secrets.EC2_USER }}/[DEPLOY_DIR]`, then `appleboy/ssh-action` to `docker compose pull && up -d` and optional prune. Deploy must write a minimal `.env` for compose (e.g. `DOCKERHUB_USER`, `HOST_PORT`) using `envs:` passthrough — same pattern as Prestige Kollur.

### Docker Hub
- Image repo: `[DOCKERHUB_USER]/[IMAGE_NAME]` (IMAGE_NAME must match Hub repo name, usually lowercase).
- Login uses secrets `DOCKER_USERNAME` and `DOCKER_PASSWORD` (Hub **access token**, not account password if 2FA).

### Deliverables
1. `Dockerfile` + `.dockerignore` (+ next.config change if Next.js).
2. `.github/workflows/*.yml` as specified.
3. Short comment block at top of workflow listing **required GitHub Actions secrets** by name.
4. Do **not** add unrelated refactors, extra workflows, or duplicate deploy paths unless requested.
5. If something is ambiguous, ask one concise question before inventing env vars or ports.

### My values (fill before sending)
- DOCKERHUB_USER (GitHub secret DOCKER_USERNAME): [e.g. iamcyberster]
- IMAGE_NAME: [e.g. sign-fashion]
- Deploy dir on EC2 (if deploy): [e.g. ~/sign-fashion]
- Host port mapping (if deploy): [e.g. 3002:3000 — avoid clash with other containers]
```

---

## §2 — `gh` commands — set secrets (run locally)

Prerequisites: [GitHub CLI](https://cli.github.com/) installed, `gh auth login`, shell **cd into the target repo** so secrets attach to the **correct** repository.

### Docker Hub (always)

```bash
cd /path/to/your-repo

gh secret set DOCKER_USERNAME --body "YOUR_DOCKERHUB_USERNAME"
gh secret set DOCKER_PASSWORD
# paste Docker Hub access token, Enter, then Ctrl+D
```

### EC2 deploy (only if workflow has a deploy job)

```bash
gh secret set EC2_HOST --body "YOUR_PUBLIC_OR_ELASTIC_IP"
gh secret set EC2_USER --body "ec2-user"
gh secret set EC2_SSH_KEY < ~/.ssh/your-ec2-private-key.pem
```

Amazon Linux → `ec2-user`; Ubuntu → `ubuntu`.

### Next.js `NEXT_PUBLIC_*` from `.env.local` (pattern — edit variable names)

Never commit `.env.local`. From repo root:

```bash
gh secret set NEXT_PUBLIC_SITE_URL --body "$(grep '^NEXT_PUBLIC_SITE_URL=' .env.local | cut -d= -f2-)"

# Optional: quote-stripped prefill-style values
gh secret set NEXT_PUBLIC_WHATSAPP_PREFILL_MESSAGE --body "$(grep '^NEXT_PUBLIC_WHATSAPP_PREFILL_MESSAGE=' .env.local | cut -d= -f2- | sed 's/^\"//;s/\"$//')"
```

Repeat `gh secret set NAME --body "$(grep …)"` for **each** key your **Dockerfile build-args** reference.

If `grep` fails, set manually:

```bash
gh secret set SOME_SECRET_NAME
# type value, Enter, Ctrl+D
```

### Runtime secrets (prefer **not** in GitHub if avoidable)

If your deploy job writes server `.env` from GitHub (like `ENQUIRY_SCRIPT_URL`), use:

```bash
gh secret set MONGODB_URI
gh secret set ADMIN_SESSION_TOKEN
```

**Better for DB/passwords:** keep them **only on EC2** in `~/your-app/.env` and **do not** echo them in workflow logs; extend the deploy script carefully if you must sync from GH.

### Verify secret **names** exist (values hidden)

```bash
gh secret list
```

### Wrong repo?

```bash
gh repo view
```

Switch directory or: `gh repo set-default OWNER/REPO`.

---

## §3 — Sanity checklist before blaming CI

| Check | Command / action |
|-------|------------------|
| Correct repo | `gh repo view` from project folder |
| Workflow path | `.github/workflows/*.yml` committed on `main` |
| Docker Hub token | `docker logout && docker login -u USER` locally |
| EC2 SSH | `ssh -i key.pem user@host` works |
| Deploy dir | `docker-compose.yml` exists on server or scp step in workflow |
| Port clash on EC2 | `sudo ss -tlnp \| grep -E ':80\|:443\|:YOUR_PORT'` |

---

## §4 — Optional: minimal `docker-compose.yml` pattern (EC2)

```yaml
services:
  web:
    image: ${DOCKERHUB_USER}/${IMAGE_NAME}:latest
    ports:
      - "${HOST_PORT:-3000}:3000"
    restart: unless-stopped
    env_file:
      - .env.runtime   # create on server; gitignored — DB, keys, etc.
```

Keep **image name** in sync with `IMAGE_NAME` in the workflow.

---

## Appendix — This repo (`sign-fashion`)

- Required GitHub Actions secrets are listed in the comment block at the top of `.github/workflows/docker-build-push.yml`.
- Server layout: `~/sign-fashion/` with root [`docker-compose.yml`](../docker-compose.yml) and a **`.env`** containing `SIGN_FASHION_IMAGE=<DOCKER_USERNAME>/sign-fashion:latest` plus runtime secrets (`MONGODB_URI`, `ADMIN_SESSION_TOKEN`, `CLOUDINARY_*`).
- Set secrets with [`gh secret set`](https://cli.github.com/manual/gh_secret_set) or the GitHub UI — no helper scripts in-repo.

---

*Reusable template; copy §1 into any project’s AI chat or duplicate this file elsewhere.*
