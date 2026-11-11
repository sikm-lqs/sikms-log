import assert from "node:assert/strict";
import test from "node:test";
import { getTocHeadings } from "../src/lib/content/headings.ts";

test("shows only main sections in long articles, preserving generated slugs", () => {
  const headings = [
    { depth: 2, slug: "1-pretrain", text: "1. Pretrain" },
    { depth: 3, slug: "细节", text: "训练细节" },
    { depth: 2, slug: "2-sft", text: "2. SFT" },
    { depth: 2, slug: "2-sft-1", text: "2. SFT" },
  ];
  assert.deepEqual(getTocHeadings(headings), [
    { ...headings[0], text: "Pretrain" },
    { ...headings[2], text: "SFT" },
    { ...headings[3], text: "SFT" },
  ]);
});

test("falls back to h3 when no h2 exists", () => {
  const section = { depth: 3, slug: "overview", text: "Overview" };
  assert.deepEqual(
    getTocHeadings([{ depth: 1, slug: "title", text: "Title" }, section]),
    [section],
  );
});

test("omits an empty directory and ignores deep headings", () => {
  assert.deepEqual(getTocHeadings([]), []);
  assert.deepEqual(getTocHeadings([{ depth: 4, slug: "detail", text: "Detail" }]), []);
});
