import PostBanner from "./PostBanner";
import { postBanners } from "../../../assets/constants";

export default function Posts() {
    return (
        <div className="flex flex-col items-left justify-center ml-8 absolute top-[20%] w-full">
            <h1 className="text-4xl font-bold mb-4">My Posts</h1>
            <div className="flex flex-col items-left justify-start">
                {postBanners.map((post, index) => (
                    <PostBanner
                        key={index}
                        title={post.title}
                        content={post.content}
                        date={post.date}
                        href={post.href}
                    />
                ))}
            </div>
        </div>
    );
}