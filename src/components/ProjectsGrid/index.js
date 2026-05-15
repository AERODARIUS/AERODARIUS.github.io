import { useEffect, useState } from "react";
import { Empty, Skeleton } from "antd";
import {
  CodeOutlined,
  ForkOutlined,
  GithubOutlined,
  LinkOutlined,
  StarOutlined,
} from "@ant-design/icons";
import "./index.scss";

const formatUpdatedDate = (value) => {
  if (!value) {
    return "N/A";
  }

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
};

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
    <div className="projects-grid" role="list">
      {repos.map((repo) => {
        const homepage = repo.homepage?.trim();
        const topics = Array.isArray(repo.topics) ? repo.topics.slice(0, 4) : [];

        return (
          <article className="project-card" key={repo.id} role="listitem">
            <div className="project-card__topline">
              <span>
                <GithubOutlined aria-hidden="true" />
                Repository
              </span>
              <span>{repo.language || "N/A"}</span>
            </div>
            <h3 className="project-card__title">
              <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                {repo.name}
              </a>
            </h3>
            <p className="project-card__description">
              {repo.description || "No description provided."}
            </p>
            {topics.length > 0 && (
              <ul className="project-card__topics" aria-label={`${repo.name} topics`}>
                {topics.map((topic) => (
                  <li key={`${repo.id}-${topic}`}>{topic}</li>
                ))}
              </ul>
            )}
            <dl className="project-card__meta">
              <div>
                <dt>Updated</dt>
                <dd>{formatUpdatedDate(repo.pushed_at)}</dd>
              </div>
              <div>
                <dt>
                  <StarOutlined aria-hidden="true" />
                  Stars
                </dt>
                <dd>{repo.stargazers_count ?? 0}</dd>
              </div>
              <div>
                <dt>
                  <ForkOutlined aria-hidden="true" />
                  Forks
                </dt>
                <dd>{repo.forks_count ?? 0}</dd>
              </div>
            </dl>
            <div className="project-card__actions">
              <a
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="card-action-link card-action-link--primary"
                aria-label={`View source for ${repo.name}`}
              >
                <CodeOutlined aria-hidden="true" />
                Source
              </a>
              {homepage && (
                <a
                  href={homepage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card-action-link"
                  aria-label={`Open website for ${repo.name}`}
                >
                  <LinkOutlined aria-hidden="true" />
                  Website
                </a>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
};

export default ProjectsGrid;
