import { useMemo, useState } from "react";

export function createCartItem(product, typeLabel, language, getLocalizedProductName, parsePrice) {
  const id = getLocalizedProductName(product, language);
  return {
    id,
    name: id,
    price: parsePrice(product.price),
    priceLabel: product.price,
    quantity: 1,
    typeLabel,
  };
}

export function addOrIncrementItem(currentItems, nextItem) {
  const existing = currentItems.find((item) => item.id === nextItem.id);
  if (!existing) return [...currentItems, nextItem];

  return currentItems.map((item) => (item.id === nextItem.id ? { ...item, quantity: item.quantity + 1 } : item));
}

export function decrementOrRemoveItem(currentItems, id) {
  return currentItems.flatMap((item) => {
    if (item.id !== id) return item;
    if (item.quantity <= 1) return [];
    return { ...item, quantity: item.quantity - 1 };
  });
}

export function useCart({ language, getLocalizedProductName, parsePrice }) {
  const [items, setItems] = useState([]);

  const addItem = (product, typeLabel) => {
    setItems((currentItems) => {
      const nextItem = createCartItem(product, typeLabel, language, getLocalizedProductName, parsePrice);
      return addOrIncrementItem(currentItems, nextItem);
    });
  };

  const removeItem = (id) => {
    setItems((currentItems) => decrementOrRemoveItem(currentItems, id));
  };

  const getItemQuantity = (product) => {
    const id = getLocalizedProductName(product, language);
    return items.find((item) => item.id === id)?.quantity ?? 0;
  };

  const totalItems = useMemo(() => items.reduce((acc, item) => acc + item.quantity, 0), [items]);
  const totalAmount = useMemo(() => items.reduce((acc, item) => acc + item.price * item.quantity, 0), [items]);

  return {
    items,
    addItem,
    removeItem,
    getItemQuantity,
    totalItems,
    totalAmount,
  };
}
