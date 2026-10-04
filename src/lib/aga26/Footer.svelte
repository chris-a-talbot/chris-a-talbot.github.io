<script lang="ts">
  /** The poster's red footer: RAINN, Cornell CALS, NSF, the data-and-methods QR, the thanks. */
  import { FILES } from './theme';
</script>

<footer class="foot">
  <div class="row">
    <a class="rainn" href="https://rainn.org/give-to-rainn/" target="_blank" rel="noopener">
      <span class="rt">Support Survivors,<br />Pursue Justice,<br />Build Safer<br />Communities.<br /><b>Support RAINN:</b></span>
      <img class="qr" src="{FILES}/qr_rainn.svg" alt="QR code for rainn.org/give-to-rainn" />
    </a>
    <img class="cals" src="{FILES}/cornell_cals.png" alt="Cornell CALS, College of Agriculture and Life Sciences" />
    <img class="nsf" src="{FILES}/nsf.png" alt="U.S. National Science Foundation" />
    <div class="more">
      <span>For more on the data<br />and methods, scan:</span>
      <img class="qr" src="{FILES}/qr_poster.svg" alt="QR code for chris-a-talbot.com/aga26" />
    </div>
  </div>
  <p class="thanks">
    Thanks to Dr. Philipp Messer and Dr. Daniel Anstett for advising, the Messer and Anstett labs for feedback, and Drs. Amy
    Angert and Seema Sheth for envisioning, funding, and maintaining this wonderful dataset with the help of a Genome BC
    grant.
  </p>
</footer>

<style>
  .foot {
    background: var(--aga-carnelian);
    color: #fff;
    font-family: var(--aga-font);
    padding: 1.6rem 1rem 1.4rem;
  }
  .row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-areas:
      'cals nsf'
      'rainn rainn'
      'more more';
    gap: 1.4rem 1.2rem;
    align-items: center;
    justify-items: center;
    max-width: 90rem;
    margin: 0 auto;
  }
  .rainn {
    grid-area: rainn;
  }
  .cals {
    grid-area: cals;
  }
  .nsf {
    grid-area: nsf;
  }
  .more {
    grid-area: more;
  }
  @media (min-width: 60rem) {
    .row {
      grid-template-columns: auto auto auto auto;
      grid-template-areas: 'rainn cals nsf more';
      justify-content: space-between;
    }
  }
  .rainn,
  .more {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #fff;
    text-decoration: none;
  }
  .rainn:hover {
    color: #fff;
    text-decoration: none;
  }
  .rt {
    font-size: 0.72rem;
    line-height: 1.2;
    text-align: right;
  }
  .more span {
    font-size: 0.95rem;
    line-height: 1.3;
    text-align: right;
  }
  .qr {
    width: 4.6rem;
    height: 4.6rem;
    image-rendering: pixelated;
  }
  .cals {
    width: min(100%, 13rem);
    height: auto;
  }
  .nsf {
    width: min(100%, 14rem);
    height: auto;
  }
  @media (min-width: 60rem) {
    .cals {
      padding-left: 1.2rem;
      border-left: 1px solid rgb(255 255 255 / 0.5);
    }
  }
  .thanks {
    max-width: 70rem;
    margin: 1.3rem auto 0;
    font-size: 0.82rem;
    line-height: 1.45;
    text-align: center;
  }
</style>
