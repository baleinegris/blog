import { papers } from "../../../assets/constants";

export default function PaperCards(){
    return (
        <div className='flex flex-row flex-wrap'>
        {papers.map((paper, index) =>
            {
                return (
                <a href={paper.link} rel="noreferrer" className="no-underline p-4" key={index}>
                <div className="flex flex-col items-center justify-center p-[5px] cursor-pointer" >
                    <div className="p-6 w-[400px] h-[550px] flex flex-col gap-1 bg-gray-900 hover:bg-gray-300 text-white hover:text-black transition-all rounded-lg shadow-lg hover:shadow-2xl duration-300 overflow-hidden">
                        <img src={paper.img} className="w-full h-[380px] object-cover object-top rounded-lg border border-gray-700"/>
                        <div className="text-[1.5rem] font-bold underline">{paper.name}</div>
                        <div className="text-[1rem]">{paper.authors.join(", ")}</div>
                    </div>
                </div>
                </a>
                )
            }
            )}
        </div>
    )
}
