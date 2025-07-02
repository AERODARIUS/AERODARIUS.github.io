import { useEffect, useState } from "react";
import { Card, Col, Row, Spin } from "antd";
import "./index.scss";
import { GithubOutlined } from "@ant-design/icons";

const ProjectsGrid = ({ username }) => {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://api.github.com/users/${username}/repos`)
      .then((res) => res.json())
      .then((data) => {
        setRepos(data);
        setLoading(false);
      });
  }, [username]);

  if (loading) return <Spin style={{ margin: "2rem" }} />;

  const getActions = (repo) => {
    const actions = [
      <a
        href={repo.html_url}
        target="_blank"
        rel="noopener noreferrer"
        className="card-action-link"
      >
        Code
      </a>,
    ];

    if (repo.homepage) {
      actions.push(
        <a
          href={repo.homepage}
          target="_blank"
          rel="noopener noreferrer"
          className="card-action-link"
        >
          Website
        </a>
      );
    }

    return actions;
  };

  return (
    <Row gutter={[16, 16]} className="projects-grid">
      {repos.map((repo) => (
        <Col xs={24} sm={12} md={8} lg={8} key={repo.id}>
          <Card
            className="project-card"
            title={
              <h3>
                <GithubOutlined className="project-card__icon" />
                {repo.name}
              </h3>
            }
            hoverable
            actions={getActions(repo)}
          >
            <p className="project-card__description">
              {repo.description || "No description provided."}
            </p>
            <p>Main language: {repo.language || "Not specified"}</p>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default ProjectsGrid;
