"use client";

import React, { Suspense } from "react";
import { lazy } from 'react';
const Editor = lazy(() => import('./Editor'));

interface Props {
  value: string;
  textAlign?: "left" | "center" | "right",
  element?: any,
}

export function MarkdownPreview({ value: markdownString = "", textAlign, ...props }: Props) {
  return <Suspense fallback={<div>{markdownString || ""}</div>}>
    <Editor mode="preview" value={markdownString || ""} textAlign={textAlign} element={props.element} />
  </Suspense>
}
