<script lang="ts">
  /* eslint-disable-next-line import/default, import/no-named-as-default,
  import/no-named-as-default-member */
  import { onMount } from "svelte";
  import { setIcon } from "obsidian";
  import twemoji from "@twemoji/api";
  import { createEventDispatcher } from "svelte";
  import type { IconString } from "src/bannerData";
  import { settings } from "src/settings/store";

  const dispatch = createEventDispatcher();

  export let icon: IconString;
  export let isEmbed: boolean;

  let iconElement: HTMLElement;

  const handleIconClick = () => {
    if (isEmbed) return;
    dispatch("open-icon-modal");
  };

  $: ({ headerDecor: decor, useTwemoji } = $settings);
  $: ({ type, value } = icon);

  $: if (iconElement) {
    if (type === "lucide") {
      setIcon(iconElement, value);
    } else {
      iconElement.innerHTML =
        type === "emoji" && useTwemoji
          ? twemoji.parse(value, { className: "banner-emoji" })
          : value;
    }
  }

  onMount(() => {
    if (type === "lucide") {
      setIcon(iconElement, value);
    }
  });
</script>

<div
  bind:this={iconElement}
  class="banner-icon"
  class:embed={isEmbed}
  class:text-icon={type === "text"}
  class:emoji-icon={type === "emoji"}
  class:lucide-icon={type === "lucide"}
  class:shadow={decor === "shadow"}
  class:border={decor === "border"}
  role="button"
  tabindex="-1"
  on:click={handleIconClick}
  on:keydown={(e) => e.code === "Enter" && handleIconClick()}
>
  {#if type !== "lucide"}
    <!-- content will be set by the reactive statement -->
  {/if}
</div>

<style lang="scss">
  .banner-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: calc(1em + 8px);
    width: calc(1em + 8px);
    border-radius: 6px;
    transition: ease 0.2s background;
    font-size: var(--banners-icon-font-size);

    &:not(.embed) {
      cursor: pointer;
      &:hover {
        background: #aaa4;
      }
    }

    &.emoji-icon {
      &.shadow :global(img.banner-emoji) {
        filter: drop-shadow(0 0 3px var(--background-primary));
      }
      &.border :global(img.banner-emoji) {
        filter: drop-shadow(1px 1px 0 var(--background-primary))
          drop-shadow(1px -1px 0 var(--background-primary))
          drop-shadow(-1px 1px 0 var(--background-primary))
          drop-shadow(-1px -1px 0 var(--background-primary));
      }
    }

    :global(img.banner-emoji) {
      height: 1em;
      width: 1em;
    }

    &.lucide-icon :global(svg) {
      height: 1em;
      width: 1em;
    }
  }
</style>
