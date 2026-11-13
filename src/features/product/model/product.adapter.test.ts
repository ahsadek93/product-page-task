/// <reference types="node" />
// Run: node src/features/product/model/product.adapter.test.ts
// Each block tests one mapping rule with a tiny DTO. Shape correctness is tsc's job, not this file's.
import assert from 'node:assert/strict';
import type { ProductDto } from '../types/product.dto';
import { toProduct } from './product.adapter.ts';

const dto = (over: Partial<ProductDto> = {}) =>
  ({ id: 'p1', name: 'N', slug: 's', price: 100, sale_price: 0, description: '', thumb: 't', images: [], variations: [], variants: [], categories: [], ...over }) as ProductDto;

const variant = (sale_price: number) => ({ id: 'v', product_id: 'p1', price: 100, sale_price, quantity: 1, taager_code: '', variation_props: [] });

// sale_price 0 means "no sale" → null; positive is kept (product and variant)
assert.equal(toProduct(dto({ sale_price: 0 })).salePrice, null);
assert.equal(toProduct(dto({ sale_price: 80 })).salePrice, 80);
assert.deepEqual(toProduct(dto({ variants: [variant(0), variant(80)] })).variants.map((v) => v.salePrice), [null, 80]);

// thumb goes first, duplicates and empty strings dropped
assert.deepEqual(toProduct(dto({ thumb: 'a', images: ['b', 'a'] })).images, ['a', 'b']);
assert.deepEqual(toProduct(dto({ thumb: '', images: ['b'] })).images, ['b']);

// variation type: 'image' stays, anything else is a button; empty prop value → no image
const [opt] = toProduct(dto({
  variations: [
    { id: 'x', name: 'color', product_id: 'p1', type: 'image', props: [{ id: '1', name: 'red', variation_id: 'x', value: 'url' }, { id: '2', name: 'blue', variation_id: 'x', value: '' }] },
  ],
})).options;
assert.equal(opt.type, 'image');
assert.deepEqual(opt.values.map((v) => v.image), ['url', undefined]);
assert.equal(toProduct(dto({ variations: [{ id: 'y', name: 'size', product_id: 'p1', type: 'dropdown', props: [] }] })).options[0].type, 'button');

// variant props array → { variationName: propName }
const v = { ...variant(0), variation_props: [
  { id: '1', variation: 'color', variation_prop: 'red', product_variant_id: 'v' },
  { id: '2', variation: 'size', variation_prop: '40', product_variant_id: 'v' },
] };
assert.deepEqual(toProduct(dto({ variants: [v] })).variants[0].options, { color: 'red', size: '40' });

// BE null lists/strings don't crash
const empty = toProduct(dto({ images: null, variations: null, variants: null, categories: null, description: null as never }));
assert.deepEqual([empty.options, empty.variants, empty.categories, empty.descriptionHtml], [[], [], [], '']);

// trust boundary: missing/renamed critical fields throw instead of rendering undefined/NaN
for (const field of ['id', 'name', 'price'] as const) {
  assert.throws(() => toProduct(dto({ [field]: undefined })), new RegExp(field));
}
assert.throws(() => toProduct(dto({ price: '100' as never })), /price/);
assert.throws(() => toProduct(null as never), /id/);

console.log('product.adapter ok');
