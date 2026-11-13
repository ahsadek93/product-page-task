/// <reference types="node" />
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { crumbLabel } from './breadcrumb.ts';

const categories = [{ id: '1', name: 'Moc Toe Boots', slug: 'Moc-Toe-Boots' }];

describe('crumbLabel', () => {
  it("uses the matching category's name, case-insensitively", () => {
    assert.equal(crumbLabel('moc-toe-boots', categories), 'Moc Toe Boots');
  });

  it('humanizes the slug when no category matches', () => {
    assert.equal(crumbLabel('shirts-tops', categories), 'Shirts Tops');
    assert.equal(crumbLabel('women', []), 'Women');
  });

  it('collapses repeated dashes and underscores', () => {
    assert.equal(crumbLabel('new_in--sale', []), 'New In Sale');
  });
});
