import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import { useState, useEffect } from 'react';
import {useParams} from "react-router-dom";
import { Link } from 'react-router-dom';

export default function ProjectWriteUp(){
    const [content, setContent] = useState<string>("Loading...");
    const { name } = useParams<{ name: string }>();
    useEffect(() => {
        const loadContent = async () => {
            try {
                const response = await fetch(`/projects/${name}.md`);
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
        <>
        <Link to='/projects' className='ml-4 navbutton relative'>{"<-"} Back to Projects</Link>
        <div className="w-full h-full p-10 bg-gray-300 text-black">
            <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                {content}
            </Markdown>
        </div>
        </>
    );
}