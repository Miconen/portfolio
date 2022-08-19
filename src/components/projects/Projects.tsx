import { useState, useEffect } from "react";
import Project from "./Project";
import Loading from "./Loading.tsx";
import repositories from "./Repositories.json";
import "./Projects.scss";

interface IGitData {
  [key: string]: string;
}

const Projects = () => {
  const GITHUB_USER = "Miconen";
  const [githubData, setGithubData] = useState<IGitData[]>([]);
  const [isLoading, setLoading] = useState(true);

    
  // const fetchData = async () => {
  //   const response = await fetch(
  //     `https://api.github.com/users/${GITHUB_USER}/repos`
  //   );
  //   let json = await response.json();
  //   setGithubData(json);
  //   setLoading(false);
  //   console.log(json);
  // };

    const fetchData = () => {
        let response = [];
        Object.keys(repositories).map((key) => {
            response.push(repositories[key]); 
        });
        setGithubData(response);
        setLoading(false);
    }

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) return <Loading />;;

  return (
        <ul className="projects">
          {githubData.map((repo) => (
            <Project key={repo.name} repo={repo} />
          ))}
        </ul>
  );
};

export default Projects;
