import type { MarkdownPostProcessor } from 'obsidian';
import {
  createBanner,
  hasBanner,
  updateBanner,
  destroyBanner,
  shouldDisplayBanner
} from 'src/banner';
import type { BannerProps, Embedded } from 'src/banner';
import { extractBannerData } from 'src/bannerData';
import { plug } from 'src/main';
import { getSetting } from 'src/settings';
import { iterateMarkdownLeaves, registerSettingChangeEvent } from 'src/utils';

/* BUG: This doesn't rerender banners in internal embeds properly.
Reload app or manually edit the view/contents to fix */
const rerender = () => {
  for (const leaf of plug.app.workspace.getLeavesOfType('markdown')) {
    const view: any = leaf.view;
    const mode = view?.previewMode ?? view?.currentMode;
    const renderer = mode?.renderer;
    if (!renderer) continue;

    const sections = renderer.sections.filter((s: any) => (
      s.el.querySelector('pre.frontmatter, .internal-embed')
    ));
    for (const section of sections) {
      section.rendered = false;
      section.html = '';
    }
    renderer.queueRender();
  }
};

const isEmbedded = (containerEl: HTMLElement): Embedded => {
  if (containerEl.closest('.internal-embed')) return 'internal';
  if (containerEl.closest('.popover')) return 'popover';
  return false;
};

// Obsidian 1.11.x changed the reading view layout so that the element which
// receives the postprocessor callback is now inside a max-width container.
// If we attach the banner wrapper to that inner container, the banner is
// constrained to the readable line width instead of stretching across the
// whole pane. To restore the old, pane-wide banner behaviour, we try to
// attach the banner wrapper to a higher-level container that is not
// max-width constrained.
const getBannerContainer = (containerEl: HTMLElement): HTMLElement => {
  // Prefer the scrolling preview view so the banner scrolls with the note content.
  // In Obsidian 1.11.x, `.markdown-reading-view` can be a non-scrolling wrapper
  // around the actual scrolling `.markdown-preview-view`.
  const previewView =
    containerEl.closest<HTMLElement>('.markdown-preview-view') ??
    containerEl.querySelector<HTMLElement>('.markdown-preview-view');
  if (previewView instanceof HTMLElement) return previewView;

  // Prefer the markdown reading view element when available
  const readingView = containerEl.closest('.markdown-reading-view');
  if (readingView instanceof HTMLElement) return readingView;

  // Fallback to the generic view content wrapper (works in some layouts)
  const viewContent = containerEl.closest('.view-content');
  if (viewContent instanceof HTMLElement) return viewContent;

  // Old behaviour: use the immediate parent, or the element itself as a last resort
  return containerEl.parentElement ?? containerEl;
};

const postprocessor: MarkdownPostProcessor = (el, ctx) => {
  const {
    docId,
    containerEl,
    frontmatter,
    sourcePath
  } = ctx;

  // Only show banners in embeds when allowed
  const embed = isEmbedded(containerEl);
  if (
    (embed === 'internal' && !getSetting('showInInternalEmbed')) ||
    (embed === 'popover' && !getSetting('showInPopover'))
  ) return;

  const file = plug.app.metadataCache.getFirstLinkpathDest(sourcePath, '/')!;
  const bannerData = extractBannerData(frontmatter, file);

  if (shouldDisplayBanner(bannerData)) {
    const props: BannerProps = {
      ...bannerData,
      file,
      embed,
      viewType: 'reading'
    };
    if (hasBanner(docId)) {
      updateBanner(props, docId);
    } else {
      const bannerContainer = getBannerContainer(containerEl);
      createBanner(props, bannerContainer, docId);
    }
  } else {
    destroyBanner(docId);
  }
};

export const loadPostProcessor = () => {
  plug.registerMarkdownPostProcessor(postprocessor);
  rerender();
};

export const registerReadingBannerEvents = () => {
  registerSettingChangeEvent([
    'frontmatterField',
    'showInInternalEmbed',
    'useHeaderByDefault',
    'defaultHeaderValue'
  ], rerender);
  plug.registerEvent(plug.app.vault.on('rename', rerender));

  // Edge case when switching from a note with a banner to a banner with no data to postprocess
  plug.registerEvent(plug.app.workspace.on('layout-change', () => {
    iterateMarkdownLeaves((leaf) => {
      if (leaf.view && leaf.view.file && leaf.view.file.stat) {
        if (!leaf.view.file.stat.size) {
          const view: any = leaf.view;
          const docId = view.previewMode?.docId ?? view.currentMode?.docId;
          if (docId) {
            destroyBanner(docId);
          }
        }
      }
    }, 'reading');
  }));
};
