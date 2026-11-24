import { test } from 'node:test';
import assert from 'node:assert/strict';
import { canCollect, pageContext, contentProgress, isCaseEngaged } from '../lib/analytics-rules.ts';

test('development, preview, admin and lab traffic never enter the public dataset', () => {
  for (const [host, path] of [['localhost', '/'], ['127.0.0.1', '/work/linky'], ['portfolio-preview.vercel.app', '/'], ['lopatinanton.vercel.app', '/admin'], ['lopatinanton.vercel.app', '/admin/login'], ['lopatinanton.vercel.app', '/lab/vodokachka-flow'], ['lopatinanton.vercel.app', '/en/admin']]) {
    assert.equal(canCollect(host, path), false, `${host}${path}`);
  }
  assert.equal(canCollect('lopatinanton.vercel.app', '/en/work/rentag'), true);
});

test('Russian and English cases share a normalized case identifier, while other pages do not', () => {
  assert.equal(pageContext('/en/work/linky/').case_slug, 'linky');
  assert.equal(pageContext('/work/linky').case_slug, 'linky');
  assert.equal(pageContext('/en/about').case_slug, null);
  assert.equal(pageContext('/enough').locale, 'ru');
});

test('background time or a fast scroll alone cannot qualify as case engagement', () => {
  assert.equal(isCaseEngaged(0, 100), false);
  assert.equal(isCaseEngaged(29_999, 100), false);
  assert.equal(isCaseEngaged(120_000, 49), false);
  assert.equal(isCaseEngaged(30_000, 50), true);
});

test('content depth is measured against case body, not the next-case card/footer', () => {
  assert.equal(contentProgress(800, 4000, 800), 0);
  assert.equal(contentProgress(-1200, 4000, 800), 50);
  assert.equal(contentProgress(-5000, 4000, 800), 100);
  assert.equal(contentProgress(0, 0, 800), 0);
});
