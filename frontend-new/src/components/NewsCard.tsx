"use client";

import React from 'react';
import { Button } from './ui/button';

type Props = {
  title: string;
  date: string;
  url: string;
  source?: string;
  excerpt?: string;
  buttonLabel: string;
  logoSrc?: string;
};

export default function NewsCard({ title, date, url, source, excerpt, buttonLabel, logoSrc }: Props) {
  return (
    <article className="group bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-[#8A4D76]/30 hover:-translate-y-1">
      <div className="bg-gradient-to-r from-[#8A4D76] to-[#A65D8E] px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {logoSrc ? (
            <img
              src={logoSrc}
              alt={source || 'Blog'}
              className="h-6 w-auto max-w-[140px] object-contain bg-white/95 rounded px-2 py-1"
            />
          ) : (
            <>
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
              </svg>
              <span className="text-sm font-semibold text-white">{source || 'Blog'}</span>
            </>
          )}
        </div>
        <div className="bg-white/20 px-2 py-1 rounded">
          <span className="text-xs text-white font-medium">{date}</span>
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-xl font-bold text-[#8A4D76] mb-3 line-clamp-2 group-hover:text-[#6B3A5E] transition-colors">
          {title}
        </h3>

        {excerpt && (
          <p className="text-gray-600 leading-relaxed text-sm mb-5 line-clamp-4">
            {excerpt}
          </p>
        )}

        <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-3">
          <p className="text-xs text-gray-500">
            {source}
          </p>
          <a href={url} target="_blank" rel="noopener noreferrer">
            <Button size="sm" className="bg-[#8A4D76] hover:bg-[#6B3A5E] text-white border-0">
              {buttonLabel}
            </Button>
          </a>
        </div>
      </div>
    </article>
  );
}
