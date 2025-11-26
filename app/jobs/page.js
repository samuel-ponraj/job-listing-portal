'use client'
import { useSearchParams } from 'next/navigation'
import JobListPage from "../../components/jobs/joblist/JobListPage";

export default function Page() {

  const searchParams = useSearchParams();
  const keyword = searchParams.get("search") || "";
  
  return (
    <div>
      <JobListPage search ={keyword} /> 
    </div>
  );
}
