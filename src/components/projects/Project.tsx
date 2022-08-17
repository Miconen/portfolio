import { GitData } from './github.d.ts'; 
import { getColor } from './LanguageColors.ts';
import "./Project.scss";

const Project = ({ repo }: GitData) => {
  console.log(repo);
  return (
    <li className="project">
      <a href={repo.html_url}>
        <p className="project__fullname">
          <span className="project__username">{repo.owner.login}</span>/
          <span className="project__repo">{repo.name}</span>
        </p>
          <p className="project__description">{repo.description}</p>
      </a>
      <p className="project__language"><span style={{ color: getColor(repo.language)}}>• </span>{repo.language}</p>
    </li>
  );
};

export default Project;
