/* eslint-disable @typescript-eslint/no-this-alias */
import { Plugin } from 'obsidian';
import { unloadAllBanners } from './banner';
import BannerEvents from './BannerEvents';
import loadCommands from './commands';
import { loadExtensions } from './editing';
import { loadPostProcessor } from './reading';
import { loadSettings } from './settings';
import type { BannerSettings } from './settings/structure';

export let plug: BannersPlugin;

export default class BannersPlugin extends Plugin {
  settings!: BannerSettings;
  events!: BannerEvents;

  async onload() {
    console.log('Loading Banners 2...');
    plug = this;
    this.events = new BannerEvents();

    await loadSettings();
    loadPostProcessor();
    loadExtensions();
    loadCommands();
    this.events.loadEvents();
  }

  async onunload() {
    console.log('Unloading Banners 2...');

    unloadAllBanners();
  }
}
