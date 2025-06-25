import React from "react";
import { Avatar, FloatButton, Tag } from "antd";
import { FileTextOutlined } from "@ant-design/icons";
import "./App.scss";
import resume from "./resume.json";

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
              <b>Location:</b> {resume.contact.location}
            </li>
            <li>
              <b>Email:</b> {resume.contact.email}
            </li>
            <li>
              <b>Phone:</b> {resume.contact.phone}
            </li>
            <li>
              <b>Birthdate:</b> {resume.personal_info.birthdate}
            </li>
            <li>
              <b>Linkedin:</b>{" "}
              <a href={resume.contact.linkedin}>{resume.contact.linkedin}</a>
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
              skills
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
                    <Tag key={skill} className="tag">{skill}</Tag>
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
          <h2>Main Skills</h2>
          <div className="content-experience--job">
            {resume.skills.join(" - ")}
          </div>
        </div>
        <div className="content-experience">
          <h2>Side Projects</h2>
          {resume.side_projects.map(({ name, url }) => (
            <div className="content-experience--job" key={`${name}`}>
              <h3>{name}</h3>
              <div className="url-wrapper">
                <a href={url}>{url}</a>
              </div>
            </div>
          ))}
        </div>
        <div className="content-experience">
          <h2>Articles</h2>
          {resume.articles.map(({ title, url }) => (
            <div className="content-experience--job" key={`${title}`}>
              <div className="url-wrapper">
                <a href={url}>{title}</a>
              </div>
            </div>
          ))}
        </div>
        <div className="content-experience">
          <h2>Certifications</h2>
          {resume.certifications.map(({ name, issuer, date, url, details }) => (
            <div className="content-experience--job" key={`${name}-${issuer}`}>
              <h3>
                {name} {issuer ? " - " + issuer : ""}
              </h3>
              {date && <h4>{date}</h4>}
              {url && (
                <div className="url-wrapper">
                  <a href={url}>{url}</a>
                </div>
              )}
              <p>{details}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
