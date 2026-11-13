/// <reference types="node" />
// Run: node src/features/product/model/variant.test.ts
import assert from 'node:assert/strict';
import type { Product, ProductVariant } from '@/features/product/types/product';
import { defaultSelection, findVariant, isAvailable, nextSelection, priceOf, stockOf, toCartItem } from './variant.ts';

const v = (id: string, options: Record<string, string>, price = 100, salePrice: number | null = null): ProductVariant =>
  ({ id, price, salePrice, quantity: 1, options });

const variants = [v('a', { color: 'red', size: '38' }), v('b', { color: 'red', size: '40' }), v('c', { color: 'blue', size: '38' })];
const product = (over: Partial<Product> = {}) =>
  ({ price: 190, salePrice: 160, variants, options: [{ name: 'color', type: 'image', values: [{ id: '1', name: 'red' }] }], ...over }) as Product;

// findVariant: every selected option must match
assert.equal(findVariant(variants, { color: 'red', size: '40' })?.id, 'b');
assert.equal(findVariant(variants, { color: 'blue', size: '40' }), undefined); // combination doesn't exist

// defaultSelection: first variant's combo, falls back to first value per option
assert.deepEqual(defaultSelection(product()), { color: 'red', size: '38' });
assert.deepEqual(defaultSelection(product({ variants: [] })), { color: 'red' });

// priceOf: variant overrides product, unset variant fields fall back
assert.deepEqual(priceOf(product(), v('x', {}, 0, null)), { price: 190, salePrice: 160 }); // BE sample case
assert.deepEqual(priceOf(product(), v('x', {}, 250, 200)), { price: 250, salePrice: 200 });
assert.deepEqual(priceOf(product(), v('x', {}, 150, null)), { price: 150, salePrice: null }); // product sale 160 ≥ 150 → no sale
assert.deepEqual(priceOf(product()), { price: 190, salePrice: 160 }); // no variant matched

// Trap case: brown only in 38, black only in 40. Options ordered color → size.
const opt = (name: string, values: string[]) => ({ name, type: 'button' as const, values: values.map((n) => ({ id: n, name: n })) });
const trap = product({
  options: [opt('color', ['brown', 'black']), opt('size', ['38', '40'])],
  variants: [v('b38', { color: 'brown', size: '38' }), v('k40', { color: 'black', size: '40' })],
});
const brown38 = { color: 'brown', size: '38' };

// isAvailable: size limited by color; color never limited by size
assert.equal(isAvailable(trap, brown38, 'size', '40'), false); // brown has no 40 → disabled
assert.equal(isAvailable(trap, brown38, 'size', '38'), true);
assert.equal(isAvailable(trap, brown38, 'color', 'black'), true); // reachable even though black has no 38
assert.equal(isAvailable(product({ variants: [] }), brown38, 'size', '99'), true); // no variants, nothing restricted
const ghost = product({ options: trap.options, variants: [v('b38', brown38)] });
assert.equal(isAvailable(ghost, brown38, 'color', 'black'), false); // color with no variant at all → disabled

// nextSelection: valid pick kept; pick that breaks a later option moves it to a fitting variant
assert.deepEqual(nextSelection(trap, brown38, 'size', '38'), brown38);
assert.deepEqual(nextSelection(trap, brown38, 'color', 'black'), { color: 'black', size: '40' });

// stockOf: untracked → null; variant qty wins; blocking only when the store says so
const tracked = (over: Partial<Product> = {}) => product({ trackStock: true, blockOrdersWhenOutOfStock: true, quantity: 7, ...over });
assert.equal(stockOf(product({ trackStock: false }), v('x', {})), null);
assert.deepEqual(stockOf(tracked(), { ...v('x', {}), quantity: 3 }), { quantity: 3, canOrder: true });
assert.deepEqual(stockOf(tracked(), { ...v('x', {}), quantity: 0 }), { quantity: 0, canOrder: false });
assert.deepEqual(stockOf(tracked({ blockOrdersWhenOutOfStock: false }), { ...v('x', {}), quantity: 0 }), { quantity: 0, canOrder: true });
assert.deepEqual(stockOf(tracked({ variants: [] })), { quantity: 7, canOrder: true }); // no variants → product qty
assert.deepEqual(stockOf(tracked()), { quantity: 0, canOrder: false }); // has variants but none matched

// toCartItem: charged price, selected swatch image, product id when no variant
const shoe = product({
  id: 'p', name: 'Shoe', images: ['main.jpg'],
  options: [{ name: 'color', type: 'image', values: [{ id: '1', name: 'red', image: 'red.jpg' }] }],
});
assert.deepEqual(toCartItem(shoe, { color: 'red', size: '40' }, variants[1]), {
  variantId: 'b', name: 'Shoe', image: 'red.jpg', price: 100, options: { color: 'red', size: '40' }, quantity: 1, maxQuantity: null,
});
assert.equal(toCartItem({ ...shoe, trackStock: true, blockOrdersWhenOutOfStock: true }, {}, variants[1]).maxQuantity, 1); // capped at variant stock
assert.equal(toCartItem(product({ id: 'p', images: ['main.jpg'], options: [], variants: [] }), {}, undefined).variantId, 'p');
assert.equal(toCartItem(product({ id: 'p', images: ['main.jpg'], options: [], variants: [] }), {}, undefined).image, 'main.jpg');

console.log('variant ok');
