import { IntroBlurb } from '../text/Content';
import { interpolateTextWithLinks } from '../util/textInterpolation';


export default function Homepage() {
    const introText = interpolateTextWithLinks(IntroBlurb);
    return (
        <div className="flex flex-col items-left justify-center ml-8 w-[60%]">
            <h1 className="text-4xl font-bold mb-4">Welcome to Baleinegris's Blog</h1>
            <p className="text-lg mb-8">{introText}</p>
            <a href="/posts" className="px-6 py-3 w-[40%] bg-blue-500 text-gray-100 rounded hover:bg-blue-600 transition">
                View Posts
            </a>
        </div>
    );
    }