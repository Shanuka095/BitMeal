import { useParams } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import MenuItemModal from '../components/MenuItemModal';
import { useCart } from '../context/CartContext';
import { FaPlus, FaMinus, FaTrash } from 'react-icons/fa';
import { useModal } from '../context/ModalContext'; // Import useModal

const RestaurantDetails = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [orderMessage, setOrderMessage] = useState('');
  const [userRole, setUserRole] = useState(null);
  const [groupedMenu, setGroupedMenu] = useState({});
  const categoryRefs = useRef({});

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);

  const { addToCart, cartItems, incrementQuantity, decrementQuantity, removeFromCart } = useCart();
  const { showAlert, showPrompt } = useModal(); // Use useModal hook

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      setError('');
      const sessionKey = Object.keys(sessionStorage).find(key => key.startsWith('token_'));
      const token = sessionKey ? sessionStorage.getItem(sessionKey) : null;

      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          setUserRole(decodedToken.role);
        } catch (decodeError) {
          console.error("Error decoding token:", decodeError);
          if (sessionKey) sessionStorage.removeItem(sessionKey);
          setUserRole(null);
        }
      } else {
        setUserRole(null);
      }

      try {
        const response = await axios.get(`http://localhost:3003/api/restaurants/public/${id}`);
        setRestaurant(response.data);

        const menu = response.data.menu || [];
        const newGroupedMenu = menu.reduce((acc, item) => {
          const category = item.category || 'Uncategorized';
          if (!acc[category]) {
            acc[category] = [];
          }
          acc[category].push(item);
          return acc;
        }, {});
        setGroupedMenu(newGroupedMenu);

      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch restaurant details');
        console.error('Frontend (RestaurantDetails) - Fetch error:', err.response ? err.response.data : err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  const getDisplayPrice = (item, size) => {
    const normalPrice = item.normalPrice || 0;
    const extraPriceForFull = item.extraPriceForFull || 0;
    return size === 'full' ? normalPrice + extraPriceForFull : normalPrice;
  };

  const handleOpenModal = (item) => {
    setSelectedMenuItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMenuItem(null);
  };

  const handleAddToCartFromButton = (item) => {
    if (!restaurant || !restaurant._id) {
      console.error("Restaurant ID is not available yet when trying to add to cart.");
      showAlert("Cannot add to cart: Restaurant data not fully loaded.");
      return;
    }
    addToCart(item, 1, 'normal', restaurant._id);
    showAlert(`'${item.name}' added to cart!`);
  };

  const scrollToCategory = (category) => {
    if (categoryRefs.current[category]) {
      categoryRefs.current[category].scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (loading) return <div className="p-6 text-center pt-24"><p className="text-gray-600">Loading...</p></div>;
  if (error) return <div className="p-6 text-center pt-24"><p className="text-red-600">{error}</p></div>;
  if (!restaurant) return <div className="p-6 text-center pt-24"><p className="text-gray-600">Restaurant not found</p></div>;

  const categories = Object.keys(groupedMenu);

  return (
    <div className="p-6 pt-24 max-w-7xl mx-auto flex flex-col lg:flex-row">
      {/* Restaurant Header */}
      <div className="w-full lg:w-3/4 lg:pr-8">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-6 text-center lg:text-left">{restaurant.name}</h1>
        {restaurant.imageUrl && (
          <div className="mb-8 flex justify-center lg:justify-start">
            <img
              src={`http://localhost:3003/uploads/${restaurant.imageUrl}`}
              alt={restaurant.name}
              className="w-full max-w-lg h-80 object-cover rounded-xl shadow-xl border border-gray-200"
            />
          </div>
        )}
        <p className="text-lg text-gray-700 mb-8 text-center lg:text-left"><strong>Address:</strong> {restaurant.address}</p>
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center lg:text-left">Menu</h2>

        {orderMessage && (
          <div className={`p-3 mb-4 rounded-md text-center ${orderMessage.startsWith('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {orderMessage}
          </div>
        )}

        {/* Menu Items Grouped by Category */}
        {categories.length > 0 ? (
          <div className="space-y-8">
            {categories.map(category => (
              <div key={category} ref={el => categoryRefs.current[category] = el} className="mb-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-[#ffaa00] pb-2">{category}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                  {(groupedMenu[category] || []).map((item) => {
                    if (!item) return null;

                    const cartItemNormal = cartItems.find(cartIt => cartIt.menuItemId === item._id && cartIt.size === 'normal');
                    const cartItemFull = cartItems.find(cartIt => cartIt.menuItemId === item._id && cartIt.size === 'full');

                    return (
                      <div
                        key={item._id}
                        className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition flex flex-col justify-between border border-gray-100 cursor-pointer"
                        onClick={() => handleOpenModal(item)}
                      >
                        <div>
                          <h4 className="text-xl font-semibold text-gray-800 mb-2">{item.name}</h4>
                          {item.imageUrl && (
                            <img
                              src={`http://localhost:3003/uploads/${item.imageUrl}`}
                              alt={item.name}
                              className="mt-2 w-full h-40 object-cover rounded-md shadow-sm mb-3"
                            />
                          )}
                          <p className="text-gray-700 font-bold mb-1">
                            Normal: Rs. {(item.normalPrice || 0).toFixed(2)}
                            {(item.extraPriceForFull || 0) > 0 && ` | Full: Rs. ${((item.normalPrice || 0) + (item.extraPriceForFull || 0)).toFixed(2)}`}
                          </p>
                        </div>
                        {userRole === 'customer' && restaurant && restaurant._id && (
                          <div className="mt-5 flex justify-end">
                            {cartItemNormal || cartItemFull ? (
                              <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                                <button
                                  onClick={(e) => { e.stopPropagation(); removeFromCart(item._id, cartItemNormal ? 'normal' : 'full'); }}
                                  className="text-red-500 w-8 h-8 rounded-md flex items-center justify-center hover:bg-red-600 hover:text-white transition"
                                >
                                  <FaTrash size={16} />
                                </button>
                                <span className="font-semibold text-lg text-gray-800 w-8 text-center">
                                  {cartItemNormal?.quantity || cartItemFull?.quantity || 0}
                                </span>
                                <button
                                  onClick={(e) => { e.stopPropagation(); handleOpenModal(item); }}
                                  className="bg-[#ffaa00] text-white w-8 h-8 rounded-md flex items-center justify-center hover:bg-[#e59400] transition"
                                >
                                  <FaPlus size={16} />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={(e) => { e.stopPropagation(); handleAddToCartFromButton(item); }}
                                className="bg-[#ffaa00] text-white px-5 py-2.5 rounded-lg hover:bg-[#e59400] transition font-semibold text-lg shadow-md hover:shadow-lg flex items-center justify-center"
                              >
                                <FaPlus className="mr-2" /> Add
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center text-lg">No menu items available for this restaurant.</p>
        )}
      </div>

      {/* Category Navigation (Right Side) */}
      {categories.length > 0 && (
        <div className="w-full lg:w-1/4 lg:pl-8 mt-10 lg:mt-0 sticky top-24 self-start">
          <div className="bg-white p-6 rounded-xl shadow-xl border border-gray-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Menu Categories</h3>
            <ul className="space-y-3">
              {categories.map(category => (
                <li key={category}>
                  <button
                    onClick={() => scrollToCategory(category)}
                    className="w-full text-left p-3 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-[#ffaa00] transition duration-200 font-medium"
                  >
                    {category}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Menu Item Details Modal */}
      {isModalOpen && selectedMenuItem && restaurant && restaurant._id && (
        <MenuItemModal item={selectedMenuItem} onClose={handleCloseModal} restaurantId={restaurant._id} />
      )}
    </div>
  );
};

export default RestaurantDetails;
