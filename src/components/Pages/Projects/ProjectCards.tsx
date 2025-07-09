import { projects, technologyColors } from "../../../assets/constants";


export default function ProjectCards(){
    return (
        <div className='flex flex-row flex-wrap'>
        {projects.map((project, index) =>
            {
                return (
                <a href={project.link} rel="noreferrer" className="no-underline p-4" key={index}>
                <div className="flex flex-col items-center justify-center p-[5px] cursor-pointer hover:opacity-110 opacity-100" >
                    <div className="p-6 w-[400px] h-[500px] flex flex-col gap-1 relative bg-gray-900 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
                        <img src={project.img} className="w-[full] h-[auto] rounded-lg"/>
                        <div className="text-white text-[1.5rem] font-bold underline">{project.name}</div>
                        <div className="text-white text-[1rem]">{project.description}</div>
                        <div className="font-bold bg-gray-800 technologies flex flex-row justify-center items-center flex-wrap gap-2 bottom-0 left-0 absolute w-full">
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
                </a>
                )
            }
            )}
        </div>
    )
}