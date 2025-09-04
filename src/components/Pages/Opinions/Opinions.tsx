import { Link } from 'react-router-dom';

export default function Opinions() {
    return (
        <div className="flex flex-col items-left justify-center ml-8 absolute top-[20%] w-full">
            <h1 className="text-4xl font-bold mb-4">Opinions</h1>
            <Link to="/opinions/books" className="px-6 py-3 w-[30%] min-w-[100px] bg-gray-700 text-gray-100 rounded hover:bg-blue-600 transition text-center">
                Book Reviews
            </Link>
        </div>
    );
}