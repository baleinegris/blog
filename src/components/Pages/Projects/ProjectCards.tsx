import { projects, technologyColors } from "../../../assets/constants";


export default function ProjectCards(){
    return (
        <div className='flex flex-row flex-wrap'>
        {projects.map((project, index) =>
            {
                return (
                <a href={project.link} rel="noreferrer" className="no-underline p-4" key={index}>
                <div className="flex flex-col items-center justify-center p-[5px] cursor-pointer" >
                    <div className="p-6 w-[400px] h-[500px] flex flex-col gap-1 bg-gray-900 hover:bg-gray-300 text-white hover:text-black transition-all rounded-lg shadow-lg hover:shadow-2xl duration-300 relative">
                        <img src={project.img} className="w-[full] h-[auto] rounded-lg"/>
                        <div className="text-[1.5rem] font-bold underline">{project.name}</div>
                        <div className="text-[1rem]">{project.description}</div>
                        <div className="flex items-center justify-center w-full absolute bottom-[10px] left-0">
                            <div className="font-bold flex flex-row justify-center items-center flex-wrap gap-2 bottom-0 left-0 p-2 bg-gray-900 rounded-xl">
                            {project.technologies.map((tech, index) =>
                                {
                                    return (
                                    <div className={`${technologyColors[tech]}`} key={index}>{tech}</div>
                                    )
                                }
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                </a>
                )
            }
            )}
        </div>
    )
}