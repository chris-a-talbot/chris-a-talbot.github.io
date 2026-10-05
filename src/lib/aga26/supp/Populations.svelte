<script lang="ts">
  /**
   * Which populations enter each comparison: the funnel from the monitored populations to each
   * outcome's sample, then every population of the demographic analysis, south to north.
   */
  import S from '../data/supplement.json';
  import Fold from './Fold.svelte';

  const R = S.roster;
  const P = S.populations;
  const byId = Object.fromEntries(P.map((p) => [p.id, p]));
  const names = (ids: number[]) => ids.map((q) => byId[q].name);
  const list = (xs: string[]) => (xs.length < 2 ? xs.join('') : `${xs.slice(0, -1).join(', ')} and ${xs.at(-1)}`);

  const unsequenced = R.excluded_genomic.filter((q) => byId[q].n_baseline == null);
  const few = R.excluded_genomic.filter((q) => byId[q].n_baseline != null);
  const noRecovery = R.recovery_missing.filter((q) => byId[q].genomic && !byId[q].extirpated);

  const STEPS = [
    { n: R.monitored, label: 'monitored populations', note: 'the yearly demographic census, 2010–2019' },
    {
      n: R.demography,
      label: 'in the demographic analysis',
      note: 'Mill Creek is left out: its plots washed out after the 2010 census and were relocated'
    },
    {
      n: R.genomic,
      label: 'with baseline genomes',
      note: `${list(names(unsequenced))} were not sequenced; ${list(
        few.map((q) => `${byId[q].name} (${byId[q].n_baseline} ${byId[q].n_baseline === 1 ? 'plant' : 'plants'})`)
      )} fall below the minimum of 4`
    },
    {
      n: R.persisted,
      extra: R.extirpated,
      label: 'persisted',
      note: 'change into the drought and persistence use all 15'
    },
    {
      n: R.recovery,
      label: 'with recovery growth',
      note: `change out of the drought: the survivors except ${list(names(noRecovery))}, which has no census interval in the recovery window`
    }
  ];
</script>

<ol class="funnel">
  {#each STEPS as s}
    <li>
      <span class="n">{s.n}</span>
      <span class="label">
        {s.label}{#if s.extra}, <span class="ext"><b>{s.extra}</b> extirpated</span>{/if}
      </span>
      <span class="note">{s.note}</span>
    </li>
  {/each}
</ol>

<Fold label="The {R.demography} populations of the demographic analysis, south to north">
<div class="scroll">
  <table>
    <caption>The {R.demography} populations of the demographic analysis, south to north</caption>
    <thead>
      <tr>
        <th scope="col" class="l">Population</th>
        <th scope="col">Latitude</th>
        <th scope="col">Baseline plants</th>
        <th scope="col">Mean depth</th>
        <th scope="col" class="l">Drought</th>
        <th scope="col">Into drought, persistence</th>
        <th scope="col">Out of drought</th>
      </tr>
    </thead>
    <tbody>
      {#each P as p}
        <tr class:ext={p.extirpated} class:out={!p.genomic}>
          <th scope="row" class="l">{p.name}</th>
          <td>{p.latitude?.toFixed(2)}°N</td>
          <td>{p.n_baseline ?? '—'}</td>
          <td>{p.depth == null ? '—' : `${p.depth.toFixed(1)}×`}</td>
          <td class="l">{p.extirpated ? 'extirpated' : 'persisted'}</td>
          <td>{#if p.genomic}<span class="yes" aria-label="included">●</span>{:else}<span aria-label="not included">—</span>{/if}</td>
          <td>{#if p.recovery}<span class="yes" aria-label="included">●</span>{:else}<span aria-label="not included">—</span>{/if}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
</Fold>

<style>
  .funnel {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: 0.45rem;
    container-type: inline-size;
  }
  .funnel li {
    display: grid;
    grid-template-columns: 3.1rem 1fr;
    column-gap: 0.7rem;
    align-items: baseline;
    padding: 0.5rem 0.75rem;
    border-radius: 0.5rem;
    background: var(--aga-mint);
  }
  .n {
    grid-row: 1 / 3;
    font-size: 1.9rem;
    font-weight: 800;
    line-height: 1;
    color: var(--aga-spruce);
    text-align: right;
  }
  .label {
    font-weight: 700;
    font-size: 1.02rem;
  }
  .ext {
    color: var(--aga-carnelian);
    font-weight: 700;
  }
  .note {
    grid-column: 2;
    font-size: 0.88rem;
    line-height: 1.3;
    color: var(--aga-soft-ink);
  }
  @media (min-width: 64rem) {
    .funnel {
      grid-template-columns: repeat(5, minmax(0, 1fr));
      gap: 0.5rem;
    }
    .funnel li {
      position: relative;
      grid-template-columns: 1fr;
      align-content: start;
      padding: 0.7rem 0.8rem 0.8rem;
    }
    .n {
      grid-row: auto;
      text-align: left;
      font-size: 2.2rem;
      margin-bottom: 0.2rem;
    }
    .note {
      grid-column: 1;
      margin-top: 0.25rem;
    }
  }

  /* On a phone the table scrolls sideways; a shadow at either edge shows there is more. */
  .scroll {
    overflow-x: auto;
    margin-top: 1rem;
    background:
      linear-gradient(to right, #fff 30%, rgb(255 255 255 / 0)) left / 2rem 100% no-repeat local,
      linear-gradient(to left, #fff 30%, rgb(255 255 255 / 0)) right / 2rem 100% no-repeat local,
      radial-gradient(farthest-side at 0 50%, rgb(0 0 0 / 0.16), transparent) left / 0.7rem 100% no-repeat scroll,
      radial-gradient(farthest-side at 100% 50%, rgb(0 0 0 / 0.16), transparent) right / 0.7rem 100% no-repeat scroll;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.88rem;
    font-variant-numeric: tabular-nums;
  }
  caption {
    caption-side: top;
    text-align: left;
    font-weight: 700;
    font-size: 0.95rem;
    padding: 0 0 0.4rem;
  }
  th,
  td {
    padding: 0.32rem 0.5rem;
    text-align: right;
    white-space: nowrap;
  }
  .l {
    text-align: left;
  }
  thead th {
    font-weight: 600;
    color: var(--aga-soft-ink);
    border-bottom: 1px solid var(--aga-rule);
    vertical-align: bottom;
    white-space: normal;
    line-height: 1.2;
  }
  tbody th {
    font-weight: 600;
  }
  tbody tr + tr {
    border-top: 1px solid var(--aga-panel);
  }
  tr.ext {
    background: #f9eaea;
  }
  tr.ext td.l {
    color: var(--aga-carnelian);
    font-weight: 700;
  }
  tr.out {
    color: var(--aga-soft-ink);
  }
  tr.out th {
    font-weight: 400;
  }
  .yes {
    color: var(--aga-spruce);
  }
  td:nth-child(6),
  td:nth-child(7) {
    text-align: center;
  }
  @media (max-width: 40rem) {
    .scroll {
      margin-top: 0.2rem;
    }
    caption {
      display: none;
    }
    table {
      font-size: 0.8rem;
    }
    th,
    td {
      padding: 0.3rem 0.3rem;
    }
    tbody th {
      min-width: 6.5rem;
      white-space: normal;
      line-height: 1.2;
    }
  }
</style>
