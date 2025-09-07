import { BookProps } from "../../../../schemas/schemas"
import { useState } from "react"

export function Book({ bookContent }: { bookContent: BookProps }) {
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };
    
    return (
        <div 
            onMouseEnter={handleMouseEnter} 
            onMouseLeave={handleMouseLeave}
            className="relative transition-transform duration-200 ease-in-out hover:scale-105"
        >
            <img 
                src={bookContent.img} 
                alt={bookContent.title} 
                className="h-40 object-cover mb-4 rounded shadow-lg transition-shadow duration-200 hover:shadow-xl"
            />
            
            {/* Always reserve space for text content to prevent layout shifts */}
            <div className="h-16 flex flex-col justify-center">
                <h3 className={`font-semibold transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0'} text-white`}>
                    {bookContent.title}
                </h3>
                <p className={`text-sm text-gray-400 transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                    {bookContent.author}
                </p>
            </div>
        </div>
    )
}