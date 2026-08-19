---
title: Starting a notebook in public
date: '2026-08-19'
description: What this space is for, and why some of the work that never makes it into a paper is worth writing down anyway.
tags:
  - notes
  - simulation
# Kept as a worked example of every feature the blog supports. Delete this line
# to publish it, or copy the file as the starting point for a new post.
hidden: true
---

Most of what I do in a week never reaches a manuscript. A simulation gets run three ways
before one of them is defensible. A method gets reimplemented because the reference
version assumes a demography I don't have. A figure gets thrown away because it answered
a question nobody asked.

That work is not wasted, but it is invisible, and it tends to be the part other people
most want to read. So this is where it goes.

## What I expect to write here

Roughly three kinds of thing:

- **Simulation notes.** Short write-ups of experiments in SLiM and `msprime` — what I set
  up, what surprised me, and what I'd do differently.
- **Method walkthroughs.** Explanations of inference methods I'm using, aimed at the
  version of me who had not yet read the paper.
- **Tooling.** Notes from building [ARGscape](https://argscape.com) and
  [slim-vscode-tools](https://github.com/slim-community/slim-vscode-tools), including the
  parts that went badly.

Posts here are notebook entries, not preprints. They are allowed to be wrong, and I'll say
so in the text when a later post supersedes an earlier one.

## An example of the kind of thing I mean

Here is a question that has cost me more time than it should have: how much does the
spacing of sampling times change what you can recover from an ancestral recombination
graph? The setup is small enough to state in a few lines.

```python
import msprime

# One population, sampled at three points in the recent past.
demography = msprime.Demography()
demography.add_population(name="pop", initial_size=10_000)

samples = [
    msprime.SampleSet(50, population="pop", time=t)
    for t in (0, 200, 400)
]

ts = msprime.sim_ancestry(
    samples=samples,
    demography=demography,
    sequence_length=1e7,
    recombination_rate=1e-8,
    random_seed=42,
)
```

Changing that `(0, 200, 400)` tuple is the entire experiment. The interesting part is that
the answer depends on what you are trying to estimate, which is exactly the sort of caveat
that gets compressed into half a sentence in a methods section.

> A result that only holds under the sampling scheme you happened to use is not a result
> about the population. It's a result about your fieldwork.

<figure>
  <img src="/images/argscape_homepage.png" alt="The ARGscape interface showing an ancestral recombination graph laid out over a map." />
  <figcaption>
    ARGscape, which came out of wanting to look at these graphs rather than summarise them.
    Figures on this blog sit in a slightly wider column than the text.
  </figcaption>
</figure>

## Pace

Irregular. I would rather post something half-finished and useful every few weeks than
plan a series I never start.

If you want to talk about any of it, write to me at cat267[at]cornell[dot]edu.
