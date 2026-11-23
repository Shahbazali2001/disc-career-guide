import { useQuery } from '@tanstack/react-query';
import { AlertTriangle, ArrowLeft, Bot, Briefcase, RotateCcw } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { extractApiError } from '../api/axiosClient.js';
import { getAssessment } from '../api/careerApi.js';
import JobCard from '../components/jobs/JobCard.jsx';
import JobDetailModal from '../components/jobs/JobDetailModal.jsx';
import JobFilters from '../components/jobs/JobFilters.jsx';

export default function JobExplorerPage() {
  const { id } = useParams();

  const [searchQuery, setSearchQuery] = useState('');
  const [officeOnly, setOfficeOnly] = useState(false);
  const [selectedFamily, setSelectedFamily] = useState('ALL');
  const [minMatch, setMinMatch] = useState(50);
  const [selectedJob, setSelectedJob] = useState(null);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['assessment', id],
    queryFn: () => getAssessment(id),
    enabled: Boolean(id),
  });

  const assessment = data?.assessment;
  const allJobs = assessment?.aiReport?.recommendedJobs || [];

  const filteredJobs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return allJobs.filter((job) => {
      if (officeOnly && !job.isOfficeRole) return false;
      if (selectedFamily !== 'ALL' && job.family !== selectedFamily) return false;
      if (Number(job.matchPercentage ?? 0) < minMatch) return false;

      if (q) {
        const titleMatch = String(job.title || '').toLowerCase().includes(q);
        const descMatch = String(job.description || '').toLowerCase().includes(q);
        const skillsMatch = (job.keySkills || []).some((s) =>
          String(s || '').toLowerCase().includes(q)
        );
        if (!titleMatch && !descMatch && !skillsMatch) return false;
      }

      return true;
    });
  }, [allJobs, minMatch, officeOnly, searchQuery, selectedFamily]);

  const hasActiveFilters =
    Boolean(searchQuery.trim()) || officeOnly || selectedFamily !== 'ALL' || minMatch > 50;

  const resetFilters = () => {
    setSearchQuery('');
    setOfficeOnly(false);
    setSelectedFamily('ALL');
    setMinMatch(50);
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl animate-pulse space-y-6 px-4 py-10 sm:px-6 lg:px-8">
        <div className="h-8 w-64 rounded bg-white/10" />
        <div className="glass-card h-28" />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="glass-card h-64" />
          ))}
        </div>
      </div>
    );
  }

  if (isError || !assessment) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <div className="glass-card p-8 text-center">
          <AlertTriangle className="mx-auto h-10 w-10 text-rose-400" />
          <h1 className="mt-4 text-xl font-bold text-white">Could not load matched jobs</h1>
          <p className="mt-2 text-sm text-slate-400">
            {extractApiError(error, 'Assessment not found or access denied.')}
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link to="/history" className="btn-ghost">
              My History
            </Link>
            <Link to="/test" className="btn-primary">
              Take Test
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-4 pb-16 pt-8 sm:px-6 lg:px-8">
      {/* Header Bar */}
      <div className="flex flex-col justify-between gap-4 border-b border-white/10 pb-6 md:flex-row md:items-center">
        <div>
          <Link
            to={`/results/${id}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-300 transition hover:text-indigo-200"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Results Dashboard</span>
          </Link>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            Career &amp; Job Explorer
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Matched for your <span className="font-semibold text-slate-200">{assessment.blendLabel}</span>{' '}
            ({assessment.aiReport?.styleTitle}). Click any role to compare DISC alignment.
          </p>
        </div>

        <Link
          to={`/chat/${id}`}
          className="btn-primary self-start md:self-auto"
        >
          <Bot className="h-4 w-4" />
          <span>Open AI Career Coach</span>
        </Link>
      </div>

      {/* Filter Bar */}
      <JobFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        officeOnly={officeOnly}
        onOfficeOnlyChange={setOfficeOnly}
        selectedFamily={selectedFamily}
        onFamilyChange={setSelectedFamily}
        minMatch={minMatch}
        onMinMatchChange={setMinMatch}
        onReset={resetFilters}
        hasActiveFilters={hasActiveFilters}
        resultCount={filteredJobs.length}
        totalCount={allJobs.length}
      />

      {/* Responsive Job Grid */}
      {filteredJobs.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredJobs.map((job, idx) => (
            <JobCard
              key={`${job.title}-${idx}`}
              job={job}
              index={idx}
              onSelect={setSelectedJob}
            />
          ))}
        </div>
      ) : (
        <div className="glass-card p-10 text-center">
          <Briefcase className="mx-auto h-10 w-10 text-slate-500" />
          <h2 className="mt-4 text-lg font-bold text-white">No roles match your current filters</h2>
          <p className="mt-1.5 text-sm text-slate-400">
            Try lowering the minimum match slider, clearing your search query, or showing both
            office and field roles.
          </p>
          <button type="button" onClick={resetFilters} className="btn-primary mt-5">
            <RotateCcw className="h-4 w-4" />
            <span>Reset Filters</span>
          </button>
        </div>
      )}

      {/* Side-by-Side Comparison Detail Modal */}
      <JobDetailModal
        job={selectedJob}
        userScores={assessment.scores}
        assessmentId={id}
        onClose={() => setSelectedJob(null)}
      />
    </div>
  );
}
