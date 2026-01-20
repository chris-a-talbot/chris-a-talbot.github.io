<script lang="ts">
  import CVSection from './CVSection.svelte';
  import {
    summaryPoints,
    education,
    research,
    publications,
    funding,
    totalFunding,
    software,
    invitedTalks,
    contributedTalks,
    posters,
    teaching,
    awards,
    service,
    languages,
    certifications,
    memberships,
    extracurriculars,
    cvPdfLink
  } from '$lib/data/cv';
</script>

<div class="cv">
  <div class="cv-header">
    <a href={cvPdfLink} class="cv-download" target="_blank" rel="noopener noreferrer">
      Download PDF
    </a>
  </div>

  <div class="cv-summary">
    <ul class="summary-list">
      {#each summaryPoints as point}
        <li>{point}</li>
      {/each}
    </ul>
  </div>

  <div class="cv-sections">
    <CVSection title="Education" expanded={true}>
      <ul class="cv-list">
        {#each education as item}
          <li class="cv-item">
            <div class="cv-item-header">
              <span class="cv-item-title">{item.degree}</span>
              <span class="cv-item-year">{item.period}</span>
            </div>
            <div class="cv-item-details">
              <span class="cv-item-org">{item.institution}</span>
              {#if item.gpa}
                <span class="cv-item-gpa">GPA {item.gpa}</span>
              {/if}
            </div>
            {#if item.details}
              <ul class="cv-item-sublist">
                {#each item.details as detail}
                  <li>{detail}</li>
                {/each}
              </ul>
            {/if}
          </li>
        {/each}
      </ul>
    </CVSection>

    <CVSection title="Research" expanded={true}>
      <ul class="cv-list">
        {#each research as item}
          <li class="cv-item">
            <div class="cv-item-header">
              <span class="cv-item-title">{item.title} - {item.lab}</span>
              <span class="cv-item-year">{item.period}</span>
            </div>
            <div class="cv-item-details">
              <span class="cv-item-org">{item.institution}</span>
            </div>
            {#if item.description}
              <p class="cv-item-description">Project: {item.description}</p>
            {/if}
          </li>
        {/each}
      </ul>
    </CVSection>

    <CVSection title="Publications" expanded={true}>
      <div class="publications">
        <h4 class="pub-category">Published</h4>
        <ul class="cv-list pub-list">
          {#each publications.published as pub}
            <li class="cv-item pub-item">
              <span class="pub-year">{pub.year}</span>
              <span class="pub-content">
                {pub.authors} {pub.title} <em>{pub.journal}.</em>
              </span>
            </li>
          {/each}
        </ul>

        <h4 class="pub-category">Pre-prints / In Review</h4>
        <ul class="cv-list pub-list">
          {#each publications.inReview as pub}
            <li class="cv-item pub-item">
              <span class="pub-year">{pub.year}</span>
              <span class="pub-content">
                {pub.authors} {pub.title}
                {#if pub.preprint}<span class="pub-preprint">{pub.preprint}.</span>{/if}
                <em>In Review at {pub.journal}.</em>
              </span>
            </li>
          {/each}
        </ul>

        <h4 class="pub-category">In Preparation</h4>
        <ul class="cv-list pub-list">
          {#each publications.inPrep as pub}
            <li class="cv-item pub-item">
              <span class="pub-year">{pub.year}</span>
              <span class="pub-content">
                {pub.authors} {pub.title} <em>In Preparation for {pub.journal}.</em>
              </span>
            </li>
          {/each}
        </ul>
      </div>
    </CVSection>

    <CVSection title="Software Development" expanded={true}>
      <ul class="cv-list">
        {#each software as item}
          <li class="cv-item">
            <div class="cv-item-header">
              <span class="cv-item-title">
                {item.role} -
                {#if item.href}
                  <a href={item.href} class="cv-item-link" target="_blank" rel="noopener noreferrer">"{item.name}"</a>
                {:else}
                  "{item.name}"
                {/if}
              </span>
              <span class="cv-item-year">{item.period}</span>
            </div>
            {#if item.description}
              <div class="cv-item-details">
                <span class="cv-item-org">{item.description}</span>
              </div>
            {/if}
          </li>
        {/each}
      </ul>
    </CVSection>

    <CVSection title="Funding" expanded={true}>
      <p class="cv-total-funding">Total: {totalFunding}</p>
      <ul class="cv-list">
        {#each funding as item}
          <li class="cv-item cv-funding-item">
            <div class="cv-item-header">
              <span class="cv-item-title">{item.title}</span>
              <span class="cv-item-year">{item.year}</span>
            </div>
            <div class="cv-item-details">
              <span class="cv-item-source">{item.source}</span>
              {#if item.amount}
                <span class="cv-item-amount">{item.amount}</span>
              {/if}
              {#if item.status === 'declined'}
                <span class="cv-item-status declined">(Declined)</span>
              {/if}
            </div>
          </li>
        {/each}
      </ul>
    </CVSection>

    <CVSection title="Invited Talks & Workshops" expanded={true}>
      <ul class="cv-list">
        {#each invitedTalks as talk}
          <li class="cv-item">
            <div class="cv-item-header">
              <span class="cv-item-title">{talk.venue}</span>
              <span class="cv-item-year">{talk.year}</span>
            </div>
            <div class="cv-item-details">
              <span class="cv-item-location">{talk.location}</span>
              {#if talk.note}
                <span class="cv-item-note">({talk.note})</span>
              {/if}
            </div>
          </li>
        {/each}
      </ul>
    </CVSection>

    <CVSection title="Contributed Talks" expanded={true}>
      <ul class="cv-list">
        {#each contributedTalks as talk}
          <li class="cv-item">
            <div class="cv-item-header">
              <span class="cv-item-title">{talk.venue}</span>
              <span class="cv-item-year">{talk.year}</span>
            </div>
            <div class="cv-item-details">
              <span class="cv-item-location">{talk.location}</span>
              {#if talk.note}
                <span class="cv-item-note">({talk.note})</span>
              {/if}
            </div>
          </li>
        {/each}
      </ul>
    </CVSection>

    <CVSection title="Posters" expanded={true}>
      <ul class="cv-list">
        {#each posters as poster}
          <li class="cv-item">
            <div class="cv-item-header">
              <span class="cv-item-title">{poster.venue}</span>
              <span class="cv-item-year">{poster.year}</span>
            </div>
            <div class="cv-item-details">
              <span class="cv-item-location">{poster.location}</span>
            </div>
          </li>
        {/each}
      </ul>
    </CVSection>

    <CVSection title="Honors & Awards" expanded={false}>
      <ul class="cv-list">
        {#each awards as award}
          <li class="cv-item">
            <div class="cv-item-header">
              <span class="cv-item-title">{award.title}</span>
              <span class="cv-item-year">{award.year}</span>
            </div>
            <div class="cv-item-details">
              <span class="cv-item-source">{award.source}</span>
              {#if award.description}
                <span class="cv-item-note">({award.description})</span>
              {/if}
            </div>
          </li>
        {/each}
      </ul>
    </CVSection>

    <CVSection title="Teaching & Mentoring" expanded={false}>
      <ul class="cv-list">
        {#each teaching as item}
          <li class="cv-item">
            <div class="cv-item-header">
              <span class="cv-item-title">{item.role}</span>
              <span class="cv-item-year">{item.period}</span>
            </div>
            <div class="cv-item-details">
              <span class="cv-item-org">{item.organization}</span>
            </div>
          </li>
        {/each}
      </ul>
    </CVSection>

    <CVSection title="Professional & Service" expanded={false}>
      <ul class="cv-list">
        {#each service as item}
          <li class="cv-item">
            <div class="cv-item-header">
              <span class="cv-item-title">{item.role}</span>
              <span class="cv-item-year">{item.period}</span>
            </div>
            <div class="cv-item-details">
              <span class="cv-item-org">{item.organization}</span>
            </div>
          </li>
        {/each}
      </ul>
    </CVSection>

    <CVSection title="Languages" expanded={false}>
      <ul class="cv-list">
        {#each languages as lang}
          <li class="cv-item cv-lang-item">
            <div class="cv-item-header">
              <span class="cv-item-title">{lang.language}</span>
              <span class="cv-item-level">{lang.level} - {lang.description}</span>
            </div>
          </li>
        {/each}
      </ul>
    </CVSection>

    <CVSection title="Certifications" expanded={false}>
      <ul class="cv-list">
        {#each certifications as cert}
          <li class="cv-item">
            <div class="cv-item-header">
              <span class="cv-item-title">{cert.title}</span>
              <span class="cv-item-year">{cert.year}</span>
            </div>
            <div class="cv-item-details">
              <span class="cv-item-source">{cert.source}</span>
            </div>
          </li>
        {/each}
      </ul>
    </CVSection>

    <CVSection title="Professional Memberships" expanded={false}>
      <ul class="cv-list cv-list-simple">
        {#each memberships as membership}
          <li class="cv-item cv-item-simple">
            <span class="cv-item-org">{membership.organization}</span>
            <span class="cv-item-period">{membership.period}</span>
          </li>
        {/each}
      </ul>
    </CVSection>

    <CVSection title="Extracurriculars" expanded={false}>
      <ul class="cv-list">
        {#each extracurriculars as item}
          <li class="cv-item">
            <div class="cv-item-header">
              <span class="cv-item-title">{item.activity}</span>
              <span class="cv-item-year">{item.period}</span>
            </div>
            <div class="cv-item-details">
              <span class="cv-item-org">{item.organization}</span>
            </div>
          </li>
        {/each}
      </ul>
    </CVSection>
  </div>
</div>

<style>
  .cv {
    max-width: 48rem;
  }
  .cv-header {
    display: flex;
    justify-content: flex-end;
    margin-bottom: var(--space-lg);
  }
  .cv-download {
    font-family: var(--font-mono);
    font-size: var(--text-sm);
    padding: var(--space-sm) var(--space-md);
    border: 1px solid var(--highlight);
    color: var(--highlight);
    text-decoration: none;
    transition: background-color 0.15s ease, color 0.15s ease;
  }
  .cv-download:hover {
    background-color: var(--highlight);
    color: var(--cloud);
    text-decoration: none;
  }
  .cv-summary {
    margin-bottom: var(--space-xl);
    padding-bottom: var(--space-lg);
    border-bottom: 1px solid var(--stone);
  }
  .summary-list {
    list-style: none;
    padding: 0;
  }
  .summary-list li {
    position: relative;
    padding-left: var(--space-lg);
    margin-bottom: var(--space-sm);
    font-size: var(--text-base);
    line-height: 1.7;
    color: var(--sage);
  }
  .summary-list li::before {
    content: '·';
    position: absolute;
    left: var(--space-sm);
    color: var(--highlight);
    font-weight: bold;
  }
  .cv-total-funding {
    font-family: var(--font-mono);
    font-size: var(--text-sm);
    color: var(--highlight);
    margin-bottom: var(--space-md);
  }
  .cv-list {
    list-style: none;
  }
  .cv-item {
    padding: var(--space-sm) 0;
  }
  .cv-item-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: var(--space-md);
    flex-wrap: wrap;
  }
  .cv-item-title {
    font-weight: 500;
    color: var(--slate-deep);
  }
  .cv-item-link {
    color: var(--slate-deep);
    text-decoration: none;
    border-bottom: 1px solid transparent;
    transition: border-color 0.15s ease;
  }
  .cv-item-link:hover {
    border-color: var(--highlight);
    text-decoration: none;
  }
  .cv-item-year, .cv-item-period {
    font-family: var(--font-mono);
    font-size: var(--text-sm);
    color: var(--sage);
    flex-shrink: 0;
  }
  .cv-item-details {
    display: flex;
    gap: var(--space-md);
    flex-wrap: wrap;
    font-size: var(--text-sm);
    color: var(--sage);
    margin-top: var(--space-xs);
  }
  .cv-item-source, .cv-item-venue, .cv-item-org {
    color: var(--sage);
  }
  .cv-item-location {
    color: var(--sage);
    font-style: italic;
  }
  .cv-item-amount {
    font-family: var(--font-mono);
    color: var(--highlight);
  }
  .cv-item-gpa {
    font-family: var(--font-mono);
    color: var(--sage);
  }
  .cv-item-status.declined {
    color: var(--sage);
    font-style: italic;
  }
  .cv-item-note {
    color: var(--sage);
    font-style: italic;
  }
  .cv-item-role, .cv-item-level {
    font-family: var(--font-mono);
    font-size: var(--text-sm);
    color: var(--sage);
  }
  .cv-item-description {
    font-size: var(--text-sm);
    color: var(--sage);
    margin-top: var(--space-xs);
    line-height: 1.5;
  }
  .cv-item-sublist {
    margin-top: var(--space-xs);
    padding-left: var(--space-lg);
    list-style: none;
  }
  .cv-item-sublist li {
    font-size: var(--text-sm);
    color: var(--sage);
    line-height: 1.6;
    position: relative;
    padding-left: var(--space-md);
    margin-bottom: var(--space-xs);
  }
  .cv-item-sublist li::before {
    content: '–';
    position: absolute;
    left: 0;
    color: var(--stone);
  }
  .cv-list-simple .cv-item-simple {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: var(--space-md);
  }
  .cv-lang-item .cv-item-header {
    margin-bottom: var(--space-xs);
  }

  /* Publications styles */
  .publications {
    display: flex;
    flex-direction: column;
    gap: var(--space-md);
  }
  .pub-category {
    font-size: var(--text-sm);
    font-weight: 600;
    color: var(--highlight);
    margin: var(--space-sm) 0;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .pub-list {
    margin-bottom: var(--space-md);
  }
  .pub-item {
    display: flex;
    gap: var(--space-md);
    align-items: flex-start;
  }
  .pub-year {
    font-family: var(--font-mono);
    font-size: var(--text-sm);
    color: var(--sage);
    flex-shrink: 0;
    min-width: 3rem;
  }
  .pub-content {
    font-size: var(--text-sm);
    color: var(--sage);
    line-height: 1.6;
  }
  .pub-content em {
    color: var(--slate-deep);
  }
  .pub-preprint {
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    color: var(--sage);
  }
</style>
