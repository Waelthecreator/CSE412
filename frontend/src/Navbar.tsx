import "./styles.css";

const Navbar = () => {
  return (
    <nav className="bg-gray-900 text-white py-4 px-10">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">FeedMeNow</h1>
        <ul className="flex space-x-6">
          <li><a href="reservations" className="hover:text-gray-300 px-2">My Reservations</a></li>
          <li><a href="/" className="hover:text-gray-300 px-2">Home</a></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
