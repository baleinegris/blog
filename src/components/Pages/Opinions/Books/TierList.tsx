interface BookContent {
    title: string;
    author: string;
    img: any;
}

interface TierListElement {
    content: BookContent;
    tier: string;
}

export default function TierList( { elements } : { elements: TierListElement[] } ) {
    const tiers = ["S", "A", "B", "C", "D", "Not Done"];
    const tierColors: { [key: string]: string } = {
        "S": "bg-red-500",
        "A": "bg-orange-500",
        "B": "bg-yellow-500",
        "C": "bg-green-500",
        "D": "bg-blue-500",
        "Not Done": "bg-gray-500",
    };
    return (
<div className="min-h-screen bg-gray-900 absolute top-[20%] w-full">
            <h1 className="text-3xl font-bold text-white mb-8 text-center py-6">Book Tier List</h1>
            {tiers.map( (tier) => {
                const tierBooks = elements.filter( (el) => el.tier === tier );
                return (
                    <div key={tier} className="flex mb-4 min-h-[120px]">
                        <div className={`${tierColors[tier]} w-20 flex items-center justify-center`}>
                            <div className="font-bold text-2xl text-white transform -rotate-0">{tier}</div>
                        </div>
                        <div className="flex-1 bg-gray-800 p-4">
                            {tierBooks.length > 0 ? (
                                <div className="h-full flex flex-wrap gap-4">
                                    {tierBooks.map( (el) => (
                                            <img src={el.content.img} alt={el.content.title} className="h-40 object-cover mb-4 rounded"/>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-500 italic">
                                    No books in this tier yet
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}