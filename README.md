# Jonah Rothman

Personal site, live at [jonahrothman.com](https://www.jonahrothman.com/).

It is one static page: `index.html` and `style.css`, plus images, fonts, and a few smaller projects hosted as subfolders. There is no build step. Pushing to `main` deploys to Vercel.

## Preview locally

```bash
python3 -m http.server
```

Open [http://localhost:8000](http://localhost:8000).

## What's in the repo

| Path | What it is |
| --- | --- |
| `index.html`, `style.css` | The site |
| `photos/`, `Assets/`, `Rezzy/` | Photos and project screenshots |
| `Poppins/` | Self-hosted Poppins files |
| `Jonah_Rothman_Resume_Fall_2026.pdf` | Resume linked from the hero |
| `StockBot/`, `celtics/`, `music-guesser/`, `poker-payout-calculator/` | Smaller projects served from their own folders |
| `robots.txt`, `sitemap.xml` | Search files for the homepage |

`Old Resumes/` and `pr-assets/` are archives and review screenshots. They are not linked from the page.

## Analytics

Page views use the script at the bottom of `index.html` (`/_vercel/insights/script.js`). Leave it as those two tags. This site does not need `@vercel/analytics` or a `package.json`.
