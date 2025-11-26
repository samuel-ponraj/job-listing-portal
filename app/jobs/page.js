// 'use client'
// import { useSearchParams } from 'next/navigation'
// import JobListPage from "../../components/jobs/joblist/JobListPage";

// export default function Page() {

//   const searchParams = useSearchParams();
//   const keyword = searchParams.get("search") || "";
  
//   return (
//     <div>
//       <JobListPage search ={keyword} /> 
//     </div>
//   );
// }

'use client'
import { useSearchParams } from 'next/navigation';
import { Suspense } from "react";
import JobListPage from "../../components/jobs/joblist/JobListPage";

function PageContent() {
  const searchParams = useSearchParams();
  const keyword = searchParams.get("search") || "";
  return <JobListPage search={keyword} />;
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PageContent />
    </Suspense>
  );
}

