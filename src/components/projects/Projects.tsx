import { useState, useEffect } from "react";
import Project from "./Project";
import "./Projects.scss";

interface IGitData {
  [key: string]: string;
}

const Projects = () => {
  const GITHUB_USER = "Miconen";
  const [githubData, setGithubData] = useState<IGitData[]>([]);
  const [isLoading, setLoading] = useState(true);

  const fetchData = async () => {
    const response = await fetch(
      `https://api.github.com/users/${GITHUB_USER}/repos`
    );
    let json = await response.json();
    setGithubData(json);
    setLoading(false);
    console.log(json);
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) return <p>Loading...</p>;

  return <ul className="projects">{ githubData.map((repo) => <Project key={repo.name} repo={repo} />) }</ul>;
};

export default Projects;
