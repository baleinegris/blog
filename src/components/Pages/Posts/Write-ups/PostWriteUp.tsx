import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { Link } from 'react-router-dom';

export default function PostWriteUp(){
    const [content, setContent] = useState<string>("Loading...");
    const { name } = useParams<{ name: string }>();
    useEffect(() => {
        const loadContent = async () => {
            try {
                const response = await fetch(`/posts/${name}.md`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const rawMarkdown = await response.text();
                setContent(rawMarkdown);
            } catch (error) {
                console.error("Error loading content:", error);
                setContent("Content not found.");
            }
        };
        loadContent();
    }, [name]);

    return (
        <div className="absolute top-[15%] min-w-screen w-full h-full flex items-center flex-col">
            <div className='max-w-[1000px] w-full'>
                <Link to='/posts' className='ml-4 navbutton relative left-0'>{"<-"} Back to Posts</Link>
                <div className='bg-gray-300 text-black markdown-content p-10 rounded-lg'>
                    <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                        {content}
                    </Markdown>
                </div>
            </div>
        </div>
    );
}