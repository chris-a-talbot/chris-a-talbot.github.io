<script lang="ts">
  import CVSection from './CVSection.svelte';
  import { publicationsByStatus, venueLine } from '$lib/data/publications';
  import {
    contactInfo,
    cvUpdated,
    education,
    research,
    funding,
    totalFunding,
    invitedTalks,
    contributedTalks,
    posters,
    software,
    undergraduateMentoring,
    undergraduateTeaching,
    k12Teaching,
    service,
    memberships,
    languages,
    certifications,
    extracurriculars,
    cvPdfLink
  } from '$lib/data/cv';

  const pubGroups = [
    { label: 'Published', items: publicationsByStatus.published },
    { label: 'Pre-prints / In Review', items: publicationsByStatus.inReview },
    { label: 'In Preparation', items: publicationsByStatus.inPrep }
  ];
</script>

<div class="cv">
  <div class="cv-header">
    <dl class="cv-facts">
      <dt>Status</dt>
      <dd>{contactInfo.status}, {contactInfo.location}</dd>
      <dt>Fields</dt>
      <dd>{contactInfo.fields}</dd>
      <dt>Interests</dt>
      <dd>{contactInfo.interests}</dd>
      <dt>Techs</dt>
      <dd>{contactInfo.techs}</dd>
      <dt>Email</dt>
      <dd class="cv-email">{contactInfo.email}</dd>
    </dl>
    <div class="cv-download-block">
      <a href={cvPdfLink} class="action" target="_blank" rel="noopener noreferrer">
        Download PDF
      </a>
      <span class="cv-updated">Updated {cvUpdated}</span>
    </div>
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
          </li>
        {/each}
      </ul>
    </CVSection>

    <CVSection title="Publications" expanded={true}>
      <div class="publications">
        {#each pubGroups as group}
          {#if group.items.length > 0}
            <div class="pub-group">
              <h4 class="pub-category">{group.label}</h4>
              <ul class="cv-list pub-list">
                {#each group.items as pub}
                  <li class="cv-item pub-item">
                    <span class="pub-year">{pub.year}</span>
                    <span class="pub-content">
                      {pub.authors} {pub.title}.
                      {#if pub.preprint}<span class="pub-preprint">{pub.preprint}.</span>{/if}
                      <em>{venueLine(pub)}</em>
                    </span>
                  </li>
                {/each}
              </ul>
            </div>
          {/if}
        {/each}
      </div>
    </CVSection>

    <CVSection title="Funding, Honors, & Awards" expanded={true}>
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
              <span class="cv-item-title">
                {#if poster.href}
                  <a href={poster.href} class="cv-item-link" target="_blank" rel="noopener noreferrer">{poster.venue}</a>
                {:else}
                  {poster.venue}
                {/if}
              </span>
              <span class="cv-item-year">{poster.year}</span>
            </div>
            <div class="cv-item-details">
              <span class="cv-item-location">{poster.location}</span>
            </div>
          </li>
        {/each}
      </ul>
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
              <p class="cv-item-description">{item.description}</p>
            {/if}
          </li>
        {/each}
      </ul>
    </CVSection>

    <CVSection title="Undergraduate Mentoring" expanded={false}>
      <ul class="cv-list">
        {#each undergraduateMentoring as item}
          <li class="cv-item">
            <div class="cv-item-header">
              <span class="cv-item-title">{item.role}</span>
              <span class="cv-item-year">{item.period}</span>
            </div>
            <div class="cv-item-details">
              <span class="cv-item-org">{item.organization}</span>
            </div>
            {#if item.description}
              <p class="cv-item-description">{item.description}</p>
            {/if}
          </li>
        {/each}
      </ul>
    </CVSection>

    <CVSection title="Undergraduate Teaching" expanded={false}>
      <ul class="cv-list">
        {#each undergraduateTeaching as item}
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

    <CVSection title="K-12 Teaching" expanded={false}>
      <ul class="cv-list">
        {#each k12Teaching as item}
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
  .cv-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: var(--space-lg);
    padding-bottom: var(--space-lg);
    margin-bottom: var(--space-sm);
    border-bottom: 1px solid var(--stone);
  }
  .cv-facts {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: var(--space-xs) var(--space-md);
    font-size: var(--text-sm);
    max-width: 46rem;
  }
  .cv-facts dt {
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--stone);
    padding-top: 0.15em;
  }
  .cv-facts dd {
    color: var(--sage);
  }
  .cv-email {
    font-family: var(--font-mono);
    user-select: all;
  }
  .cv-download-block {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: var(--space-xs);
    flex-shrink: 0;
  }
  .cv-updated {
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    color: var(--stone);
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
  .cv-item-source, .cv-item-org {
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
  .cv-item-level {
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
  .pub-group:last-child .pub-list {
    margin-bottom: 0;
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

  @media (max-width: 700px) {
    .cv-header {
      flex-direction: column;
    }
    .cv-download-block {
      align-items: flex-start;
    }
  }
</style>
