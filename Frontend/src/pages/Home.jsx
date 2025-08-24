import { Link } from 'react-router-dom';

const Home = () => {
  return (
    // Removed min-h-screen as footer is now managed by global App.jsx layout
    // The pt-32 ensures content starts below the Navbar and Active Order Banner
    <div className="bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center p-6 pt-32">
      <h1 className="text-5xl font-extrabold text-text-dark mb-6 text-center animate-fade-in-down">Welcome to BitMeal!</h1>
      <p className="text-xl text-gray-700 mb-10 text-center animate-fade-in-down delay-100">
        Your culinary journey begins here. Discover amazing restaurants and get your food delivered.
      </p>
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 animate-fade-in-down delay-200">
        <Link 
          to="/login" 
          className="px-8 py-3 bg-primary-orange text-white rounded-full shadow-lg hover:bg-orange-600 transition-all duration-300 transform hover:scale-105 font-semibold text-lg"
        >
          Sign In
        </Link>
        <Link 
          to="/register" 
          className="px-8 py-3 bg-secondary-dark-grey text-white rounded-full shadow-lg hover:bg-gray-700 transition-all duration-300 transform hover:scale-105 font-semibold text-lg"
        >
          Sign Up
        </Link>
      </div>
      <div className="mt-16 text-center animate-fade-in-down delay-300">
        <p className="text-gray-600 text-md max-w-md">
          Explore a world of flavors, from local delights to international cuisines. Fast, fresh, and convenient.
        </p>
      </div>
    </div>
  );
};

export default Home;
