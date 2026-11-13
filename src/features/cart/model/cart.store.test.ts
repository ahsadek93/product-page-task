/// <reference types="node" />
// Run: node src/features/cart/model/cart.store.test.ts
import assert from 'node:assert/strict';
import type { CartItem } from '@/features/cart/types/cart';
import { cartCount, cartSubtotal, useCartStore } from './cart.store.ts';

const item = (variantId: string, quantity = 1, price = 100, maxQuantity: number | null = null): CartItem =>
  ({ variantId, name: 'Shoe', image: '', price, options: {}, quantity, maxQuantity });
const cart = useCartStore.getState;

// add: new variant → new line, same variant → quantity bump
cart().add(item('a'));
cart().add(item('a', 2));
cart().add(item('b', 1, 50));
assert.deepEqual(cart().items.map((i) => [i.variantId, i.quantity]), [['a', 3], ['b', 1]]);
assert.equal(cartCount(cart().items), 4);
assert.equal(cartSubtotal(cart().items), 350);

// setQuantity: sets, and 0 removes the line
cart().setQuantity('a', 5);
assert.equal(cart().items[0].quantity, 5);
cart().setQuantity('a', 0);
assert.deepEqual(cart().items.map((i) => i.variantId), ['b']);

cart().remove('b');
assert.equal(cart().items.length, 0);
cart().add(item('c'));
cart().clear();
assert.equal(cart().items.length, 0);

// stock cap: add and setQuantity never exceed maxQuantity
cart().add(item('d', 2, 100, 3));
cart().add(item('d', 5, 100, 3));
assert.equal(cart().items[0].quantity, 3);
cart().setQuantity('d', 10);
assert.equal(cart().items[0].quantity, 3);
cart().clear();

console.log('cart ok');
