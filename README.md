# Sound Paintings

## Getting started

To get started, make sure [`yarn`](https://yarnpkg.com/) is installed (it's just a fancier version of `npm`). Then, install and run!

```bash
# Install dependencies
yarn

# Run the app in dev mode - http://localhost:3000
yarn start
```

## Adding paintings

Painting data is contained in the folder `public/paintings`, with each painting and its corresponding sounds stored in a folder with an appropriate name. The configuration for where and how these sounds are shown is in `src/paintings.json`.

You can add new paintings by adding a new folder with an `image.jpg` and sound files (prefer mp3 files for size). Then, add an entry to the `src/paintings.json` file. Make sure the `key` parameter matches the folder name for the painting.
