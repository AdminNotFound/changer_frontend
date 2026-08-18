'use client';

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResumePreview } from './preview/resume-preview';
import { EditorFormSections } from './editor-form-sections';

type EditorLayoutProps = {
  templateId: string;
};

export function EditorLayout({ templateId }: EditorLayoutProps) {
  return (
    <>
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
