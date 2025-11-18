import EditJob from "@/components/profiles/employer/jobs/editjob/EditJob";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditJob /> 
    </Suspense>
  );
}

