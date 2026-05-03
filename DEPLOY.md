# Deploying Hampton Headstone Care

This guide walks you from "files on my computer" to "hamptonheadstonecare.com
loads in a browser." Free, no servers, no build tools.

You'll do this **once**. After that, every time you push a change to GitHub,
the site updates on its own within ~1 minute.

---

## Part 1 · Push the site to GitHub

### 1. Make a GitHub account
Go to <https://github.com/join>. Use whatever email you want — this is the
account that "owns" the site.

### 2. Create a new repository
- Click the **+** in the top-right → **New repository**.
- **Repository name:** `hampton-headstone-care` (anything is fine — this name
  isn't shown publicly when you use a custom domain).
- **Public** (Pages won't work on Private without a paid plan).
- Leave everything else unchecked. Click **Create repository**.

### 3. Upload the files
On the new empty repo page, click **uploading an existing file**.

Drag in **everything in this folder** — every file and every subfolder
(`index.html`, `services.html`, `styles/`, `scripts/`, `images/`, `CNAME`,
the README, etc.).

Scroll down, write a commit message like `initial site`, click **Commit
changes**.

### 4. Turn on GitHub Pages
- In your repo, click **Settings** (top tab).
- In the left sidebar, click **Pages**.
- Under **Source**, choose **Deploy from a branch**.
- **Branch:** `main`, **Folder:** `/ (root)`. Click **Save**.

Wait ~30 seconds, refresh. You should see a green box with a URL like
`https://YOUR-USERNAME.github.io/hampton-headstone-care/`. Click it — your
site is live.

---

## Part 2 · Point your custom domain at it

The `CNAME` file in this repo already contains `hamptonheadstonecare.com`.
GitHub reads that file automatically.

### 1. Buy the domain (if you haven't yet)
Use any registrar — Namecheap, Google Domains, GoDaddy, Cloudflare. They all
work the same.

### 2. Add DNS records at your registrar

Log in to your registrar, find the **DNS** or **DNS settings** page for
`hamptonheadstonecare.com`, and add these records:

**Apex (the bare domain `hamptonheadstonecare.com`)** — add four `A` records:

| Type | Host / Name | Value           |
| ---- | ----------- | --------------- |
| A    | `@`         | `185.199.108.153` |
| A    | `@`         | `185.199.109.153` |
| A    | `@`         | `185.199.110.153` |
| A    | `@`         | `185.199.111.153` |

**`www` subdomain** — add one `CNAME` record:

| Type  | Host / Name | Value                            |
| ----- | ----------- | -------------------------------- |
| CNAME | `www`       | `YOUR-USERNAME.github.io`        |

(Replace `YOUR-USERNAME` with your actual GitHub username. Keep the trailing
dot if your registrar requires it.)

Some registrars use `@` for the apex, some use the bare domain itself, some
leave the field blank — they all mean the same thing.

### 3. Tell GitHub about the domain
- Repo → **Settings** → **Pages**.
- Under **Custom domain**, type `hamptonheadstonecare.com`. Click **Save**.
- It will run a DNS check. **This can take anywhere from 10 minutes to a
  full day** depending on your registrar.
- Once the check passes, check the **Enforce HTTPS** box. (It may be greyed
  out for an hour while GitHub gets a free SSL certificate — wait, refresh,
  check again.)

### 4. You're done
Visit `https://hamptonheadstonecare.com` — your site is live with HTTPS.

---

## Updating the site later

The simplest way: edit files **directly on GitHub**.

1. Go to your repo.
2. Click any file (e.g. `services.html`).
3. Click the pencil icon (top-right of the file).
4. Make your edit.
5. Scroll down, write a short note about what you changed, click **Commit changes**.
6. Wait ~1 minute. The site updates.

For bigger changes, install **GitHub Desktop** (<https://desktop.github.com>)
— it's a plain app that lets you edit files locally and "push" them to GitHub
with one button.

---

## Troubleshooting

**The site loads but says "page not found" on /services**
GitHub Pages serves files exactly. Use full paths in links (`services.html`,
not `/services`). The site already does this.

**My DNS check has been pending for hours**
This is normal. Some registrars take up to 24 hours. Use
<https://dnschecker.org> to confirm your `A` records resolve to the GitHub
IPs above. If they do, GitHub will catch up.

**HTTPS won't enable**
Wait. After your custom domain is verified, GitHub provisions a free Let's
Encrypt certificate behind the scenes — usually within an hour, sometimes a
few hours. The **Enforce HTTPS** checkbox un-greys when it's ready.

**A form submission disappeared**
Forms post to the Google Apps Script endpoint configured in
`scripts/shared.jsx`. Open that file, look for `window.FORM_ENDPOINT`, and
make sure the URL is right. Test the URL in a browser — it should return a
JSON object.

**I broke something**
Every commit on GitHub is a snapshot. In the repo, click **commits** (above
the file list), find the last good one, and click **Revert** to undo the
breaking change.
