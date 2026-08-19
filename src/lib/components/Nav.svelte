<script lang="ts">
  import { onMount } from 'svelte';
  import { name } from '$lib/data/bio';

  /** 'home' enables in-page scrolling and scroll-spy; 'blog' links back to the homepage. */
  export let variant: 'home' | 'blog' = 'home';

  const sections = [
    { id: 'background', label: 'Background' },
    { id: 'publications', label: 'Publications' },
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'cv', label: 'CV' }
  ];

  const onHome = variant === 'home';

  let activeSection = '';

  onMount(() => {
    if (!onHome) return;

    // Only reads scrollY, which is free. The previous version called
    // getElementById and read offsetTop for every section on every scroll event,
    // forcing a synchronous layout each time.
    const handleScroll = () => {
      if (window.scrollY < 100) activeSection = '';
    };

    // Scroll-spy without touching layout at all: a section is active while it
    // crosses the upper third of the viewport.
    const spy = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) activeSection = entry.target.id;
        }
      },
      { rootMargin: '-33% 0px -60% 0px' }
    );

    for (const section of sections) {
      const el = document.getElementById(section.id);
      if (el) spy.observe(el);
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      spy.disconnect();
    };
  });

  function scrollTo(event: MouseEvent, id: string) {
    if (!onHome) return; // let the browser follow /#id back to the homepage
    event.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }

  function goToTop(event: MouseEvent) {
    if (!onHome) return;
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
</script>

<nav class="nav">
  <div class="nav-brand">
    <a class="nav-name" href="/" on:click={goToTop}>{name}</a>
    <span class="nav-divider" aria-hidden="true"></span>
    <a
      class="nav-affiliation"
      href="https://www.cornell.edu"
      target="_blank"
      rel="noopener noreferrer"
    >
      <img src="/images/cornell_logo_simple_b31b1b.svg" alt="Cornell University" />
    </a>
  </div>

  <ul class="nav-links">
    {#each sections as section}
      <li>
        <a
          class="nav-link"
          class:active={onHome && activeSection === section.id}
          href="/#{section.id}"
          on:click={(e) => scrollTo(e, section.id)}
        >
          {section.label}
        </a>
      </li>
    {/each}
    <li>
      <a class="nav-link" class:active={variant === 'blog'} href="/blog/">Blog</a>
    </li>
  </ul>
</nav>

<style>
  .nav {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: var(--nav-height);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 var(--space-lg);
    z-index: 100;
    /* Opaque from the top, not faded in on scroll: the background it sits over
       is busy enough at the first screen that it needs the contrast there most. */
    background-color: var(--cloud);
    border-bottom: 1px solid var(--stone);
  }

  .nav-brand {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    min-width: 0;
  }

  .nav-divider {
    width: 1px;
    height: 1.25rem;
    background-color: var(--stone);
    flex-shrink: 0;
  }

  .nav-affiliation {
    display: flex;
    align-items: center;
    transition: opacity 0.2s ease;
  }

  .nav-affiliation:hover {
    opacity: 0.7;
  }

  .nav-affiliation img {
    height: 1.5rem;
    width: auto;
    display: block;
  }

  .nav-name {
    font-family: var(--font-heading);
    font-size: var(--text-lg);
    font-weight: 500;
    color: var(--slate-deep);
    text-decoration: none;
    padding: var(--space-sm);
    margin-left: calc(-1 * var(--space-sm));
  }

  .nav-name:hover {
    color: var(--highlight);
    text-decoration: none;
  }

  .nav-links {
    display: flex;
    list-style: none;
    gap: var(--space-sm);
  }

  .nav-link {
    font-family: var(--font-body);
    font-size: var(--text-sm);
    color: var(--sage);
    text-decoration: none;
    padding: var(--space-sm) var(--space-md);
    position: relative;
    transition: color 0.15s ease;
  }

  .nav-link:hover {
    color: var(--slate-deep);
    text-decoration: none;
  }

  .nav-link.active {
    color: var(--slate-deep);
  }

  .nav-link.active::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: var(--space-md);
    right: var(--space-md);
    height: 2px;
    background-color: var(--highlight);
  }

  @media (max-width: 800px) {
    .nav {
      padding: 0 var(--space-md);
    }

    /* The links already have to scroll at this width; the mark would crowd them. */
    .nav-divider,
    .nav-affiliation {
      display: none;
    }

    .nav-links {
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
    }

    .nav-links::-webkit-scrollbar {
      display: none;
    }

    .nav-link {
      padding: var(--space-sm);
      white-space: nowrap;
    }
  }
</style>
