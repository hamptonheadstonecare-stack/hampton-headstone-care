# Hampton Headstone Care

Static website for **Hampton Headstone Care** — headstone, monument, and stone
cleaning on the East End of Long Island. By Jason Bono.

This is a plain HTML / CSS / JS site, designed to be hosted free on
**GitHub Pages** with a custom domain. There is no build step. Edit the files,
push to `main`, the site updates within a minute.

## Pages

| File           | What it is                                         |
| -------------- | -------------------------------------------------- |
| `index.html`   | Home                                               |
| `services.html`| Services & pricing                                 |
| `gallery.html` | Before & after gallery                             |
| `finder.html`  | Headstone Finder · Cedar Lawn Cemetery             |
| `booking.html` | 5-step booking form                                |
| `contact.html` | Contact form & details                             |

Shared header, footer, styles, and components live in:

```
styles/main.css            ← all CSS
scripts/shared.jsx         ← Nav, Footer, Mark, BASlider, Placeholder, etc.
scripts/finder.jsx         ← Finder logic (only loaded on finder.html)
```

## Editing the site

Most edits are simple text changes — open the page in a code editor, change the
copy, save, and push.

A few common spots:

- **Phone number** — search every file for `(631) 604-8002` and replace.
- **Email** — search for `hello@hamptonheadstonecare.com`.
- **Pricing** — `services.html` (full table) and `index.html` (teaser cards),
  plus the `STONE_SIZES` and `ADDONS` arrays inside `booking.html`.
- **Gallery** — add a new before/after pair to the `PAIRS` array near the
  bottom of `gallery.html`. Drop the two image files into `images/ba/` first.

## Forms

All forms (booking, contact, finder add/edit) post to a single Google Apps
Script endpoint configured in `scripts/shared.jsx`:

```js
window.FORM_ENDPOINT = "https://script.google.com/.../exec";
```

That script writes to a Google Sheet and emails Jason. The Finder also reads
back from the same endpoint to display approved entries.

To swap the endpoint, edit that one line.

## Deploying — see `DEPLOY.md`

Step-by-step instructions for putting this on GitHub Pages and pointing your
domain at it are in [`DEPLOY.md`](./DEPLOY.md).
