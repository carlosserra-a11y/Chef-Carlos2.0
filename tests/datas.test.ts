import assert from 'node:assert/strict';
import { test } from 'node:test';
import { diasAte } from '../src/lib/datas.ts';

test('conta os dias inteiros até a data, ignorando o horário de hoje', () => {
  assert.equal(diasAte('2026-12-24', new Date(2026, 9, 20, 23, 59)), 65);
  assert.equal(diasAte('2026-12-24', new Date(2026, 11, 23, 8, 0)), 1);
});

test('retorna zero no próprio dia e depois dele', () => {
  assert.equal(diasAte('2026-12-24', new Date(2026, 11, 24, 10, 0)), 0);
  assert.equal(diasAte('2026-12-24', new Date(2026, 11, 30)), 0);
});

test('data inválida retorna zero', () => {
  assert.equal(diasAte('24/12/2026', new Date(2026, 9, 20)), 0);
});
