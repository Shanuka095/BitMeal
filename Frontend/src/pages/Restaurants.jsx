import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Restaurants = ({ standalone }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurants = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:3003/api/restaurants/public');
        const data = response.data.data || response.data;
        setRestaurants(Array.isArray(data) ? data : []);
        setFilteredRestaurants(Array.isArray(data) ? data : []); // Initialize filtered list
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch restaurants');
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, []);

  // Effect for search functionality
  useEffect(() => {
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    if (lowercasedSearchTerm === '') {
      setFilteredRestaurants(restaurants); // Show all if search term is empty
      return;
    }

    const results = restaurants.filter(restaurant => {
      // Search by restaurant name
      if (restaurant.name.toLowerCase().includes(lowercasedSearchTerm)) {
        return true;
      }
      // Search by menu item name within the restaurant's menu
      if (restaurant.menu && restaurant.menu.some(item =>
        item.name.toLowerCase().includes(lowercasedSearchTerm)
      )) {
        return true;
      }
      return false;
    });
    setFilteredRestaurants(results);
  }, [searchTerm, restaurants]); // Re-run when search term or original restaurants list changes

  if (loading) return <div className="p-6 text-center"><p className="text-gray-600">Loading...</p></div>;
  return (
    <div className="p-6 pt-24"> {/* Added pt-24 to push content below Navbar */}
      <h2 className="text-3xl font-bold text-gray-800 mb-6">{standalone ? 'Restaurants' : 'Explore Restaurants'}</h2>

      {/* Search Bar */}
      <div className="mb-8 max-w-xl mx-auto">
        <input
          type="text"
          placeholder="Search restaurants or menu items..."
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ffaa00] text-gray-700"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {error ? (
        <p className="text-red-600 text-center text-lg font-semibold">{error}</p>
      ) : filteredRestaurants.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredRestaurants.map((restaurant) => (
            <Link
              key={restaurant._id}
              to={`/restaurant/${restaurant._id}`}
              className="block bg-white p-5 rounded-xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-2 duration-300 border border-gray-100 group"
            >
              {restaurant.imageUrl && (
                <img
                  src={`http://localhost:3003/uploads/${restaurant.imageUrl}`}
                  alt={restaurant.name}
                  className="w-full h-48 object-cover rounded-lg mb-4 shadow-md group-hover:scale-105 transition-transform duration-300"
                />
              )}
              <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-[#ffaa00] transition-colors duration-300">{restaurant.name}</h3>
              <p className="text-sm text-gray-600 mb-3">{restaurant.address}</p>
              <p className="text-sm text-gray-500 font-medium">Menu Items: {restaurant.menu ? restaurant.menu.length : 0}</p>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-gray-600 text-center text-lg">No restaurants found matching your search.</p>
      )}
    </div>
  );
};

export default Restaurants;
