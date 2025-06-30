import React from "react";
import { Avatar, FloatButton, Image, Tag } from "antd";
import {
  CalendarFilled,
  EnvironmentFilled,
  FileTextOutlined,
  LinkedinFilled,
  MailFilled,
  PhoneFilled,
  ReadOutlined,
} from "@ant-design/icons";
import "./App.scss";
import resume from "./resume.json";
import ProjectsGrid from "./components/ProjectsGrid";

function App() {
  const handleDownload = () => {
    window.print();
  };

  return (
    <div className="resume-doc">
      <FloatButton
        icon={<FileTextOutlined />}
        tooltip={<div>Download a PDF version</div>}
        onClick={handleDownload}
      />
      <div className="resume-doc__header">
        <div className="resume-doc__header__avatar">
          <Avatar
            // size={{ xs: 128, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
            src="./img/profile_pic.jpeg"
            className="profile-pic"
          />
        </div>
        <div className="resume-doc__header__description">
          <h1>{resume.name}</h1>
          <p className="secondary-color">{resume.summary}</p>
          <ul>
            <li>
              <EnvironmentFilled /> {resume.contact.location}
            </li>
            <li>
              <MailFilled /> {resume.contact.email}
            </li>
            <li>
              <PhoneFilled /> {resume.contact.phone}
            </li>
            <li>
              <CalendarFilled /> {resume.personal_info.birthdate}
            </li>
            <li>
              <LinkedinFilled />{" "}
              <a
                href={resume.contact.linkedin.url}
                target="_blank"
                rel="noreferrer"
              >
                {resume.contact.linkedin.text}
              </a>
            </li>
          </ul>
          <p></p>
        </div>
      </div>
      <div className="resume-doc__content">
        {" "}
        <div className="content-experience">
          <h2>Experience</h2>
          {resume.experience.map(
            ({
              company,
              title,
              start_date,
              end_date,
              description,
              responsibilities,
              skills,
            }) => (
              <div
                className="content-experience--job"
                key={`${company}-${title}-${start_date}-${end_date}`}
              >
                <h3>
                  {company}: {title}
                </h3>
                <h4>
                  {start_date} - {end_date}
                </h4>
                <p>{description}</p>
                <ul>
                  {responsibilities.map((responsibility) => (
                    <li key={responsibility}>{responsibility}</li>
                  ))}
                </ul>
                {skills?.map((skill) => (
                  <Tag key={skill} className="tag">
                    {skill}
                  </Tag>
                ))}
              </div>
            )
          )}
        </div>
        <div className="content-experience">
          <h2>Education</h2>
          {resume.education.map(
            ({ degree, institution, status, description }) => (
              <div
                className="content-experience--job"
                key={`${degree}-${institution}-${status}`}
              >
                <h3>
                  {degree} - {institution}
                </h3>
                <h4>{status}</h4>
                <p>{description}</p>
              </div>
            )
          )}
        </div>
        <div className="content-experience">
          <h2>Side Projects</h2>
          <ProjectsGrid username={resume.github_username} />
        </div>
        <div className="content-experience">
          <h2>Articles</h2>
          {resume.articles.map(({ title, url }) => (
            <div className="content-experience--job" key={`${title}`}>
              <div className="url-wrapper">
                <ReadOutlined />
                <a href={url} target="_blank" rel="noreferrer">
                  {title}
                </a>
              </div>
            </div>
          ))}
        </div>
        <div className="content-experience">
          <h2>Certifications</h2>
          {resume.certifications.map(
            ({ name, issuer, date, url, details, list }) => (
              <div
                className="content-experience--job"
                key={`${name}-${issuer}`}
              >
                <h3>
                  {name} {issuer ? " - " + issuer : ""}
                </h3>
                {date && <h4>{date}</h4>}
                {details && <p>{details}</p>}
                {list && list.length > 0 && (
                  <div className="certification-images">
                    <Image.PreviewGroup>
                      {list.map(({ image, title }) => (
                        <Image key={title} width={200} src={image} />
                      ))}
                    </Image.PreviewGroup>
                  </div>
                )}
                {url && (
                  <div className="url-wrapper">
                    Follow this link to view details:
                    <a href={url} target="_blank" rel="noreferrer">
                      {url}
                    </a>
                  </div>
                )}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
