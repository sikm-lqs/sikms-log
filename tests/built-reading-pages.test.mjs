import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const readPage = (route) => readFile(new URL(`../dist/${route}/index.html`, import.meta.url), "utf8");

test("MiniMind directory contains five main sections and every anchor resolves", async () => {
  const html = await readPage("writing/minimind-deep-dive");
  const toc = html.match(/<aside class="article-toc"[\s\S]*?<\/aside>/u)?.[0];
  assert.ok(toc, "Directory is rendered at build time");
  const anchors = [...toc.matchAll(/href="#([^"]+)"/gu)];
  assert.equal(anchors.length, 5, "Code blocks and subheadings must not enter the directory");
  for (const [, slug] of anchors) {
    assert.ok(html.includes(`id="${slug}"`), `Missing heading target: ${slug}`);
  }
  assert.match(toc, /<nav aria-label="本文目录">/u);
});

test("all existing blog directories point to real, unique heading IDs", async () => {
  for (const slug of ["attention-is-all-you-need", "gpt3-few-shot-learners", "gpt4-predictable-scaling"]) {
    const html = await readPage(`writing/${slug}`);
    const toc = html.match(/<aside class="article-toc"[\s\S]*?<\/aside>/u)?.[0];
    assert.ok(toc, slug);
    const anchors = [...toc.matchAll(/href="#([^"]+)"/gu)].map((match) => match[1]);
    assert.ok(anchors.length > 0);
    assert.equal(new Set(anchors).size, anchors.length);
    for (const anchor of anchors) assert.ok(html.includes(`id="${anchor}"`), anchor);
  }
});

test("articles without sections and non-reading pages do not get empty directories", async () => {
  for (const route of ["en/life/weekly-reset", "life/weekly-reset", "writing", "projects/myweb-build"]) {
    const html = await readPage(route);
    assert.ok(!html.includes("data-article-toc"), route);
    assert.ok(!html.includes('class="article-shell has-toc"'), route);
  }
});
