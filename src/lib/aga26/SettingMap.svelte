<script lang="ts">
  /**
   * The poster's sampling map (fig01a, the 250 x 432 pt box file) drawn by
   * fig01_setting.map_figure and saved as SVG, with the labels the poster set over it.
   * Anchors (key icons, Lake Tahoe, the scale bar) are in the map's own points:
   * data/setting_map.json.
   */
  import { C, FILES } from './theme';
  import M from './data/setting_map.json';

  const KEY = ['Baseline', 'Persisted', 'Extirpated'];
  const [tx, ty] = M.tahoe;
  const [[sx, sy]] = M.scale;
</script>

<svg
  viewBox="0 0 {M.width} {M.height}"
  class="map"
  role="img"
  aria-label="Map of California and southern Oregon showing the sampled populations: baseline, persisted, and the three extirpated populations in the south, with Lake Tahoe marked."
  fill={C.ink}
>
  <image href="{FILES}/setting_map.svg" x="0" y="0" width={M.width} height={M.height} />
  {#each KEY as label, i}
    <text x={M.key[i][0] - 10} y={M.key[i][1]} text-anchor="end" dominant-baseline="central" font-size="17">{label}</text>
  {/each}
  <line x1={tx + 4} y1={ty + 3} x2={tx + 15} y2={ty + 12} stroke={C.ink} stroke-width="1" />
  <text x={tx + 17} y={ty + 17} font-size="15">Lake Tahoe</text>
  <text x={sx} y={sy - 6} font-size="17">200km</text>
</svg>

<style>
  .map {
    display: block;
    width: 100%;
    height: auto;
    font-family: var(--aga-font);
  }
</style>
