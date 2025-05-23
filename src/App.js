import React, { useEffect } from "react";
import { Avatar, FloatButton } from "antd";
import { FileTextOutlined } from "@ant-design/icons";
import "./App.scss";
import resume from "./resume.json";

function App() {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = "./Dario Cruz Resume.pdf";
    link.download = "Dario Cruz Resume.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
        }
      });
    });

    const hiddenElements = document.querySelectorAll(".hidden");
    hiddenElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect(); // Cleanup the observer on unmount
  }, []);

  return (
    <div className="resume-doc">
      <div className="resume-doc__header">
        <div className="resume-doc__header__avatar">
          <Avatar
            // size={{ xs: 128, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
            src="./img/profile_pic.jpeg"
            className="profile-pic"
          />
        </div>
        <FloatButton
          icon={<FileTextOutlined />}
          tooltip={<div>Download a PDF version</div>}
          onClick={handleDownload}
        />
        <div className="resume-doc__header__description">
          <h1>{resume.name}</h1>
          <p className="secondary-color">{resume.summary}</p>
          <ul>
            <li>
              <b>Location:</b> Montevideo, Uruguay
            </li>
            <li>
              <b>Email:</b> dariodcruz@gmail.com
            </li>
            <li>
              <b>Phone:</b> +598 937 63229
            </li>
            <li>
              <b>Birthdate:</b> 30/11/1990
            </li>
            <li>
              <b>Linkedin:</b> linkedin.com/in/cruzdario
            </li>
          </ul>
          <p></p>
        </div>
      </div>
      <div className="resume-doc__content content-experience hidden">
        <h2>Experience</h2>
        {resume.experience.map(
          ({
            company,
            title,
            start_date,
            end_date,
            description,
            responsibilities,
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
            </div>
          )
        )}
      </div>

      <div className="resume-doc__content content-experience hidden">
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

      <div className="resume-doc__content content-experience hidden">
        <h2>Main Skills</h2>
        <div className="content-experience--job">
          {resume.skills.join(" - ")}
        </div>
      </div>

      <div className="resume-doc__content content-experience">
        <h2 className="hidden">Side Projects</h2>
        {resume.side_projects.map(({ name, url }) => (
          <div className="content-experience--job" key={`${name}`}>
            <h3>{name}</h3>
            <div className="url-wrapper">
              <a href={url}>{url}</a>
            </div>
          </div>
        ))}
      </div>

      <div className="resume-doc__content content-experience">
        <h2 className="hidden">Articles</h2>
        {resume.articles.map(({ title, url }) => (
          <div className="content-experience--job" key={`${title}`}>
            <div className="url-wrapper">
              <a href={url}>{title}</a>
            </div>
          </div>
        ))}
      </div>

      <div className="resume-doc__content content-experience">
        <h2 className="hidden">Certifications</h2>
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
  );
}

export default App;
