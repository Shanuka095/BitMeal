import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the Cart Context
const CartContext = createContext();

// Custom hook to use the cart context
export const useCart = () => {
  return useContext(CartContext);
};

// Cart Provider component
export const CartProvider = ({ children }) => {
  // Initialize cart from sessionStorage to persist across refreshes (within the same tab)
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = sessionStorage.getItem('bitmeal_cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error("Failed to parse cart from sessionStorage:", error);
      return [];
    }
  });

  // Save cart items to sessionStorage whenever they change
  useEffect(() => {
    sessionStorage.setItem('bitmeal_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Function to add an item to the cart or update its quantity/size
  const addToCart = (item, quantity = 1, size = 'normal', restaurantId) => {
    setCartItems(prevItems => {
      // Ensure restaurantId is valid before proceeding
      if (!restaurantId) {
        console.error("Attempted to add item to cart without a valid restaurantId:", item);
        return prevItems; // Do not add item if restaurantId is missing
      }

      const existingItemIndex = prevItems.findIndex(
        cartItem => cartItem.menuItemId === item._id && cartItem.size === size
      );

      // Optional: If you want to restrict cart to one restaurant at a time
      if (prevItems.length > 0 && prevItems[0].restaurantId !== restaurantId) {
        alert("You can only order from one restaurant at a time. Please clear your cart first.");
        return prevItems; // Prevent adding items from different restaurants
      }


      if (existingItemIndex > -1) {
        // Item with same ID and size exists, update quantity
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += quantity;
        return updatedItems;
      } else {
        // Add new item to cart
        return [
          ...prevItems,
          {
            menuItemId: item._id,
            name: item.name,
            normalPrice: item.normalPrice,
            extraPriceForFull: item.extraPriceForFull,
            category: item.category,
            imageUrl: item.imageUrl,
            restaurantId: restaurantId,
            quantity,
            size,
          },
        ];
      }
    });
  };

  // Function to remove an item completely from the cart
  const removeFromCart = (menuItemId, size) => {
    setCartItems(prevItems =>
      prevItems.filter(item => !(item.menuItemId === menuItemId && item.size === size))
    );
  };

  // Function to increment item quantity
  const incrementQuantity = (menuItemId, size) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.menuItemId === menuItemId && item.size === size
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  // Function to decrement item quantity
  const decrementQuantity = (menuItemId, size) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.menuItemId === menuItemId && item.size === size
          ? { ...item, quantity: item.quantity > 1 ? item.quantity - 1 : 1 }
          : item
      ).filter(item => item.quantity > 0)
    );
  };

  // Calculate total price of an individual cart item based on its size
  const getItemTotalPrice = (cartItem) => {
    const basePrice = cartItem.normalPrice || 0;
    const extraPrice = cartItem.extraPriceForFull || 0;
    const pricePerUnit = cartItem.size === 'full' ? basePrice + extraPrice : basePrice;
    return pricePerUnit * cartItem.quantity;
  };

  // Calculate overall cart total
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + getItemTotalPrice(item), 0);
  };

  // Get total number of unique items in cart (for cart icon badge)
  const getTotalItemsInCart = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // Clear the entire cart
  const clearCart = () => {
    setCartItems([]);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    incrementQuantity,
    decrementQuantity,
    getItemTotalPrice,
    getCartTotal,
    getTotalItemsInCart,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
