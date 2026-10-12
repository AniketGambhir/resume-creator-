import React from 'react';
import { ResumeData } from '../../types';
import { Mail, Phone, MapPin, Globe, Linkedin, Github, ExternalLink, Award, BookOpen, Briefcase, Code, Sparkles } from 'lucide-react';

interface TemplateProps {
  resume: ResumeData;
  scale?: number;
}

export const ResumeRenderer: React.FC<TemplateProps> = ({ resume, scale = 1 }) => {
  const accent = resume.accentColor || '#2563eb';
  const fontFamilyClass =
    resume.fontFamily === 'serif' ? 'font-serif' : resume.fontFamily === 'mono' ? 'font-mono' : 'font-sans';
  const spacingClass =
    resume.spacing === 'compact' ? 'space-y-3' : resume.spacing === 'spacious' ? 'space-y-6' : 'space-y-4';

  switch (resume.templateId) {
    case 'minimal-executive':
      return <MinimalExecutiveTemplate resume={resume} accent={accent} fontClass={fontFamilyClass} spacingClass={spacingClass} />;
    case 'creative-pro':
      return <CreativeProTemplate resume={resume} accent={accent} fontClass={fontFamilyClass} spacingClass={spacingClass} />;
    case 'ats-standard':
      return <AtsStandardTemplate resume={resume} accent={accent} fontClass={fontFamilyClass} spacingClass={spacingClass} />;
    case 'vibrant-duo':
      return <VibrantDuoTemplate resume={resume} accent={accent} fontClass={fontFamilyClass} spacingClass={spacingClass} />;
    case 'modern-tech':
    default:
      return <ModernTechTemplate resume={resume} accent={accent} fontClass={fontFamilyClass} spacingClass={spacingClass} />;
  }
};

/* -----------------------------------------------------------
   TEMPLATE 1: MODERN TECH
----------------------------------------------------------- */
const ModernTechTemplate: React.FC<{ resume: ResumeData; accent: string; fontClass: string; spacingClass: string }> = ({
  resume,
  accent,
  fontClass,
  spacingClass,
}) => {
  const { personalInfo, education, experience, projects, skills, certifications, achievements } = resume;

  return (
    <div className={`w-full bg-white text-slate-800 p-8 shadow-sm ${fontClass} leading-relaxed text-sm`}>
      {/* Header */}
      <div className="border-b pb-6" style={{ borderColor: `${accent}33` }}>
        <h1 className="text-3xl font-extrabold tracking-tight" style={{ color: accent }}>
          {personalInfo.fullName || 'Your Name'}
        </h1>
        <p className="text-base font-medium text-slate-700 mt-1">{personalInfo.jobTitle || 'Your Target Role'}</p>

        {/* Contact info bar - zero-pill metadata discipline */}
        <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-600 mt-3">
          {personalInfo.email && (
            <span className="flex items-center gap-1">
              <Mail className="w-3.5 h-3.5" /> {personalInfo.email}
            </span>
          )}
          {personalInfo.phone && (
            <>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5" /> {personalInfo.phone}
              </span>
            </>
          )}
          {personalInfo.location && (
            <>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> {personalInfo.location}
              </span>
            </>
          )}
          {personalInfo.linkedin && (
            <>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span>{personalInfo.linkedin}</span>
            </>
          )}
          {personalInfo.github && (
            <>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span>{personalInfo.github}</span>
            </>
          )}
        </div>

        {/* Summary */}
        {personalInfo.summary && (
          <p className="text-xs text-slate-600 mt-3 pt-3 border-t border-slate-100 leading-normal">
            {personalInfo.summary}
          </p>
        )}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-6 mt-6">
        {/* Main Content (Experience + Projects) */}
        <div className={`col-span-8 ${spacingClass}`}>
          {/* Experience */}
          {experience.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5" style={{ color: accent }}>
                <Briefcase className="w-3.5 h-3.5" /> Experience
              </h2>
              <div className="space-y-4">
                {experience.map((exp) => (
                  <div key={exp.id} className="relative pl-3 border-l-2" style={{ borderColor: `${accent}40` }}>
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-semibold text-slate-900 text-sm">{exp.role}</h3>
                      <span className="text-xs text-slate-500 font-medium">
                        {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                      </span>
                    </div>
                    <div className="text-xs font-medium text-slate-700">
                      {exp.company} {exp.location && `· ${exp.location}`}
                    </div>
                    <ul className="mt-2 space-y-1 text-xs text-slate-600 list-disc list-outside ml-3">
                      {exp.bullets.map((bullet, idx) => (
                        <li key={idx}>{bullet}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-1.5" style={{ color: accent }}>
                <Code className="w-3.5 h-3.5" /> Featured Projects
              </h2>
              <div className="space-y-3">
                {projects.map((proj) => (
                  <div key={proj.id} className="p-3 rounded-lg border border-slate-100 bg-slate-50/50">
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-semibold text-slate-900 text-xs">{proj.title}</h3>
                      {proj.link && (
                        <span className="text-[11px] text-blue-600 flex items-center gap-0.5">
                          {proj.link.replace(/^https?:\/\//, '')}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 mt-1">{proj.description}</p>
                    {proj.techStack.length > 0 && (
                      <div className="mt-1.5 text-[11px] text-slate-500">
                        <span className="font-medium text-slate-700">Tech:</span> {proj.techStack.join(', ')}
                      </div>
                    )}
                    {proj.bullets && proj.bullets.length > 0 && (
                      <ul className="mt-1.5 space-y-0.5 text-xs text-slate-600 list-disc list-outside ml-3">
                        {proj.bullets.map((b, i) => (
                          <li key={i}>{b}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar (Skills, Education, Certs, Achievements) */}
        <div className={`col-span-4 ${spacingClass}`}>
          {/* Skills */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider mb-2.5" style={{ color: accent }}>
              Skills & Expertise
            </h2>
            <div className="space-y-2 text-xs">
              {skills.technical.length > 0 && (
                <div>
                  <span className="font-semibold text-slate-700 block text-[11px]">Technical:</span>
                  <p className="text-slate-600 mt-0.5">{skills.technical.join(', ')}</p>
                </div>
              )}
              {skills.tools.length > 0 && (
                <div>
                  <span className="font-semibold text-slate-700 block text-[11px]">Tools & Cloud:</span>
                  <p className="text-slate-600 mt-0.5">{skills.tools.join(', ')}</p>
                </div>
              )}
              {skills.soft.length > 0 && (
                <div>
                  <span className="font-semibold text-slate-700 block text-[11px]">Leadership & Soft:</span>
                  <p className="text-slate-600 mt-0.5">{skills.soft.join(', ')}</p>
                </div>
              )}
            </div>
          </div>

          {/* Education */}
          {education.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider mb-2.5" style={{ color: accent }}>
                Education
              </h2>
              <div className="space-y-2.5">
                {education.map((edu) => (
                  <div key={edu.id} className="text-xs">
                    <h4 className="font-semibold text-slate-900">{edu.degree}</h4>
                    <p className="text-slate-700">{edu.institution}</p>
                    <p className="text-[11px] text-slate-500">
                      {edu.startDate} – {edu.endDate} {edu.grade && `· ${edu.grade}`}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: accent }}>
                Certifications
              </h2>
              <ul className="space-y-1.5 text-xs">
                {certifications.map((c) => (
                  <li key={c.id}>
                    <p className="font-semibold text-slate-900 text-[11px]">{c.name}</p>
                    <p className="text-[11px] text-slate-500">
                      {c.issuer} {c.issueDate && `· ${c.issueDate}`}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Achievements */}
          {achievements.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: accent }}>
                Honors & Awards
              </h2>
              <ul className="space-y-1.5 text-xs">
                {achievements.map((a) => (
                  <li key={a.id}>
                    <p className="font-semibold text-slate-900 text-[11px]">{a.title}</p>
                    <p className="text-[11px] text-slate-600">{a.description}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* -----------------------------------------------------------
   TEMPLATE 2: MINIMAL EXECUTIVE (Single Column, High Elegance)
----------------------------------------------------------- */
const MinimalExecutiveTemplate: React.FC<{ resume: ResumeData; accent: string; fontClass: string; spacingClass: string }> = ({
  resume,
  accent,
  fontClass,
  spacingClass,
}) => {
  const { personalInfo, education, experience, projects, skills, certifications, achievements } = resume;

  return (
    <div className={`w-full bg-white text-slate-900 p-10 ${fontClass} text-sm leading-relaxed`}>
      {/* Centered Executive Header */}
      <div className="text-center pb-6 border-b border-slate-300">
        <h1 className="text-2xl font-bold tracking-wider uppercase text-slate-950">
          {personalInfo.fullName || 'Candidate Name'}
        </h1>
        <p className="text-xs tracking-widest uppercase font-semibold text-slate-600 mt-1">
          {personalInfo.jobTitle || 'Executive Title'}
        </p>

        <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-1 text-xs text-slate-600 mt-2">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>· {personalInfo.phone}</span>}
          {personalInfo.location && <span>· {personalInfo.location}</span>}
          {personalInfo.linkedin && <span>· {personalInfo.linkedin}</span>}
          {personalInfo.website && <span>· {personalInfo.website}</span>}
        </div>
      </div>

      <div className={`mt-6 ${spacingClass}`}>
        {/* Executive Summary */}
        {personalInfo.summary && (
          <div>
            <h2 className="text-xs font-bold tracking-wider uppercase border-b border-slate-200 pb-1 mb-2 text-slate-900">
              Executive Profile
            </h2>
            <p className="text-xs text-slate-700 leading-relaxed">{personalInfo.summary}</p>
          </div>
        )}

        {/* Professional Experience */}
        {experience.length > 0 && (
          <div>
            <h2 className="text-xs font-bold tracking-wider uppercase border-b border-slate-200 pb-1 mb-3 text-slate-900">
              Professional Experience
            </h2>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-slate-900 text-xs">
                      {exp.role} — <span className="font-semibold text-slate-700">{exp.company}</span>
                    </h3>
                    <span className="text-xs text-slate-500 font-medium">
                      {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  {exp.location && <p className="text-[11px] text-slate-500 italic">{exp.location}</p>}
                  <ul className="mt-1.5 space-y-1 text-xs text-slate-700 list-disc list-outside ml-4">
                    {exp.bullets.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Selected Projects */}
        {projects.length > 0 && (
          <div>
            <h2 className="text-xs font-bold tracking-wider uppercase border-b border-slate-200 pb-1 mb-3 text-slate-900">
              Key Projects & Initiatives
            </h2>
            <div className="space-y-2.5">
              {projects.map((p) => (
                <div key={p.id}>
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-xs text-slate-900">{p.title}</span>
                    {p.link && <span className="text-[11px] text-slate-500">{p.link}</span>}
                  </div>
                  <p className="text-xs text-slate-700">{p.description}</p>
                  {p.techStack.length > 0 && (
                    <p className="text-[11px] text-slate-500 mt-0.5">Stack: {p.techStack.join(', ')}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <div>
            <h2 className="text-xs font-bold tracking-wider uppercase border-b border-slate-200 pb-1 mb-2 text-slate-900">
              Education
            </h2>
            <div className="space-y-2">
              {education.map((e) => (
                <div key={e.id} className="flex justify-between items-baseline text-xs">
                  <div>
                    <span className="font-bold text-slate-900">{e.degree}</span>
                    <span className="text-slate-600"> · {e.institution}</span>
                    {e.grade && <span className="text-slate-500"> ({e.grade})</span>}
                  </div>
                  <span className="text-slate-500 font-medium">
                    {e.startDate} – {e.endDate}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Core Competencies */}
        <div>
          <h2 className="text-xs font-bold tracking-wider uppercase border-b border-slate-200 pb-1 mb-2 text-slate-900">
            Skills & Competencies
          </h2>
          <div className="text-xs text-slate-700 space-y-1">
            {skills.technical.length > 0 && (
              <p>
                <strong className="text-slate-900">Technical:</strong> {skills.technical.join(', ')}
              </p>
            )}
            {skills.tools.length > 0 && (
              <p>
                <strong className="text-slate-900">Tools:</strong> {skills.tools.join(', ')}
              </p>
            )}
            {skills.soft.length > 0 && (
              <p>
                <strong className="text-slate-900">Core:</strong> {skills.soft.join(', ')}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* -----------------------------------------------------------
   TEMPLATE 3: CREATIVE PRO (Modern Left Sidebar Layout)
----------------------------------------------------------- */
const CreativeProTemplate: React.FC<{ resume: ResumeData; accent: string; fontClass: string; spacingClass: string }> = ({
  resume,
  accent,
  fontClass,
  spacingClass,
}) => {
  const { personalInfo, education, experience, projects, skills, certifications, achievements } = resume;

  return (
    <div className={`w-full bg-white text-slate-800 ${fontClass} text-sm flex overflow-hidden min-h-[900px]`}>
      {/* Left Column Sidebar */}
      <div className="w-[34%] bg-slate-900 text-white p-7 flex flex-col justify-between">
        <div className="space-y-6">
          {/* Brand */}
          <div>
            <h1 className="text-2xl font-black tracking-tight">{personalInfo.fullName}</h1>
            <p className="text-xs font-medium text-blue-400 mt-1">{personalInfo.jobTitle}</p>
          </div>

          {/* Contact */}
          <div className="space-y-2 text-xs text-slate-300">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-1">
              Contact
            </h3>
            {personalInfo.email && <div className="break-all">{personalInfo.email}</div>}
            {personalInfo.phone && <div>{personalInfo.phone}</div>}
            {personalInfo.location && <div>{personalInfo.location}</div>}
            {personalInfo.linkedin && <div className="break-all">{personalInfo.linkedin}</div>}
            {personalInfo.github && <div className="break-all">{personalInfo.github}</div>}
          </div>

          {/* Skills */}
          <div className="space-y-2">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-1">
              Expertise
            </h3>
            <div className="space-y-2 text-xs text-slate-300">
              {skills.technical.map((sk) => (
                <div key={sk} className="flex items-center justify-between">
                  <span>{sk}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          {education.length > 0 && (
            <div className="space-y-2 text-xs text-slate-300">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-1">
                Education
              </h3>
              {education.map((e) => (
                <div key={e.id}>
                  <div className="font-semibold text-white">{e.degree}</div>
                  <div className="text-slate-400">{e.institution}</div>
                  <div className="text-[11px] text-slate-500">{e.startDate} – {e.endDate}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Column Content */}
      <div className={`w-[66%] p-8 bg-white ${spacingClass}`}>
        {/* Profile */}
        {personalInfo.summary && (
          <div>
            <h2 className="text-xs font-bold tracking-wider uppercase text-slate-900 border-b-2 border-slate-100 pb-1 mb-2">
              Profile
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">{personalInfo.summary}</p>
          </div>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <div>
            <h2 className="text-xs font-bold tracking-wider uppercase text-slate-900 border-b-2 border-slate-100 pb-1 mb-3">
              Work Experience
            </h2>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-slate-900 text-xs">{exp.role}</h3>
                    <span className="text-[11px] text-slate-500 font-medium">
                      {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 font-medium">{exp.company}</div>
                  <ul className="mt-1.5 space-y-1 text-xs text-slate-600 list-disc list-outside ml-3">
                    {exp.bullets.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <div>
            <h2 className="text-xs font-bold tracking-wider uppercase text-slate-900 border-b-2 border-slate-100 pb-1 mb-3">
              Portfolio Projects
            </h2>
            <div className="space-y-3">
              {projects.map((p) => (
                <div key={p.id} className="p-3 bg-slate-50 border border-slate-100 rounded-lg">
                  <div className="flex justify-between items-baseline">
                    <span className="font-semibold text-xs text-slate-900">{p.title}</span>
                    {p.link && <span className="text-[11px] text-blue-600">{p.link}</span>}
                  </div>
                  <p className="text-xs text-slate-600 mt-1">{p.description}</p>
                  {p.bullets && (
                    <ul className="mt-1 space-y-0.5 text-[11px] text-slate-600 list-disc list-outside ml-3">
                      {p.bullets.map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* -----------------------------------------------------------
   TEMPLATE 4: ATS STANDARD (Cleanest Machine-Readable Format)
----------------------------------------------------------- */
const AtsStandardTemplate: React.FC<{ resume: ResumeData; accent: string; fontClass: string; spacingClass: string }> = ({
  resume,
  fontClass,
}) => {
  const { personalInfo, education, experience, projects, skills, certifications, achievements } = resume;

  return (
    <div className={`w-full bg-white text-black p-8 ${fontClass} text-xs leading-normal`}>
      {/* Name and Contact */}
      <div className="text-center pb-3">
        <h1 className="text-xl font-bold uppercase">{personalInfo.fullName}</h1>
        <p className="font-semibold mt-0.5">{personalInfo.jobTitle}</p>
        <p className="mt-1">
          {[personalInfo.email, personalInfo.phone, personalInfo.location, personalInfo.linkedin, personalInfo.github]
            .filter(Boolean)
            .join(' | ')}
        </p>
      </div>

      {/* Summary */}
      {personalInfo.summary && (
        <div className="mt-3">
          <h2 className="font-bold uppercase border-b border-black pb-0.5 mb-1">Professional Summary</h2>
          <p className="text-justify">{personalInfo.summary}</p>
        </div>
      )}

      {/* Technical Skills */}
      <div className="mt-3">
        <h2 className="font-bold uppercase border-b border-black pb-0.5 mb-1">Technical Skills</h2>
        <div className="space-y-0.5">
          {skills.technical.length > 0 && (
            <p><strong>Languages & Frameworks:</strong> {skills.technical.join(', ')}</p>
          )}
          {skills.tools.length > 0 && (
            <p><strong>Developer Tools & Cloud:</strong> {skills.tools.join(', ')}</p>
          )}
          {skills.soft.length > 0 && (
            <p><strong>Core Competencies:</strong> {skills.soft.join(', ')}</p>
          )}
        </div>
      </div>

      {/* Experience */}
      {experience.length > 0 && (
        <div className="mt-3">
          <h2 className="font-bold uppercase border-b border-black pb-0.5 mb-1.5">Work Experience</h2>
          <div className="space-y-2.5">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between font-bold">
                  <span>{exp.company}</span>
                  <span>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
                </div>
                <div className="flex justify-between italic">
                  <span>{exp.role}</span>
                  <span>{exp.location}</span>
                </div>
                <ul className="list-disc list-outside ml-4 mt-0.5 space-y-0.5">
                  {exp.bullets.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div className="mt-3">
          <h2 className="font-bold uppercase border-b border-black pb-0.5 mb-1.5">Projects</h2>
          <div className="space-y-2">
            {projects.map((p) => (
              <div key={p.id}>
                <div className="flex justify-between font-bold">
                  <span>{p.title}</span>
                  {p.link && <span className="font-normal">{p.link}</span>}
                </div>
                {p.techStack.length > 0 && (
                  <p className="italic">Technologies: {p.techStack.join(', ')}</p>
                )}
                <p>{p.description}</p>
                {p.bullets && (
                  <ul className="list-disc list-outside ml-4 mt-0.5 space-y-0.5">
                    {p.bullets.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="mt-3">
          <h2 className="font-bold uppercase border-b border-black pb-0.5 mb-1">Education</h2>
          <div className="space-y-1">
            {education.map((e) => (
              <div key={e.id} className="flex justify-between">
                <div>
                  <span className="font-bold">{e.institution}</span> — {e.degree}
                  {e.grade && ` (${e.grade})`}
                </div>
                <span>{e.startDate} – {e.endDate}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications & Achievements */}
      {(certifications.length > 0 || achievements.length > 0) && (
        <div className="mt-3">
          <h2 className="font-bold uppercase border-b border-black pb-0.5 mb-1">Certifications & Honors</h2>
          <ul className="list-disc list-outside ml-4 space-y-0.5">
            {certifications.map((c) => (
              <li key={c.id}>
                <strong>{c.name}</strong> – {c.issuer} ({c.issueDate})
              </li>
            ))}
            {achievements.map((a) => (
              <li key={a.id}>
                <strong>{a.title}</strong>: {a.description}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

/* -----------------------------------------------------------
   TEMPLATE 5: VIBRANT DUO (Contemporary Clean Balance)
----------------------------------------------------------- */
const VibrantDuoTemplate: React.FC<{ resume: ResumeData; accent: string; fontClass: string; spacingClass: string }> = ({
  resume,
  accent,
  fontClass,
  spacingClass,
}) => {
  const { personalInfo, education, experience, projects, skills, certifications } = resume;

  return (
    <div className={`w-full bg-white text-slate-800 p-8 ${fontClass} text-sm`}>
      {/* Header with pill-less contemporary badge */}
      <div className="p-6 rounded-xl bg-slate-900 text-white mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{personalInfo.fullName}</h1>
            <p className="text-sm text-blue-300 font-medium mt-0.5">{personalInfo.jobTitle}</p>
          </div>
          <div className="text-xs text-slate-300 space-y-1 md:text-right">
            <div>{personalInfo.email}</div>
            <div>{personalInfo.phone} · {personalInfo.location}</div>
          </div>
        </div>
        {personalInfo.summary && (
          <p className="text-xs text-slate-300 mt-4 pt-3 border-t border-slate-800 leading-relaxed">
            {personalInfo.summary}
          </p>
        )}
      </div>

      <div className={`grid grid-cols-12 gap-6 ${spacingClass}`}>
        <div className="col-span-8 space-y-5">
          {experience.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-1 border-b mb-3" style={{ borderColor: accent }}>
                Experience
              </h2>
              <div className="space-y-4">
                {experience.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-baseline">
                      <span className="font-semibold text-xs text-slate-900">{exp.role}</span>
                      <span className="text-[11px] text-slate-500">{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
                    </div>
                    <div className="text-xs text-slate-600 font-medium">{exp.company}</div>
                    <ul className="mt-1 space-y-1 text-xs text-slate-600 list-disc list-outside ml-3">
                      {exp.bullets.map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {projects.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-1 border-b mb-3" style={{ borderColor: accent }}>
                Projects
              </h2>
              <div className="space-y-3">
                {projects.map((p) => (
                  <div key={p.id}>
                    <span className="font-semibold text-xs text-slate-900">{p.title}</span>
                    <p className="text-xs text-slate-600">{p.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="col-span-4 space-y-5">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-1 border-b mb-2" style={{ borderColor: accent }}>
              Skills
            </h2>
            <p className="text-xs text-slate-600">{skills.technical.join(', ')}</p>
          </div>

          {education.length > 0 && (
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-1 border-b mb-2" style={{ borderColor: accent }}>
                Education
              </h2>
              {education.map((e) => (
                <div key={e.id} className="text-xs mb-2">
                  <div className="font-semibold text-slate-900">{e.degree}</div>
                  <div className="text-slate-600">{e.institution}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
