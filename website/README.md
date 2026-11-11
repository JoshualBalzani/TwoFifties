# TwoFifties product website

[Italiano](README.it.md)

A static, bilingual product website for GitHub Pages. It introduces the app, shows localized screenshots, links to the public ZIP and provides Docker, Node.js and TrueNAS installation guidance. It does not host the app API or any financial records.

## Preview

The complete beginner guides are maintained in [`docs/INSTALLATION.md`](../docs/INSTALLATION.md) and [`docs/INSTALLATION.it.md`](../docs/INSTALLATION.it.md). Pages renders those same files with a section index and copyable commands. Edit the manuals to update GitHub and Pages together; the deployment workflow rebuilds automatically. `npm run site:test` checks guide anchors, four viewport widths, both themes, copied commands and the documented Node startup.

With Node.js 24+ and the repository dependencies installed:

```sh
npm run site:build
npm run site:preview
```

Open the local URL printed by the preview server. `npm run site:test` checks metadata, links, mobile/desktop layouts, theme persistence, both languages and the future custom-domain configuration. Browser tests use installed Edge on Windows or Playwright Chromium elsewhere.

The build copies only website assets, local fonts and selected fictitious documentation screenshots into `.site-dist/`. Runtime directories such as `backups/` are never copied. The app's own Docker deployment is independent.

## Publish with GitHub Pages

1. Open the repository **Settings → Pages**.
2. Under publishing source, choose **GitHub Actions**.
3. In **Actions**, select **Publish TwoFifties website** and use **Run workflow** on `main`.
4. The deployment URL appears in the workflow environment. The configured initial address is `https://joshualbalzani.github.io/TwoFifties/`.

The workflow always builds and checks the site. If Pages is not enabled, it leaves a setup note in the workflow summary and skips deployment; a successful build alone does not mean the site is online. Later pushes affecting the website rebuild and deploy automatically after Pages is enabled. This follows [GitHub's custom workflow model](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

## Change to a purchased domain

Edit **`website/site.config.json` → `baseUrl`** to the final HTTPS address, for example `https://www.your-domain.example/`. The builder derives canonical URLs, language alternates, social image URLs, sitemap and the domain file from that value; links to local assets remain relative.

Also configure the custom domain in repository Pages settings and the required DNS records at your domain provider. Verify domain ownership and enable HTTPS once GitHub has issued the certificate. Follow the current [GitHub custom-domain instructions](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site); the DNS depends on whether you use an apex or a subdomain. Updating the config file alone does not change DNS or the Pages account setting.

## Help people find it

- Put the live website address in the repository **About → Website** field.
- Add relevant GitHub topics: `expense-tracker`, `expense-sharing`, `split-bills`, `couples`, `roommates`, `self-hosted`, `personal-finance`, `budgeting`, `material-design`, `docker`, `truenas`, `nodejs`, `open-source`.
- Use `website/assets/social-en.png` or `social-it.png` as the repository social preview.
- Share the website and direct ZIP in relevant communities where project sharing is welcome. Do not describe a source ZIP as a Windows installer: users still need Docker, Node.js or a compatible NAS.
- Create versioned GitHub Releases as the app matures, with a short changelog and tested source archives. The website currently links to the latest `main` source ZIP, which anyone can download without a GitHub account.

GitHub describes how [topics help categorize repositories](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/classifying-your-repository-with-topics).

## Google Search

Use the URL-prefix Search Console property `https://joshualbalzani.github.io/TwoFifties/` and submit `https://joshualbalzani.github.io/TwoFifties/sitemap.xml` in the Sitemaps report. Inspect the homepage and guide in both languages with URL Inspection and request indexing if needed. The HTML tag alone does not prove ownership verification or indexing.

Google reads the host-root `robots.txt`, not the file under `/TwoFifties/`; submit the sitemap directly in Search Console. A missing root file does not block crawling. With a dedicated domain configured at its root, the build puts the file in the correct location automatically. The sitemap omits optional `lastmod` rather than reporting artificial update dates on every build.

The website includes visible static text, localized titles/descriptions, canonical URLs, `hreflang`, SoftwareApplication structured data, social cards, `sitemap.xml` and `robots.txt`. No ratings, endorsements or reviews are fabricated.

After publishing, add an **URL-prefix property** in [Google Search Console](https://search.google.com/search-console/) for the exact site address. If using HTML-tag verification, copy the token into `googleSiteVerification` in `website/site.config.json`, publish, then complete verification. Submit `sitemap.xml` and inspect the homepage and English URL. With a custom domain, a DNS-verified domain property is another option.

On a project site, `robots.txt` lives under `/TwoFifties/`; crawlers normally look for it at the domain root, so submit the sitemap directly in Search Console. With a custom domain at `/`, the generated robots file is at the root.

Google explicitly says that requesting indexing or submitting a sitemap does **not** guarantee inclusion or an immediate result. See [Google's recrawl guidance](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl). Use Search Console to measure discovery rather than promising search placement.
