import Project from "./Project";
import repositories from "./Repositories.json";
import type { Repository } from "./github.d.js";
import "./Projects.scss";

const Projects = () => {
    let repos: Repository[] = [];
    Object.keys(repositories).map((i) => {
        repos.push(repositories[i]);
    });

    return (
        <ul className="projects">
            {repos.map((repo: Repository) => (
                <Project repo={repo} />
            ))}
        </ul>
    );
};

export default Projects;
