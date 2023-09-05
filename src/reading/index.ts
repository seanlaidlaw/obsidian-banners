import type { MarkdownPostProcessor } from 'obsidian';

import BannerRenderChild, { type Embedded } from './BannerRenderChild';

import { plug } from 'src/main';
import { getSetting } from 'src/settings';
import { extractBannerData } from 'src/utils';

// Helper to associate a banner to a specific view/document
const currentBanners: Record<string, BannerRenderChild> = {};

const rerender = () => {
  for (const banner of Object.values(currentBanners)) {
    banner.unload();
  }

  for (const leaf of plug.app.workspace.getLeavesOfType('markdown')) {
    const { previewMode } = leaf.view;
    const sections = previewMode.renderer.sections.filter((s) => (
      s.el.querySelector('pre.frontmatter, .internal-embed')
    ));
    for (const section of sections) {
      section.rendered = false;
      section.html = '';
    }
    previewMode.renderer.queueRender();
  }
};

const isEmbedded = (containerEl: HTMLElement): Embedded => {
  if (containerEl.closest('.internal-embed')) return 'internal';
  return false;
};

const postprocessor: MarkdownPostProcessor = (el, ctx) => {
  // Only process the frontmatter
  if (!el.querySelector(':scope > pre.frontmatter')) return;

  const {
    docId,
    containerEl,
    frontmatter,
    sourcePath
  } = ctx;

  const embed = isEmbedded(containerEl);
  if (embed && !getSetting('showInInternalEmbed')) return;

  const file = plug.app.metadataCache.getFirstLinkpathDest(sourcePath, '/')!;
  const bannerData = extractBannerData(frontmatter);

  if (bannerData.source) {
    const banner = new BannerRenderChild(el, ctx, bannerData, file, embed);
    if (currentBanners[docId]) currentBanners[docId].prepareSwap = true;
    ctx.addChild(banner);
    currentBanners[docId] = banner;
  } else {
    delete currentBanners[docId];
  }
};

export const loadPostProcessor = () => {
  plug.registerMarkdownPostProcessor(postprocessor);
  rerender();
};

export const registerReadingBannerEvents = () => {
  plug.registerEvent(
    plug.events.on('setting-change', (changed) => {
      if ('showInInternalEmbed' in changed) rerender();
    })
  );
};

/* BUG: This doesn't rerender banners in internal embeds within an Editing view.
Reload app or manually edit the view/contents to fix */
export const unloadReadingViewBanners = () => {
  rerender();
};
