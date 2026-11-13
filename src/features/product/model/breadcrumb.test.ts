/// <reference types="node" />
// Run: node src/features/product/model/breadcrumb.test.ts
import assert from 'node:assert/strict';
import { crumbLabel } from './breadcrumb.ts';

const categories = [{ id: '1', name: 'Moc Toe Boots', slug: 'Moc-Toe-Boots' }];

assert.equal(crumbLabel('moc-toe-boots', categories), 'Moc Toe Boots'); // matched, case-insensitive
assert.equal(crumbLabel('shirts-tops', categories), 'Shirts Tops'); // no match → humanized
assert.equal(crumbLabel('women', []), 'Women');
assert.equal(crumbLabel('new_in--sale', []), 'New In Sale');

console.log('breadcrumb ok');
