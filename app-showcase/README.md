# App Showcase

A full-screen carousel that highlights a set of apps. Each slide has a hero image, a short description and a button that opens the app in a new tab. It is a static site with no build step, and it can be installed as an app on phones and desktops.

## How it behaves

- Slides advance automatically every 6 seconds. The active dot fills to show the countdown.
- Autoplay stops for good on the first interaction: arrow, dot, swipe, arrow keys, or keyboard focus entering the carousel.
- Autoplay is off if the visitor has "reduce motion" turned on.
- Works from phone to desktop. Arrows sit at the bottom corners on small screens and at the sides on wide ones.
- Swipe left or right on touch screens. Left and right arrow keys work everywhere.

## Add your apps

Edit `apps.js`. Each entry has a name, tagline, description, button label, URL, image and two colors. The four apps in there are placeholders.

Put your own hero images in `images/` and point `image` at them. Landscape images at least 1600×1000 work best. Keep the left side of the image fairly calm, since text sits there on wide screens.

## Run it locally

```sh
python3 -m http.server 8080
```

Open http://localhost:8080. Service workers only run on `localhost` or HTTPS, so opening `index.html` straight from disk shows the page but not the install features.

## Deploy

Any static host works. For GitHub Pages: push to GitHub, then go to Settings → Pages and publish from the `main` branch root. All paths are relative, so it also works under a sub-path like `username.github.io/app-showcase/`.

## Installing

- Chrome, Edge and Android: an "Install app" button appears in the header when the browser allows it.
- iPhone and iPad: in Safari, tap Share, then Add to Home Screen.

## Updating after you deploy

`sw.js` caches the site so it loads offline. When you change any file, bump the `CACHE` name at the top of `sw.js` (for example `app-showcase-v2`) so installed copies pick up the change. If you add or rename images, update the `SHELL` list in the same file.

## Rename the site

Change the title and header text in `index.html`, and `name` and `short_name` in `manifest.webmanifest`. The theme color is set in both of those files too.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Page shell and header |
| `styles.css` | Layout, responsive rules, dots and arrows |
| `apps.js` | The list of apps |
| `app.js` | Carousel behavior and install button |
| `manifest.webmanifest` | Install details: name, colors, icons |
| `sw.js` | Offline support |
| `icons/` | App icons, including a maskable one for Android |
| `images/` | Hero images |
