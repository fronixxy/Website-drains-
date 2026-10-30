# Website-drains-
Pryde Group Corp (prydegroupcorp.com) — basement waterproofing and drains, price guide for Toronto & GTA.

Static site, no build step. Open `index.html` in a browser, or host the folder on GitHub Pages / Netlify.

- `index.html` — hero with quote form, services, price guide (interior / exterior / drains), cost estimator, process, city rebates, service areas, FAQ
- `styles.css`, `script.js` — styling and interactivity

Before publishing, confirm the contact details (phone (647) 916-9046, info@prydegroupcorp.com, 4279 Woodington Dr, Mississauga)
and the business claims (warranty length, licensing/WSIB).

To serve the site on prydegroupcorp.com, add the domain under Settings → Pages → Custom domain and point the domain's DNS to GitHub Pages.
Quote form: create a free form at https://formspree.io with the email that should receive requests,
copy its ID (the part after `/f/` in the endpoint) and replace `YOUR_FORM_ID` in `index.html`.
Until then the form runs in demo mode and only shows the thank-you message.
