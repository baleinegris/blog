import { ProjectsBlurb } from '../../../assets/constants';
import { interpolateTextWithLinks } from '../../../util/textInterpolation';
import ProjectCards from './ProjectCards';

export default function Projects() {
    const projectsText = interpolateTextWithLinks(ProjectsBlurb);
    return (
        <>
        <div className="flex flex-col items-left justify-center ml-8 absolute top-[20%]">
            <h1 className="text-4xl font-bold mb-4">My Projects</h1>
            <p className="text-lg mb-8">{projectsText}</p>
            <ProjectCards />
        </div>
        </>
    );
}