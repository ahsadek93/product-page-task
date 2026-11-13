/// <reference types="node" />
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import type { Product, ProductVariant } from '@/features/product/types/product';
import { defaultSelection, findVariant, nextSelection, priceOf, stockOf, toCartItem, unavailableReason } from './variant.ts';

const v = (id: string, options: Record<string, string>, price = 100, salePrice: number | null = null, quantity = 1): ProductVariant =>
  ({ id, price, salePrice, quantity, options });
const opt = (name: string, values: string[]) => ({ name, type: 'button' as const, values: values.map((n) => ({ id: n, name: n })) });

const variants = [v('a', { color: 'red', size: '38' }), v('b', { color: 'red', size: '40' }), v('c', { color: 'blue', size: '38' })];
const product = (over: Partial<Product> = {}) =>
  ({ id: 'p', price: 190, salePrice: 160, images: [], variants, options: [opt('color', ['red'])], trackStock: false, blockOrdersWhenOutOfStock: false, quantity: 0, ...over }) as Product;

// Trap: brown only in 38, black only in 40. Options ordered color → size.
const brown38 = { color: 'brown', size: '38' };
const trap = product({
  options: [opt('color', ['brown', 'black']), opt('size', ['38', '40'])],
  variants: [v('b38', brown38), v('k40', { color: 'black', size: '40' })],
});

// Stock: brown 38 sold out, brown 40 in stock, black only in 38 and sold out.
const stocked = (over: Partial<Product> = {}) =>
  product({
    options: trap.options,
    trackStock: true,
    blockOrdersWhenOutOfStock: true,
    variants: [v('b38', brown38, 100, null, 0), v('b40', { color: 'brown', size: '40' }), v('k38', { color: 'black', size: '38' }, 100, null, 0)],
    ...over,
  });

describe('findVariant', () => {
  it('matches every selected option', () => {
    assert.equal(findVariant(variants, { color: 'red', size: '40' })?.id, 'b');
  });

  it('returns undefined for a combination that does not exist', () => {
    assert.equal(findVariant(variants, { color: 'blue', size: '40' }), undefined);
  });
});

describe('defaultSelection', () => {
  it("starts from the first variant's combination", () => {
    assert.deepEqual(defaultSelection(product()), { color: 'red', size: '38' });
  });

  it('skips a sold-out first variant', () => {
    assert.deepEqual(defaultSelection(stocked()), { color: 'brown', size: '40' });
  });

  it('falls back to the first value of each option when there are no variants', () => {
    assert.deepEqual(defaultSelection(product({ variants: [] })), { color: 'red' });
  });
});

describe('priceOf', () => {
  it('uses the product price and sale when the variant leaves them unset (0 / null)', () => {
    assert.deepEqual(priceOf(product(), v('x', {}, 0, null)), { price: 190, salePrice: 160 });
  });

  it('lets variant price and sale override the product', () => {
    assert.deepEqual(priceOf(product(), v('x', {}, 250, 200)), { price: 250, salePrice: 200 });
  });

  it('drops a sale that is not below the price', () => {
    assert.deepEqual(priceOf(product(), v('x', {}, 150, null)), { price: 150, salePrice: null });
  });

  it('uses the product when no variant matched', () => {
    assert.deepEqual(priceOf(product()), { price: 190, salePrice: 160 });
  });
});

describe('unavailableReason', () => {
  it('limits a later option by the earlier ones (size by color)', () => {
    assert.equal(unavailableReason(trap, brown38, 'size', '40'), 'missing');
    assert.equal(unavailableReason(trap, brown38, 'size', '38'), null);
  });

  it('never limits an earlier option by a later one, so the user cannot get stuck', () => {
    assert.equal(unavailableReason(trap, brown38, 'color', 'black'), null);
  });

  it('marks a value with no variant at all as missing', () => {
    const ghost = product({ options: trap.options, variants: [v('b38', brown38)] });
    assert.equal(unavailableReason(ghost, brown38, 'color', 'black'), 'missing');
  });

  it('restricts nothing when the product has no variants', () => {
    assert.equal(unavailableReason(product({ variants: [] }), brown38, 'size', '99'), null);
  });

  it('marks sold-out as unavailable when stock is tracked and orders are blocked', () => {
    assert.equal(unavailableReason(stocked(), brown38, 'size', '38'), 'sold-out');
    assert.equal(unavailableReason(stocked(), brown38, 'size', '40'), null);
    assert.equal(unavailableReason(stocked(), brown38, 'color', 'black'), 'sold-out');
  });

  it('allows sold-out when orders are not blocked or stock is not tracked', () => {
    assert.equal(unavailableReason(stocked({ blockOrdersWhenOutOfStock: false }), brown38, 'size', '38'), null);
    assert.equal(unavailableReason(stocked({ trackStock: false }), brown38, 'size', '38'), null);
  });
});

describe('nextSelection', () => {
  it('keeps a valid pick', () => {
    assert.deepEqual(nextSelection(trap, brown38, 'size', '38'), brown38);
  });

  it('moves later options to a variant that exists', () => {
    assert.deepEqual(nextSelection(trap, brown38, 'color', 'black'), { color: 'black', size: '40' });
  });

  it('moves off a sold-out combination to an orderable one', () => {
    assert.deepEqual(nextSelection(stocked(), { color: 'black', size: '38' }, 'color', 'brown'), { color: 'brown', size: '40' });
  });

  it('accepts any pick when there are no variants', () => {
    assert.deepEqual(nextSelection(product({ variants: [] }), { color: 'red' }, 'color', 'blue'), { color: 'blue' });
  });
});

describe('stockOf', () => {
  const tracked = (over: Partial<Product> = {}) => product({ trackStock: true, blockOrdersWhenOutOfStock: true, quantity: 7, ...over });

  it('returns null when stock is not tracked', () => {
    assert.equal(stockOf(product({ trackStock: false }), v('x', {})), null);
  });

  it("uses the variant's quantity", () => {
    assert.deepEqual(stockOf(tracked(), v('x', {}, 100, null, 3)), { quantity: 3, canOrder: true });
  });

  it('blocks ordering at 0 only when the store says so', () => {
    assert.deepEqual(stockOf(tracked(), v('x', {}, 100, null, 0)), { quantity: 0, canOrder: false });
    assert.deepEqual(stockOf(tracked({ blockOrdersWhenOutOfStock: false }), v('x', {}, 100, null, 0)), { quantity: 0, canOrder: true });
  });

  it("uses the product's quantity when there are no variants", () => {
    assert.deepEqual(stockOf(tracked({ variants: [] })), { quantity: 7, canOrder: true });
  });

  it('treats an unmatched variant as out of stock', () => {
    assert.deepEqual(stockOf(tracked()), { quantity: 0, canOrder: false });
  });
});

describe('toCartItem', () => {
  const shoe = product({
    id: 'p', name: 'Shoe', images: ['main.jpg'],
    options: [{ name: 'color', type: 'image', values: [{ id: '1', name: 'red', image: 'red.jpg' }] }],
  });

  it("snapshots the charged price, the selected swatch image and the variant's options", () => {
    assert.deepEqual(toCartItem(shoe, { color: 'red', size: '40' }, variants[1]), {
      variantId: 'b', name: 'Shoe', image: 'red.jpg', price: 100, options: { color: 'red', size: '40' }, quantity: 1, maxQuantity: null,
    });
  });

  it('caps quantity at variant stock when orders are blocked', () => {
    assert.equal(toCartItem({ ...shoe, trackStock: true, blockOrdersWhenOutOfStock: true }, {}, variants[1]).maxQuantity, 1);
  });

  it('falls back to the product id and main image when there is no variant', () => {
    const plain = product({ id: 'p', images: ['main.jpg'], options: [], variants: [] });
    const cartItem = toCartItem(plain, {}, undefined);
    assert.equal(cartItem.variantId, 'p');
    assert.equal(cartItem.image, 'main.jpg');
  });
});
