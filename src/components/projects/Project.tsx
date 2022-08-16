import "./Project.scss";

const Project = ({ repo }: any) => {
  console.log(repo);
  return (
    <li className="project">
      <a href={repo.html_url}>
        <p className="project__fullname">
          <span className="project__username">{repo.owner.login}</span>/
          <span className="project__repo">{repo.name}</span>
        </p>
      </a>
      <span>{repo.language}</span>
    </li>
  );
};

export default Project;
