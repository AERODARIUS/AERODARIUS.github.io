import React, { useEffect, useRef, useState } from "react";
import { Image, Tag } from "antd";
import {
  CalendarFilled,
  DesktopOutlined,
  EnvironmentFilled,
  FileTextOutlined,
  LinkedinFilled,
  MailFilled,
  MoonFilled,
  PhoneFilled,
  ReadOutlined,
  SafetyCertificateOutlined,
  SunFilled,
  TrophyFilled,
} from "@ant-design/icons";
import { PopupModal } from "react-calendly";
import "./App.scss";
import resume from "./resume.json";
import ProjectsGrid from "./components/ProjectsGrid";
import RadarStats from "./components/RadarStats";

const resolveAssetPath = (assetPath = "") => {
  if (!assetPath) {
    return "";
  }

  if (/^(https?:)?\/\//.test(assetPath)) {
    return assetPath;
  }

  const publicUrl = process.env.PUBLIC_URL || "";
  const normalizedPath = assetPath.replace(/^\.?\//, "");

  return `${publicUrl}/${normalizedPath}`.replace(/([^:]\/)\/+/g, "$1");
};

const updateMetaTag = (attribute, value, content) => {
  let tag = document.head.querySelector(`meta[${attribute}="${value}"]`);

  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attribute, value);
    document.head.appendChild(tag);
  }

  tag.setAttribute("content", content);
};

const updateLinkTag = (rel, href) => {
  let link = document.head.querySelector(`link[rel="${rel}"]`);

  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", rel);
    document.head.appendChild(link);
  }

  link.setAttribute("href", href);
};

const updateStructuredData = (payload) => {
  let script = document.head.querySelector(
    'script[data-portfolio-schema="person"]'
  );

  if (!script) {
    script = document.createElement("script");
    script.type = "application/ld+json";
    script.dataset.portfolioSchema = "person";
    document.head.appendChild(script);
  }

  script.textContent = JSON.stringify(payload);
};

const THEME_STORAGE_KEY = "portfolio-theme-preference";
const THEME_META_COLORS = {
  light: "#114c5f",
  dark: "#08111a",
};
const THEME_MODE_SEQUENCE = ["system", "dark", "light"];
const THEME_MODE_COPY = {
  system: "System theme",
  dark: "Dark mode",
  light: "Light mode",
};

const isTheme = (value) => value === "light" || value === "dark";

const getStoredThemePreference = () => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);

    return isTheme(storedTheme) ? storedTheme : null;
  } catch (error) {
    return null;
  }
};

const getSystemTheme = () => {
  if (typeof window === "undefined" || !window.matchMedia) {
    return "light";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

const applyDocumentTheme = (theme) => {
  if (typeof document === "undefined" || !isTheme(theme)) {
    return;
  }

  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
};

const BookingSection = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="action-button action-button--secondary action-button--icon booking-button"
        onClick={() => setIsOpen(true)}
        aria-label="Book a Meeting"
        title="Book a Meeting"
      >
        <CalendarFilled aria-hidden="true" />
      </button>
      <PopupModal
        url="https://calendly.com/dariodcruz/30min"
        open={isOpen}
        onModalClose={() => setIsOpen(false)}
        rootElement={document.getElementById("root") || document.body}
      />
    </>
  );
};

function App() {
  const primaryRole = resume.experience[0];
  const experienceKeywords = Array.from(
    new Set(
      resume.experience.flatMap(({ skills = [] }) => skills).filter(Boolean)
    )
  ).slice(0, 18);
  const keywordText = experienceKeywords.join(", ");
  const pageTitle = `${resume.name} | ${primaryRole.title} Portfolio`;
  const metaDescription = `${resume.name} portfolio and resume. ${resume.summary}`;
  const phoneHref = `tel:${resume.contact.phone.replace(/\s+/g, "")}`;
  const [city, country] = resume.contact.location
    .split(",")
    .map((value) => value.trim());
  const pageHeaderRef = useRef(null);
  const [themePreference, setThemePreference] = useState(() =>
    getStoredThemePreference()
  );
  const [systemTheme, setSystemTheme] = useState(() => {
    if (
      typeof document !== "undefined" &&
      isTheme(document.documentElement.dataset.theme)
    ) {
      return document.documentElement.dataset.theme;
    }

    return getSystemTheme();
  });
  const activeTheme = themePreference || systemTheme;
  const themeMode = themePreference || "system";
  const themeModeIndex = THEME_MODE_SEQUENCE.indexOf(themeMode);
  const nextThemeMode =
    THEME_MODE_SEQUENCE[(themeModeIndex + 1) % THEME_MODE_SEQUENCE.length];
  const themeToggleLabel = `${THEME_MODE_COPY[themeMode]}. Click to switch to ${THEME_MODE_COPY[nextThemeMode].toLowerCase()}.`;

  const sectionLinks = [
    { id: "contact", label: "Contact" },
    { id: "skills-summary", label: "Skills" },
    { id: "experience", label: "Experience" },
    { id: "education", label: "Education" },
    { id: "certifications", label: "Certifications" },
    { id: "projects", label: "Projects" },
    { id: "articles", label: "Articles" },
    resume.other_achievements?.length
      ? { id: "achievements", label: "Achievements" }
      : null,
  ].filter(Boolean);

  const contactItems = [
    {
      icon: <EnvironmentFilled />,
      label: "Location",
      value: resume.contact.location,
    },
    {
      icon: <MailFilled />,
      label: "Email",
      value: resume.contact.email,
      href: `mailto:${resume.contact.email}`,
    },
    {
      icon: <PhoneFilled />,
      label: "Phone",
      value: resume.contact.phone,
      href: phoneHref,
    },
    {
      icon: <CalendarFilled />,
      label: "Birthdate",
      value: resume.personal_info.birthdate,
    },
    {
      icon: <LinkedinFilled />,
      label: "LinkedIn",
      value: resume.contact.linkedin.text,
      href: resume.contact.linkedin.url,
    },
  ];

  useEffect(() => {
    const mediaQuery = window.matchMedia?.("(prefers-color-scheme: dark)");

    if (!mediaQuery) {
      return undefined;
    }

    const handleChange = (event) => {
      setSystemTheme(event.matches ? "dark" : "light");
    };

    setSystemTheme(mediaQuery.matches ? "dark" : "light");

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);

      return () => mediaQuery.removeEventListener("change", handleChange);
    }

    mediaQuery.addListener(handleChange);

    return () => mediaQuery.removeListener(handleChange);
  }, []);

  useEffect(() => {
    applyDocumentTheme(activeTheme);
    updateMetaTag("name", "theme-color", THEME_META_COLORS[activeTheme]);

    try {
      if (themePreference) {
        window.localStorage.setItem(THEME_STORAGE_KEY, themePreference);
      } else {
        window.localStorage.removeItem(THEME_STORAGE_KEY);
      }
    } catch (error) {
      // Ignore storage write failures and keep the in-memory preference.
    }
  }, [activeTheme, themePreference]);

  useEffect(() => {
    const pageHeader = pageHeaderRef.current;

    if (!pageHeader || typeof document === "undefined") {
      return undefined;
    }

    const updateStickyHeaderHeight = () => {
      document.documentElement.style.setProperty(
        "--sticky-header-height",
        `${pageHeader.offsetHeight}px`
      );
    };

    updateStickyHeaderHeight();

    const resizeObserver =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(updateStickyHeaderHeight)
        : null;

    resizeObserver?.observe(pageHeader);
    window.addEventListener("resize", updateStickyHeaderHeight);

    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener("resize", updateStickyHeaderHeight);
      document.documentElement.style.removeProperty("--sticky-header-height");
    };
  }, []);

  useEffect(() => {
    const actualUrl = window.location.href;
    const profileImage = new URL(
      resolveAssetPath("img/profile_pic.jpeg"),
      window.location.origin
    ).toString();
    const keywords = keywordText ? keywordText.split(", ") : [];

    document.title = pageTitle;

    updateMetaTag("name", "description", metaDescription);
    updateMetaTag("name", "keywords", keywordText);
    updateMetaTag("name", "author", resume.name);
    updateMetaTag("name", "robots", "index, follow, max-image-preview:large");
    updateMetaTag("property", "og:type", "website");
    updateMetaTag("property", "og:title", pageTitle);
    updateMetaTag("property", "og:description", metaDescription);
    updateMetaTag("property", "og:url", actualUrl);
    updateMetaTag("property", "og:image", profileImage);
    updateMetaTag("property", "og:site_name", resume.name);
    updateMetaTag("name", "twitter:card", "summary_large_image");
    updateMetaTag("name", "twitter:title", pageTitle);
    updateMetaTag("name", "twitter:description", metaDescription);
    updateMetaTag("name", "twitter:image", profileImage);
    updateLinkTag("canonical", actualUrl);

    updateStructuredData({
      "@context": "https://schema.org",
      "@type": "Person",
      name: resume.name,
      description: resume.summary,
      url: actualUrl,
      image: profileImage,
      email: `mailto:${resume.contact.email}`,
      telephone: resume.contact.phone,
      jobTitle: primaryRole.title,
      worksFor: {
        "@type": "Organization",
        name: primaryRole.company,
      },
      address: {
        "@type": "PostalAddress",
        addressLocality: city,
        addressCountry: country,
      },
      alumniOf: resume.education.map(({ institution }) => ({
        "@type": "CollegeOrUniversity",
        name: institution,
      })),
      sameAs: [
        resume.contact.linkedin.url,
        `https://github.com/${resume.github_username}`,
      ],
      knowsAbout: keywords,
      mainEntityOfPage: actualUrl,
    });
  }, [city, country, keywordText, metaDescription, pageTitle, primaryRole]);

  const handleDownload = () => {
    window.print();
  };

  const handleThemeToggle = () => {
    setThemePreference(nextThemeMode === "system" ? null : nextThemeMode);
  };

  return (
    <div className="resume-page">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      <header className="page-header" ref={pageHeaderRef}>
        <nav className="section-nav" aria-label="Resume sections">
          <div className="section-nav__links">
            {sectionLinks.map(({ id, label }) => (
              <a key={id} href={`#${id}`}>
                {label}
              </a>
            ))}
          </div>

          <div className="section-nav__utility">
            <div className="section-nav__actions">
              <button
                type="button"
                className="action-button action-button--primary action-button--icon"
                onClick={handleDownload}
                aria-label="Download PDF"
                title="Download PDF"
              >
                <FileTextOutlined aria-hidden="true" />
              </button>
              <BookingSection />
            </div>

            <div className="theme-controls">
              <div
                className="theme-controls__buttons"
                role="group"
                aria-label="Color theme controls"
              >
                <button
                  type="button"
                  className="action-button action-button--secondary theme-toggle"
                  onClick={handleThemeToggle}
                  aria-label={themeToggleLabel}
                >
                  {themeMode === "system" ? (
                    <DesktopOutlined />
                  ) : themeMode === "dark" ? (
                    <MoonFilled />
                  ) : (
                    <SunFilled />
                  )}
                  <span>{THEME_MODE_COPY[themeMode]}</span>
                </button>
              </div>
            </div>
          </div>
        </nav>
      </header>

      <div className="resume-layout">
        <aside className="resume-sidebar">
          <div className="profile-panel">
            <p className="profile-panel__eyebrow">Portfolio Resume</p>
            <div className="profile-panel__identity">
              <img
                className="profile-panel__photo"
                src={resolveAssetPath("img/profile_pic.jpeg")}
                alt={`${resume.name} profile portrait`}
              />
              <div>
                <p className="profile-panel__role">
                  {primaryRole.title} at {primaryRole.company}
                </p>
                <h1>{resume.name}</h1>
                <p className="profile-panel__summary">{resume.summary}</p>
              </div>
            </div>
          </div>
        </aside>

        <main className="resume-main" id="main-content">
          <section className="hero-band" aria-label="Professional overview">
            <div className="hero-band__copy">
              <p className="section-kicker">Current Focus</p>
              <h2>{resume.summary_short}</h2>
            </div>
          </section>

          <section className="content-section contact-section" id="contact">
            <div className="section-heading">
              <p className="section-kicker">Reach Out</p>
              <h2>Contact</h2>
            </div>
            <div className="section-card">
              <ul className="contact-list">
                {contactItems.map(({ icon, label, value, href }) => (
                  <li key={label}>
                    <span className="contact-list__icon" aria-hidden="true">
                      {icon}
                    </span>
                    <div>
                      <span className="contact-list__label">{label}</span>
                      {href ? (
                        <a
                          href={href}
                          target={href.startsWith("http") ? "_blank" : undefined}
                          rel={
                            href.startsWith("http") ? "noopener noreferrer" : undefined
                          }
                        >
                          {value}
                        </a>
                      ) : (
                        <span>{value}</span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="content-section" id="skills-summary">
            <div className="section-heading">
              <p className="section-kicker">Capabilities</p>
              <h2>Skills Summary</h2>
            </div>
            <div className="section-card section-card--chart">
              <RadarStats theme={activeTheme} />
            </div>
          </section>

          <section className="content-section" id="experience">
            <div className="section-heading">
              <p className="section-kicker">Career Path</p>
              <h2>Experience</h2>
            </div>
            <div className="timeline">
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
                  <article
                    className="timeline-item"
                    key={`${company}-${title}-${start_date}-${end_date}`}
                  >
                    <div className="timeline-item__header">
                      <div>
                        <p className="timeline-item__date">
                          {start_date} - {end_date}
                        </p>
                        <h3>{title}</h3>
                        <p className="timeline-item__company">{company}</p>
                      </div>
                    </div>
                    <p className="timeline-item__description">{description}</p>
                    <ul className="timeline-item__list">
                      {responsibilities.map((responsibility, index) => (
                        <li key={`${company}-${title}-${index}`}>{responsibility}</li>
                      ))}
                    </ul>
                    <div className="tag-list">
                      {skills?.map((skill) => (
                        <Tag key={skill} className="tag">
                          {skill}
                        </Tag>
                      ))}
                    </div>
                  </article>
                )
              )}
            </div>
          </section>

          <div className="content-grid">
            <section className="content-section" id="education">
              <div className="section-heading">
                <p className="section-kicker">Learning</p>
                <h2>Formal Education</h2>
              </div>
              <div className="stack-list">
                {resume.education.map(
                  ({ degree, institution, status, description }) => (
                    <article
                      className="section-card stack-card"
                      key={`${degree}-${institution}-${status}`}
                    >
                      <h3>{degree}</h3>
                      <p className="stack-card__meta">{institution}</p>
                      <p className="stack-card__status">{status}</p>
                      <p>{description}</p>
                    </article>
                  )
                )}
              </div>
            </section>

            <section className="content-section" id="certifications">
              <div className="section-heading">
                <p className="section-kicker">Credentials</p>
                <h2>Certifications</h2>
              </div>
              <div className="stack-list">
                {resume.certifications.map(
                  ({ name, issuer, date, url, details, list }) => (
                    <article
                      className="section-card certification-card"
                      key={`${name}-${issuer || "issuer"}`}
                    >
                      <div className="certification-card__header">
                        <SafetyCertificateOutlined />
                        <div>
                          <h3>
                            {name}
                            {issuer ? ` - ${issuer}` : ""}
                          </h3>
                          {date && <p className="stack-card__status">{date}</p>}
                        </div>
                      </div>
                      {details && <p>{details}</p>}
                      {list && list.length > 0 && (
                        <div className="certification-images">
                          <Image.PreviewGroup>
                            {list.map(({ image, title }) => (
                              <Image
                                key={title}
                                className="certification-image"
                                src={resolveAssetPath(image)}
                                alt={title}
                              />
                            ))}
                          </Image.PreviewGroup>
                        </div>
                      )}
                      {url && (
                        <div className="link-row">
                          <a href={url} target="_blank" rel="noopener noreferrer">
                            View credential details
                          </a>
                        </div>
                      )}
                    </article>
                  )
                )}
              </div>
            </section>
          </div>

          <section className="content-section" id="projects">
            <div className="section-heading">
              <p className="section-kicker">Code in Public</p>
              <h2>Side Projects</h2>
            </div>
            <div className="section-card section-card--projects">
              <ProjectsGrid username={resume.github_username} />
            </div>
          </section>

          <div className="content-grid">
            <section className="content-section" id="articles">
              <div className="section-heading">
                <p className="section-kicker">Writing</p>
                <h2>Articles</h2>
              </div>
              <div className="stack-list">
                {resume.articles.map(({ title, url }) => (
                  <article className="section-card article-card" key={title}>
                    <ReadOutlined />
                    <a href={url} target="_blank" rel="noopener noreferrer">
                      {title}
                    </a>
                  </article>
                ))}
              </div>
            </section>

            {resume.other_achievements?.length ? (
              <section className="content-section" id="achievements">
                <div className="section-heading">
                  <p className="section-kicker">Recognition</p>
                  <h2>Other Achievements</h2>
                </div>
                <div className="stack-list">
                  {resume.other_achievements.map(({ name, description, url }) => (
                    <article className="section-card achievement-card" key={name}>
                      <div className="achievement-card__header">
                        <TrophyFilled />
                        <h3>{name}</h3>
                      </div>
                      <p>{description}</p>
                      {url && (
                        <div className="link-row">
                          <a href={url} target="_blank" rel="noopener noreferrer">
                            View project
                          </a>
                        </div>
                      )}
                    </article>
                  ))}
                </div>
              </section>
            ) : null}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
