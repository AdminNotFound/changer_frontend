'use client';

import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils/cn';
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
  const [mobileTab, setMobileTab] = useState('edit');

  return (
    <>
      <div className="lg:hidden mb-4">
        <Tabs value={mobileTab} onValueChange={setMobileTab}>
          <TabsList>
            <TabsTrigger value="edit">Edit</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="lg:grid lg:grid-cols-2 lg:gap-6 xl:gap-8 min-h-[calc(100vh-12rem)]">
        <div
          className={cn(
            'overflow-y-auto lg:pr-2 max-h-[calc(100vh-12rem)]',
            mobileTab !== 'edit' && 'hidden lg:block'
          )}
        >
          <EditorFormSections />
        </div>
        <div
          className={cn(
            'overflow-y-auto lg:pl-2 max-h-[calc(100vh-12rem)]',
            mobileTab !== 'preview' && 'hidden lg:block'
          )}
        >
          <ResumePreview templateId={templateId} />
        </div>
      </div>
    </>
  );
}
