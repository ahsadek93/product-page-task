/// <reference types="node" />
// Each test checks one mapping rule with a tiny DTO. Shape correctness is tsc's job, not this file's.
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import type { ProductDto, VariantDto } from '@/features/product/types/product.dto';
import { toProduct } from './product.adapter.ts';

const dto = (over: Partial<ProductDto> = {}) =>
  ({ id: 'p1', name: 'N', slug: 's', price: 100, sale_price: 0, description: '', thumb: 't', images: [], variations: [], variants: [], categories: [], ...over }) as ProductDto;

const variant = (over: Partial<VariantDto> = {}): VariantDto =>
  ({ id: 'v', product_id: 'p1', price: 100, sale_price: 0, quantity: 1, taager_code: '', variation_props: [], ...over });

describe('toProduct', () => {
  it('maps sale_price 0 to "no sale" (null), on product and variants', () => {
    assert.equal(toProduct(dto({ sale_price: 0 })).salePrice, null);
    assert.equal(toProduct(dto({ sale_price: 80 })).salePrice, 80);
    assert.deepEqual(
      toProduct(dto({ variants: [variant(), variant({ sale_price: 80 })] })).variants.map((v) => v.salePrice),
      [null, 80],
    );
  });

  it('puts the thumb first and drops duplicate and empty images', () => {
    assert.deepEqual(toProduct(dto({ thumb: 'a', images: ['b', 'a'] })).images, ['a', 'b']);
    assert.deepEqual(toProduct(dto({ thumb: '', images: ['b'] })).images, ['b']);
  });

  it("keeps 'image' variations as image, treats anything else as button", () => {
    const [color] = toProduct(dto({
      variations: [{
        id: 'x', name: 'color', product_id: 'p1', type: 'image',
        props: [{ id: '1', name: 'red', variation_id: 'x', value: 'url' }, { id: '2', name: 'blue', variation_id: 'x', value: '' }],
      }],
    })).options;
    assert.equal(color.type, 'image');
    assert.deepEqual(color.values.map((v) => v.image), ['url', undefined]); // empty value → no image

    const [size] = toProduct(dto({ variations: [{ id: 'y', name: 'size', product_id: 'p1', type: 'dropdown', props: [] }] })).options;
    assert.equal(size.type, 'button');
  });

  it('turns variant props into { variationName: propName }', () => {
    const v = variant({ variation_props: [
      { id: '1', variation: 'color', variation_prop: 'red', product_variant_id: 'v' },
      { id: '2', variation: 'size', variation_prop: '40', product_variant_id: 'v' },
    ] });
    assert.deepEqual(toProduct(dto({ variants: [v] })).variants[0].options, { color: 'red', size: '40' });
  });

  it('cleans editor padding from the description but keeps real content', () => {
    const html = '<p>A</p><p><br></p><p> &nbsp; </p><p><br/><br></p><p>B&nbsp;&nbsp;:&nbsp;C</p>';
    assert.equal(toProduct(dto({ description: html })).descriptionHtml, '<p>A</p><p>B : C</p>');
  });

  it('keeps only id, name and slug of each category', () => {
    const category = { id: 'c', name: 'Mules', slug: 'mules', thumb: 'x', position: 0 } as never;
    assert.deepEqual(toProduct(dto({ categories: [category] })).categories, [{ id: 'c', name: 'Mules', slug: 'mules' }]);
  });

  it('reads stock flags as strict booleans, defaulting to off', () => {
    const on = toProduct(dto({ track_stock: true, disable_orders_for_no_stock: true, quantity: 4 }));
    assert.deepEqual([on.trackStock, on.blockOrdersWhenOutOfStock, on.quantity], [true, true, 4]);
    const off = toProduct(dto());
    assert.deepEqual([off.trackStock, off.blockOrdersWhenOutOfStock, off.quantity], [false, false, 0]);
  });

  it('does not crash on null lists and strings from the API', () => {
    const empty = toProduct(dto({ images: null, variations: null, variants: null, categories: null, description: null as never }));
    assert.deepEqual([empty.images, empty.options, empty.variants, empty.categories, empty.descriptionHtml], [['t'], [], [], [], '']);
  });

  it('throws on missing or wrong-typed critical fields instead of rendering undefined/NaN', () => {
    for (const field of ['id', 'name', 'price'] as const) {
      assert.throws(() => toProduct(dto({ [field]: undefined })), new RegExp(field));
    }
    assert.throws(() => toProduct(dto({ price: '100' as never })), /price/);
    assert.throws(() => toProduct(null as never), /id/);
  });
});
