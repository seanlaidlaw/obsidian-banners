import { MarkdownRenderChild, TFile } from "obsidian";
import Banner from '../banner/Banner.svelte';

export class BannerRenderChild extends MarkdownRenderChild {
  banner: Banner | undefined;
  bannerData: BannerMetadata;
  file: TFile;

  constructor(containerEl: HTMLElement, bannerData: BannerMetadata, file: TFile) {
    super(containerEl);
    this.banner = undefined;
    this.bannerData = bannerData;
    this.file = file;
  }

  onload() {
    this.containerEl.addClass('obsidian-banner-wrapper');

    this.banner = new Banner({
      target: this.containerEl,
      props: {
        bannerData: this.bannerData,
        file: this.file
      }
    });
  }

  onunload() {}
}