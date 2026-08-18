'use client';

import { PersonalInfoSection } from './sections/personal-info-section';
import { SummarySection } from './sections/summary-section';
import { SkillsSection } from './sections/skills-section';
import { ExperienceSection } from './sections/experience-section';
import { EducationSection } from './sections/education-section';
import { ProjectsSection } from './sections/projects-section';
import { CertificationsSection } from './sections/certifications-section';
import { LanguagesSection } from './sections/languages-section';
import { SocialLinksSection } from './sections/social-links-section';

export function EditorFormSections() {
  return (
    <div className="space-y-4 pb-8">
      <PersonalInfoSection />
      <SummarySection />
      <SkillsSection />
      <ExperienceSection />
      <EducationSection />
      <ProjectsSection />
      <CertificationsSection />
      <LanguagesSection />
      <SocialLinksSection />
    </div>
  );
}
