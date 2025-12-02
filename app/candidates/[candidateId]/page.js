
import CandidateDetailsPage from "../../../components/profiles/candidateDetailsPage/CandidateDetailsPage";

export default async function Page({ params }) {
  const { candidateId } = await params;

  return (
    <div>
      <CandidateDetailsPage candidateId={candidateId} />
    </div>
  );
}
