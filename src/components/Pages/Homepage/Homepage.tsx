import { IntroBlurb } from '../../../assets/constants';
import { interpolateTextWithLinks } from '../../../util/textInterpolation.tsx';
import { Link } from 'react-router-dom';

export default function Homepage() {
    const introText = interpolateTextWithLinks(IntroBlurb);
    return (
        <div className='flex flex-row justify-between gap-4'>
        <div className="flex flex-col items-left justify-center ml-8 w-[50%] mr-4">
            <h1 className="text-4xl font-bold mb-4">Welcome to Baleinegris's Blog</h1>
            <p className="text-lg mb-8">{introText}</p>
            <div className='flex gap-2'>
                <Link to="/posts/" className="px-6 py-3 w-[30%] min-w-[100px] bg-gray-700 text-gray-100 rounded hover:bg-blue-600 transition">
                    View Posts
                </Link>
                <Link to="/projects/" className="px-6 py-3 w-[30%] min-w-[100px] bg-gray-700 text-gray-100 rounded hover:bg-blue-600 transition">
                    View Projects
                </Link>
            </div>
        </div>
        <img src='/baleinegris-logo.png' className='hidden md:block rounded-4xl glowing mr-4 ml-4'/>
        </div>
    );
}