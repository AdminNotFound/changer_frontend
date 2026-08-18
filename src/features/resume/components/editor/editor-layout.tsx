'use client';

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResumePreview } from './preview/resume-preview';
import { PersonalInfoSection } from './sections/personal-info-section';
import { SummarySection } from './sections/summary-section';
import { SkillsSection } from './sections/skills-section';
import { ExperienceSection } from './sections/experience-section';
import { EducationSection } from './sections/education-section';
import { ProjectsSection } from './sections/projects-section';
import { CertificationsSection } from './sections/certifications-section';
import { LanguagesSection } from './sections/languages-section';
import { SocialLinksSection } from './sections/social-links-section';

type EditorLayoutProps = {
  templateId: string;
};

function EditorFormSections() {
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

export function EditorLayout({ templateId }: EditorLayoutProps) {
  return (
    <>
      {/* Mobile: tabs */}
      <div className="lg:hidden">
        <Tabs defaultValue="edit">
          <TabsList>
            <TabsTrigger value="edit">Edit</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          <TabsContent value="edit">
            <EditorFormSections />
          </TabsContent>
          <TabsContent value="preview">
            <ResumePreview templateId={templateId} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Desktop: split pane */}
      <div className="hidden lg:grid lg:grid-cols-2 lg:gap-6 xl:gap-8 min-h-[calc(100vh-12rem)]">
        <div className="overflow-y-auto pr-2 max-h-[calc(100vh-12rem)]">
          <EditorFormSections />
        </div>
        <div className="overflow-y-auto pl-2 max-h-[calc(100vh-12rem)]">
          <ResumePreview templateId={templateId} />
        </div>
      </div>
    </>
  );
}
