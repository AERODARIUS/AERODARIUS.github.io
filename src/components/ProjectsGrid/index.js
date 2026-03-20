import { useEffect, useState } from "react";
import { Card, Col, Empty, Row, Skeleton } from "antd";
import { CodeOutlined, GithubOutlined, LinkOutlined } from "@ant-design/icons";
import "./index.scss";

const ProjectsGrid = ({ username }) => {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    setLoading(true);
    setError(false);

    fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`, {
      signal: controller.signal,
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to load projects.");
        }

        return res.json();
      })
      .then((data) => {
        const sortedRepos = [...data].sort(
          (repoA, repoB) =>
            new Date(repoB.pushed_at).getTime() - new Date(repoA.pushed_at).getTime()
        );

        setRepos(sortedRepos);
      })
      .catch((requestError) => {
        if (requestError.name !== "AbortError") {
          setError(true);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [username]);

  if (loading) {
    return (
      <div className="projects-grid__state">
        <Skeleton active paragraph={{ rows: 4 }} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="projects-grid__state">
        <Empty
          description="Projects could not be loaded right now."
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </div>
    );
  }

  return (
    <Row gutter={[20, 20]} className="projects-grid">
      {repos.map((repo) => {
        const actions = [
          <a
            key={`${repo.id}-code`}
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="card-action-link"
          >
            <CodeOutlined />
            Source
          </a>,
        ];

        if (repo.homepage) {
          actions.push(
            <a
              key={`${repo.id}-homepage`}
              href={repo.homepage}
              target="_blank"
              rel="noopener noreferrer"
              className="card-action-link"
            >
              <LinkOutlined />
              Website
            </a>
          );
        }

        return (
          <Col xs={24} sm={12} xl={8} key={repo.id}>
            <Card
              className="project-card"
              title={
                <div className="project-card__title">
                  <GithubOutlined className="project-card__icon" />
                  <span>{repo.name}</span>
                </div>
              }
              extra={<span className="project-card__language">{repo.language || "N/A"}</span>}
              hoverable
              actions={actions}
            >
              <p className="project-card__description">
                {repo.description || "No description provided."}
              </p>
              <p className="project-card__meta">
                Last updated {new Date(repo.pushed_at).toLocaleDateString()}
              </p>
            </Card>
          </Col>
        );
      })}
    </Row>
  );
};

export default ProjectsGrid;
