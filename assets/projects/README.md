# assets/projects/ — real job photos

Photos of Craig's actual installs go here. They are referenced from
`content/projects.yml` (the `photos:` field) and shown in the "Recent work"
section on the matching town and service pages.

## Naming

`<town>-<suburb>-<what>.jpg` — lowercase, hyphens, no spaces. Examples:

    hervey-bay-torquay-turret-camera.jpg
    maryborough-granville-nvr-screen.jpg
    gympie-widgee-solar-camera-gate.jpg

## Size

Drop the original in at any size — a phone photo straight off Craig is fine.
Before it goes live, resize to **1600 px on the long edge, JPEG, under 400 KB**
(the build does not resize project photos automatically). If you have `sharp`
installed you can batch it:

    npx sharp-cli --input "assets/projects/*.jpg" --output assets/projects/ resize 1600

## What not to put here

- No stock photos. Stock lives elsewhere and is logged in `assets/IMAGE_CREDITS.md`.
- No identifiable faces without the customer's OK.
- No photo of a job Craig has not approved for the website.
