import React from "react";
import { Avatar } from "antd";
import "./App.scss";

function App() {
  return (
    <div className="resume-doc">
      <div className="resume-doc__header">
        <div className="resume-doc__header__avatar">
          <Avatar src="./img/profile-pic.jpg" className="profile-pic" />
        </div>
        <div className="resume-doc__header__description">
          <h1>Dario Cruz</h1>
          <p className="secondary-color">
            I’m a tech enthusiast with over 12 years of experience in the
            development of web applications. I’m passionate about the latest
            trends in technology, driving collaboration, and achieving results.
          </p>
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
        <div className="experience">
          <p>
            Altimetrik: Team Lead JANUARY 2019- PRESENT I led teams working with
            multiple fintech clients using a wide variety of technologies,
            maintaining SPA and server-side applications. Some of the
            technologies I have been working on are Reactjs, Vue, Solid, RoR,
            Clojure, ClojureJs, NodeJs, NextJs, PostgreSQL, and Salesforce.
            Responsibilities: Lead and motivate the team to accomplish the
            project objectives Plan the development and the frontend side of the
            architecture of the solution Provide and receive feedback from each
            team member Empower the team members by guiding them to reach higher
            positions in their careers Taking interviews of new candidates
            Actively assist in the development
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
