<script lang="ts">
  import Timeline from './Timeline.svelte';
  import { bio, education, experience, profileImage, contact } from '$lib/data/bio';
</script>

<div class="about-grid">
  <div class="about-photo">
    <img src={profileImage} alt="Chris Talbot" />
  </div>
  <div class="about-content">
    <p class="about-bio">{bio}</p>
    <div class="about-links">
      <a href={contact.github} class="about-link">GitHub</a>
      <a href={contact.linkedin} class="about-link">LinkedIn</a>
      <a href="mailto:{contact.email}" class="about-link">{contact.email}</a>
    </div>
  </div>
</div>

<div class="about-columns">
  <div class="about-column">
    <h3>Education</h3>
    <Timeline items={education} type="education" />
  </div>
  <div class="about-column">
    <h3>Research Experience</h3>
    <Timeline items={experience} type="experience" />
  </div>
</div>

<style>
  .about-grid {
    display: grid;
    grid-template-columns: 200px 1fr;
    gap: var(--space-xl);
    margin-bottom: var(--space-2xl);
  }
  .about-photo img {
    width: 100%;
    aspect-ratio: 1;
    object-fit: cover;
    border: 1px solid var(--stone);
  }
  .about-bio {
    font-size: var(--text-lg);
    line-height: 1.7;
    margin-bottom: var(--space-lg);
  }
  .about-links {
    display: flex;
    gap: var(--space-lg);
    flex-wrap: wrap;
  }
  .about-link {
    font-family: var(--font-mono);
    font-size: var(--text-sm);
  }
  .about-columns {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-2xl);
  }
  .about-column h3 {
    font-size: var(--text-xl);
    margin-bottom: var(--space-lg);
    padding-bottom: var(--space-sm);
    border-bottom: 1px solid var(--stone);
  }
  @media (max-width: 1000px) {
    .about-columns { grid-template-columns: 1fr; }
  }
  @media (max-width: 800px) {
    .about-grid {
      grid-template-columns: 1fr;
      text-align: center;
    }
    .about-photo {
      max-width: 200px;
      margin: 0 auto;
    }
    .about-links { justify-content: center; }
  }
</style>
