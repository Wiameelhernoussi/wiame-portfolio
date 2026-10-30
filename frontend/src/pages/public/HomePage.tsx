import React, { useState, useEffect } from "react";
import { HeroSection } from "../../components/hero/HeroSection";
import { AboutSection } from "../../components/sections/AboutSection";
import { ProjectsSection } from "../../components/sections/ProjectsSection";
import { ExperienceSection } from "../../components/sections/ExperienceSection";
import { SkillsSection } from "../../components/sections/SkillsSection";
import { CertificatesSection } from "../../components/sections/CertificatesSection";
import { EducationSection } from "../../components/sections/EducationSection";
import { InterestsSection } from "../../components/sections/InterestsSection";
import { ContactSection } from "../../components/sections/ContactSection";
import { api } from "../../services/api";
import {
  Profile,
  Project,
  Experience,
  Education,
  Skill,
  Certificate,
  SiteSetting,
} from "../../types";
import {
  fallbackProfile,
  fallbackProjects,
  fallbackExperiences,
  fallbackEducation,
  fallbackSkills,
  fallbackCertificates,
  fallbackSettings,
} from "../../utils/fallbackData";

export const HomePage: React.FC = () => {
  const [profile, setProfile] = useState<Profile>(fallbackProfile);
  const [projects, setProjects] = useState<Project[]>(fallbackProjects);
  const [experiences, setExperiences] = useState<Experience[]>(fallbackExperiences);
  const [education, setEducation] = useState<Education[]>(fallbackEducation);
  const [skills, setSkills] = useState<Skill[]>(fallbackSkills);
  const [certificates, setCertificates] = useState<Certificate[]>(fallbackCertificates);
  const [settings, setSettings] = useState<SiteSetting>(fallbackSettings);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Record visit asynchronously (privacy-friendly, no cookies)
    try {
      api.post("/analytics/visit", {
        path: window.location.pathname,
        referrer: document.referrer,
      });
    } catch {
      // Ignore analytics errors
    }

    const loadContent = async () => {
      try {
        const [
          profileRes,
          projectsRes,
          expRes,
          eduRes,
          skillsRes,
          certsRes,
          settingsRes,
        ] = await Promise.all([
          api.get<Profile>("/profile"),
          api.get<Project[]>("/projects"),
          api.get<Experience[]>("/experiences"),
          api.get<Education[]>("/education"),
          api.get<Skill[]>("/skills"),
          api.get<Certificate[]>("/certificates"),
          api.get<SiteSetting>("/settings"),
        ]);

        if (profileRes.data) setProfile(profileRes.data);
        if (projectsRes.data && projectsRes.data.length > 0) setProjects(projectsRes.data);
        if (expRes.data && expRes.data.length > 0) setExperiences(expRes.data);
        if (eduRes.data && eduRes.data.length > 0) setEducation(eduRes.data);
        if (skillsRes.data && skillsRes.data.length > 0) setSkills(skillsRes.data);
        if (certsRes.data && certsRes.data.length > 0) setCertificates(certsRes.data);
        if (settingsRes.data) setSettings(settingsRes.data);
      } catch (err) {
        console.warn("Using offline fallback data for portfolio:", err);
      }
    };

    loadContent();
  }, []);

  const visibility = settings?.section_visibility || {
    hero: true,
    about: true,
    projects: true,
    experience: true,
    skills: true,
    certificates: true,
    education: true,
    interests: true,
    contact: true,
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center">
        <div className="w-10 h-10 rounded-full border-4 border-majorelle border-t-transparent animate-spin mb-4" />
        <p className="text-sm font-heading font-semibold text-muted-light dark:text-muted-dark animate-pulse">
          Loading Wiame El Hernoussi's Portfolio...
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      {visibility.hero !== false && <HeroSection profile={profile} />}
      {visibility.about !== false && <AboutSection profile={profile} />}
      {visibility.projects !== false && <ProjectsSection projects={projects} />}
      {visibility.experience !== false && <ExperienceSection experiences={experiences} />}
      {visibility.skills !== false && <SkillsSection skills={skills} />}
      {visibility.certificates !== false && <CertificatesSection certificates={certificates} />}
      {visibility.education !== false && <EducationSection education={education} />}
      {visibility.interests !== false && <InterestsSection />}
      {visibility.contact !== false && <ContactSection profile={profile} />}
    </div>
  );
};

export default HomePage;
