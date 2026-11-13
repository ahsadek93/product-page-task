/// <reference types="node" />
import { beforeEach, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import type { CartItem } from '@/features/cart/types/cart';

// Node has no window.localStorage (what persist reads): give it an in-memory one *before* the store module loads.
const saved = new Map<string, string>();
const localStorage = {
  getItem: (k: string) => saved.get(k) ?? null,
  setItem: (k: string, v: string) => void saved.set(k, v),
  removeItem: (k: string) => void saved.delete(k),
};
Object.assign(globalThis, { window: { localStorage } });
const { cartCount, cartSubtotal, useCartStore } = await import('./cart.store.ts');

const item = (variantId: string, quantity = 1, price = 100, maxQuantity: number | null = null): CartItem =>
  ({ variantId, name: 'Shoe', image: '', price, options: {}, quantity, maxQuantity });
const cart = useCartStore.getState;
const lines = () => cart().items.map((i) => [i.variantId, i.quantity]);

beforeEach(() => {
  useCartStore.setState({ items: [], isOpen: false, lastAdded: null });
  saved.clear(); // after setState: persist writes on every setState, so clearing first would be undone
});

describe('add', () => {
  it('adds a new variant as a new line', () => {
    cart().add(item('a'));
    cart().add(item('b', 2));
    assert.deepEqual(lines(), [['a', 1], ['b', 2]]);
  });

  it('merges the same variant into one line', () => {
    cart().add(item('a'));
    cart().add(item('a', 2));
    assert.deepEqual(lines(), [['a', 3]]);
  });

  it('caps a new line at its stock', () => {
    cart().add(item('a', 5, 100, 3));
    assert.deepEqual(lines(), [['a', 3]]);
  });

  it('caps a merged line at its stock', () => {
    cart().add(item('a', 2, 100, 3));
    cart().add(item('a', 2, 100, 3));
    assert.deepEqual(lines(), [['a', 3]]);
  });

  it('records every add as a new lastAdded event, merges included', () => {
    cart().add(item('a'));
    cart().add(item('a'));
    assert.equal(cart().lastAdded?.item.variantId, 'a');
    assert.equal(cart().lastAdded?.id, 2);
  });
});

describe('setQuantity', () => {
  it('sets the quantity', () => {
    cart().add(item('a'));
    cart().setQuantity('a', 4);
    assert.deepEqual(lines(), [['a', 4]]);
  });

  it('caps at stock', () => {
    cart().add(item('a', 1, 100, 3));
    cart().setQuantity('a', 10);
    assert.deepEqual(lines(), [['a', 3]]);
  });

  it('removes the line at 0 or below', () => {
    cart().add(item('a'));
    cart().add(item('b'));
    cart().setQuantity('a', 0);
    cart().setQuantity('b', -1);
    assert.deepEqual(lines(), []);
  });

  it('ignores an unknown variant', () => {
    cart().add(item('a'));
    cart().setQuantity('zzz', 5);
    assert.deepEqual(lines(), [['a', 1]]);
  });
});

describe('remove / clear / setOpen', () => {
  it('remove drops only that line', () => {
    cart().add(item('a'));
    cart().add(item('b'));
    cart().remove('a');
    assert.deepEqual(lines(), [['b', 1]]);
  });

  it('clear empties the cart', () => {
    cart().add(item('a'));
    cart().add(item('b'));
    cart().clear();
    assert.deepEqual(lines(), []);
  });

  it('setOpen toggles the drawer', () => {
    cart().setOpen(true);
    assert.equal(cart().isOpen, true);
    cart().setOpen(false);
    assert.equal(cart().isOpen, false);
  });
});

describe('persistence', () => {
  it('saves items only, not drawer or toast state', () => {
    cart().add(item('a', 2));
    cart().setOpen(true);
    const { state } = JSON.parse(saved.get('cart')!);
    assert.deepEqual(Object.keys(state), ['items']);
    assert.deepEqual(state.items.map((i: CartItem) => [i.variantId, i.quantity]), [['a', 2]]);
  });

  it('restores items from storage on rehydrate', async () => {
    saved.set('cart', JSON.stringify({ state: { items: [item('a', 2)] }, version: 0 }));
    await useCartStore.persist.rehydrate();
    assert.deepEqual(lines(), [['a', 2]]);
  });
});

describe('cartCount / cartSubtotal', () => {
  it('sum quantities and price × quantity', () => {
    const items = [item('a', 3, 100), item('b', 1, 50)];
    assert.equal(cartCount(items), 4);
    assert.equal(cartSubtotal(items), 350);
  });

  it('are 0 for an empty cart', () => {
    assert.equal(cartCount([]), 0);
    assert.equal(cartSubtotal([]), 0);
  });
});
