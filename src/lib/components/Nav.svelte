<script lang="ts">
  import { onMount } from 'svelte';

  const sections = [
    { id: 'about', label: 'About' },
    { id: 'research', label: 'Research' },
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'cv', label: 'CV' }
  ];

  let scrolled = false;
  let activeSection = '';

  onMount(() => {
    const handleScroll = () => {
      scrolled = window.scrollY > 50;

      // Find active section
      const sectionElements = sections.map(s => document.getElementById(s.id));
      const scrollPos = window.scrollY + window.innerHeight / 3;

      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const el = sectionElements[i];
        if (el && el.offsetTop <= scrollPos) {
          activeSection = sections[i].id;
          break;
        }
      }

      if (window.scrollY < 100) {
        activeSection = '';
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  });

  function scrollToSection(id: string) {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
</script>

<nav class="nav" class:scrolled>
  <button class="nav-name" on:click={scrollToTop}>
    Chris Talbot
  </button>

  <ul class="nav-links">
    {#each sections as section}
      <li>
        <button
          class="nav-link"
          class:active={activeSection === section.id}
          on:click={() => scrollToSection(section.id)}
        >
          {section.label}
        </button>
      </li>
    {/each}
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
    transition: background-color 0.2s ease;
  }

  .nav.scrolled {
    background-color: var(--cloud);
    border-bottom: 1px solid var(--stone);
  }

  .nav-name {
    font-family: var(--font-heading);
    font-size: var(--text-lg);
    font-weight: 500;
    color: var(--slate-deep);
    background: none;
    border: none;
    cursor: pointer;
    padding: var(--space-sm);
    margin-left: calc(-1 * var(--space-sm));
  }

  .nav-name:hover {
    color: var(--highlight);
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
    background: none;
    border: none;
    cursor: pointer;
    padding: var(--space-sm) var(--space-md);
    position: relative;
    transition: color 0.15s ease;
  }

  .nav-link:hover {
    color: var(--slate-deep);
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
