import JobDetailPage from "@/components/jobs/jobdetails/JobDetailPage";

export default async function Page({ params }) {
  const { jobId } = await params;

  return (
    <div>
      <JobDetailPage jobId={jobId} />
    </div>
  );
}
