import React from "react";
import { Avatar } from "antd";
import "./App.scss";
import resume from "./resume.json";

function App() {
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
      <div className="resume-doc__content content-experience">
        <h2>Experience</h2>
        {resume.experience.map(
          (
            {
              company,
              title,
              start_date,
              end_date,
              description,
              responsibilities,
            }
          ) => (
            <div className="content-experience--job" key={`${company}-${title}-${start_date}-${end_date}`}>
              <h3>
                {company}: {title}
              </h3>
              <h4>
                {start_date} - {end_date}
              </h4>
              <p>{description}</p>
              <ul>
                {responsibilities.map((responsibility ) => (
                  <li key={responsibility}>{responsibility}</li>
                ))}
              </ul>
            </div>
          )
        )}
      </div>
      
      <div className="resume-doc__content content-experience">
        <h2>Education</h2>
        {resume.education.map(
          ({ degree, institution, status, description }) => (
            <div className="content-experience--job" key={`${degree}-${institution}-${status}`}>
              <h3>
                {degree} - {institution}
              </h3>
              <h4>
                {status}
              </h4>
              <p>{description}</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default App;
