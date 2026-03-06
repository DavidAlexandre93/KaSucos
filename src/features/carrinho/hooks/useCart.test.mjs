import test from "node:test";
import assert from "node:assert/strict";
import { addOrIncrementItem, createCartItem, decrementOrRemoveItem } from "./useCart.js";

const getLocalizedProductName = (product, language) => product.title?.[language] ?? product.name;
const parsePrice = (price) => Number(price.replace("R$", "").replace(",", ".").trim());

test("createCartItem cria item com preço numérico", () => {
  const item = createCartItem({ title: { pt: "Suco de Laranja" }, price: "R$ 9,50" }, "un", "pt", getLocalizedProductName, parsePrice);

  assert.equal(item.id, "Suco de Laranja");
  assert.equal(item.price, 9.5);
  assert.equal(item.quantity, 1);
});

test("addOrIncrementItem incrementa item existente", () => {
  const items = [{ id: "Suco de Uva", quantity: 1 }];
  const result = addOrIncrementItem(items, { id: "Suco de Uva", quantity: 1 });
  assert.equal(result.length, 1);
  assert.equal(result[0].quantity, 2);
});

test("decrementOrRemoveItem remove item com quantidade 1", () => {
  const items = [{ id: "A", quantity: 1 }, { id: "B", quantity: 2 }];
  const result = decrementOrRemoveItem(items, "A");
  assert.deepEqual(result, [{ id: "B", quantity: 2 }]);
});
