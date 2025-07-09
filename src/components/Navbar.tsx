import { Link } from 'react-router-dom';
export default function Navbar() {
  return (
    <div className="fixed top-0 w-full flex justify-end p-5">
        <Link to="/" className="text-gray-300 hover:text-white navbutton mx-10 relative">Home</Link>
        <Link to="/projects" className="text-gray-300 hover:text-white mx-10 navbutton relative">Projects</Link>
        <Link to="/posts" className="text-gray-300 hover:text-white mx-10 navbutton relative">Posts</Link>
    </div>
  );
}