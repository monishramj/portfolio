# TV portfolio

## Structure

Header → centered TV → named channel selector → selected channel details → GitHub activity → contact.

The TV is the single browsing surface. Remove the separate featured gallery, portrait flip, and toolkit preview. Keep the existing colors, model, résumé, and project data.

## Browsing

- Start on About me: portrait on the TV and the original biography underneath.
- Show About me plus three featured project thumbnails, each with a readable title.
- More projects reveals the remaining four channel buttons in the same selector.
- Previous / next browse every channel; reveal the extra channels automatically when one is selected.
- Mark the selected thumbnail with a border, an On air label, and `aria-pressed`.
- Keep the TV and controls in fixed positions when content changes. Never autoplay.
- Keep channel selection in the URL so reload, direct links, and browser Back work.

## Content

A project channel shows its image on the TV, followed by its title, description, technologies, and source / demo links. About me shows the original bio, degree, and expandable current roles.

Fit project images inside the screen without cropping charts or screenshots. Enlarge image opens the original image in a native dialog with Escape, focus trapping, and focus return. Text stays outside the small TV screen for legibility.

## Accessibility and mobile

Use ordinary labeled buttons, visible focus, at least 44px targets, and a polite channel announcement. Two thumbnail columns on mobile; no hidden swipe-only navigation. Keep the TV facing forward so its screen remains legible. A portrait/project image fallback preserves browsing if WebGL cannot load.

## Validation

Check all eight channels, next/previous wraparound, expanded archive selection, original biography, matching images and links, URL reload/Back, image dialog keyboard behavior, mobile overflow, and contribution loading failures.
