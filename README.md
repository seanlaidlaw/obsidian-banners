# Banners

This is a fork of [termi's fork](https://github.com/termi/obsidian-banners) of the [Banners](https://github.com/noatpad/obsidian-banners) 
plugin updated to work with updated obisidan versions (v1.6.7), and to share the fields from the [make.md](https://github.com/make-md/makemd) plugin.

Specifically, I have modified it to read the 'banner' and 'sticker' yaml fields created by the [make.md](https://github.com/make-md/makemd) plugin, to have banners on mobile, as make.md crashes if enabled on mine.

## Installation
- **Manual install**:
  - Go to the latest release [here](https://github.com/seanlaidlaw/obsidian-banners/releases/latest), & download the files listed there (`main.js`, `styles.css`, & `manifest.json`)
  - Go to your vault's plugin folder (`<vault>/.obsidian/plugins`), create a folder called `obsidian-banners`, and move your files in there.
  - Reload Obsidian & enable the plugin in Settings -> Community Plugins

---

## Description

An [Obsidian](https://obsidian.md/) plugin to add banner images (and icons) to your notes!

![banners-demo](https://raw.githubusercontent.com/noatpad/obsidian-banners/master/images/banners.gif)

## Usage
Within an open note, you can use the **Add/Change banner with local image** command to select a local image as a banner for your note; or you can copy an image URL & run the **Paste banner from clipboard** command to paste the URL as a banner image. You can also drag the banner image to reposition the image, as well as use the **Lock/Unlock banner position** command to "lock" the banner's position in place and vice versa.

If you want to remove the banner, you can run the **Remove banner** command to do just that.

You can also add a banner icon, using **Add/Change emoji icon** & selecting an emoji of your choice. You can also change an existing emoji by clicking on it in the preview.

Similarly, you can remove the icon with the **Remove icon** command.

### Advanced
Under the hood, this plugin uses your file's YAML frontmatter/metadata to store info about your banner. So you can also input it manually or use other plugins to input it for you. These are the fields you can use thus far (using the default frontmatter field prefix):

```yaml
# The source path of your banner image, can be a URL or an internal link to an image.
# NOTE: Make sure it's wrapped in quotes to avoid parsing errors, such as "![[file]]"
banner: string

# The banner icon. Can be an emoji (format emoji//) or any string really (but it'll only accept the first letter)
sticker: string

# The banner's center position. A number between 0-1
banner_x: number
banner_y: number

# Determines if the banner is locked in place or not
banner_lock: boolean
```

## Settings
### Banners
- **Banner height**: Specify how tall the banner image should be for each note.
- **Banner style**: Change how your banner looks in your notes. There are currently 2 options:
  - *Solid*: A simple, sharp-container banner image.
  - *Gradient*: A banner that fades into transparency, inspired by [this forum post](https://forum.obsidian.md/t/header-images-with-css/18917).

| Solid | Gradient |
| --- | --- |
| ![solid-style](https://raw.githubusercontent.com/noatpad/obsidian-banners/master/images/solid.png) | ![gradient-style](https://raw.githubusercontent.com/noatpad/obsidian-banners/master/images/gradient.png) |

- **Show banner in internal embed**: Choose if the banner should be displayed in the inline internal embed within a file.
- **Preview internal banner height**: If **Show banner in internal embed** is on, this setting determines how tall the banner image in the embed should be.

![inception](https://raw.githubusercontent.com/noatpad/obsidian-banners/master/images/inception.png)

- **Show banner in preview embed**: Choose if the banner should be displayed in the preview embed for the *Page Preview* plugin.
- **Preview embed banner height**: If **Show banner in preview embed** is on, this setting determines how tall the banner image in the embed should be.

![embed](https://raw.githubusercontent.com/noatpad/obsidian-banners/master/images/embed.png)

- **Frontmatter field name**: If set, use a customizable frontmatter field to use for banner data. For example, the default value `banner` will use the fields `banner_x`, `banner_y`, and so on.
- **Banner drag modifier key**: Set a modifier key that must be usedto drag a banner. For example, setting it to *Shift* means you'll have to drag with Shift to move it. This can help avoid accidental banner shifts.

### Banner Icons
- **Horizontal alignment**: Align the icon horizontally within the note's boundaries. If set to *Custom*, you can input a custom offset, relative to the note's left boundary. This can be any valid [CSS length value](https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Values_and_units#lengths).
- **Vertical alignment**: Align the icon vertically relative to a banner's bottom edge, if a banner is present. If set to *Custom*, you can input a custom offset, relative to the center of a banner's lower edge if any. This can also be any valid [CSS length value](https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Values_and_units#lengths).
- **Use Twemoji**: If set, it will use Twemoji (Twitter's emoji set) instead of the stock emoji on your device. This is on by default as there is better emoji support using this.

### Local Image Modal
- **Show preview images**: Enable this to allow preview images to be seen when searching through the modal.
- **Suggestions limit**: Limit the amount of suggestions the modal can display at once.
  - ***NOTE:** If you set this to a high number, while having **Show preview images** on, you may experience some slowdowns while searching.*
- **Banners folder**: Specify a folder to exclusively search for image files within the modal. If unset, the modal will search the entire vault by default.

### Experimental
- **Allow mobile drag**: Choose if you can adjust the banner positioning on mobile devices by dragging.
  - ***NOTE:** This setting is experimental since it acts a bit funny with the mobile app's already built-in touch gestures.*

## Develop
Once you run `npm i`, you can build the files into `dist/` easily by running `npm run build`.

You can also have it watch your files and update your plugin within your vault while you develop by running `npm run dev`. Just make sure to set `DEVDIR` in `./esbuild.config.mjs` to your testing vault beforehand.
