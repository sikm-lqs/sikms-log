import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
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

test("all generated blog directories point to real, unique heading IDs", async () => {
  let checked = 0;
  for (const root of ["writing", "en/writing"]) {
    const entries = await readdir(new URL(`../dist/${root}/`, import.meta.url), { withFileTypes: true });
    for (const entry of entries.filter((item) => item.isDirectory())) {
      const route = `${root}/${entry.name}`;
      const html = await readPage(route);
      const toc = html.match(/<aside class="article-toc"[\s\S]*?<\/aside>/u)?.[0];
      if (!/<h[23]\b/u.test(html)) {
        assert.ok(!toc, route);
        continue;
      }
      assert.ok(toc, route);
      const anchors = [...toc.matchAll(/href="#([^"]+)"/gu)].map((match) => match[1]);
      assert.ok(anchors.length > 0, route);
      assert.equal(new Set(anchors).size, anchors.length, route);
      for (const anchor of anchors) assert.ok(html.includes(`id="${anchor}"`), `${route}: ${anchor}`);
      checked++;
    }
  }
  assert.ok(checked > 0, "At least one generated article directory is checked");
});

test("articles without sections and non-reading pages do not get empty directories", async () => {
  for (const route of ["en/life/weekly-reset", "life/weekly-reset", "writing", "projects", "en/projects"]) {
    const html = await readPage(route);
    assert.ok(!html.includes("data-article-toc"), route);
    assert.ok(!html.includes('class="article-shell has-toc"'), route);
  }
});

test("demo projects are absent from generated details, homepages and project lists", async () => {
  const demos = ["myweb-build", "logagent-case-study"];
  for (const prefix of ["", "en/"]) {
    for (const slug of demos) {
      await assert.rejects(readPage(`${prefix}projects/${slug}`), { code: "ENOENT" });
    }
    for (const route of [prefix ? "en" : "", `${prefix}projects`]) {
      const html = await readPage(route);
      for (const slug of demos) assert.ok(!html.includes(slug), `${route}: ${slug}`);
      assert.ok(!html.includes("github.com/example/"), route);
    }
    const entries = await readdir(new URL(`../dist/${prefix}projects/`, import.meta.url), { withFileTypes: true });
    if (!entries.some((entry) => entry.isDirectory())) {
      const html = await readPage(`${prefix}projects`);
      assert.ok(html.includes(prefix ? "Project entries are being expanded." : "项目案例正在补充中。"));
    }
  }
});
