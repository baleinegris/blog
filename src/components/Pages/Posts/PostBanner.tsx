import { Link } from "react-router-dom";

interface PostProps {
    title: string;
    content: string;
    date: string;
    href: string;
}


export default function PostBanner( { title, content, date, href } : PostProps) {
    return (
        <Link to={href} className="no-underline">
        <div className="flex flex-col md:flex-row items-center bg-gray-900 hover:bg-gray-300 text-white hover:text-black transition-all duration-500 rounded-lg p-4 mb-4 w-[80%]">
            <img src="/baleinegris-logo.png" className="w-8 h-8 mr-2 mt-1 h-[200px] w-[200px] rounded-2xl" alt="Post Icon"/>
            <div className="flex flex-col">
                <div className="flex justify-between w-full"><h2>{title}</h2> <div>{date}</div></div>
                <div>{content}</div>
            </div>
        </div>
        </Link>
    );
}