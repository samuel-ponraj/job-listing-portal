"use client";
import { useEffect, useState } from "react";
import { doc, getDoc  } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Toaster, toast } from "sonner";
import styles from "./CandidateDetailsPage.module.css";
import { useParams } from "next/navigation";
import { LuDownload } from "react-icons/lu";
import Link from "next/link";

const CandidateDetailsPage = () => {
  const { candidateId } = useParams(); 
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!candidateId) {
      console.log("No candidateId in URL");
      setLoading(false);
      return;
    }

    const fetchCandidate = async () => {
      try {
        console.log("Fetching candidate:", candidateId);
        const candidateRef = doc(db, "users", candidateId);
        const candidateSnap = await getDoc(candidateRef);

        if (!candidateSnap.exists()) {
          toast.error("Candidate not found");
          setCandidate(null);
        } else {
          setCandidate(candidateSnap.data());
        }
      } catch (err) {
        console.error("Failed to fetch candidate:", err);
        toast.error("Failed to fetch candidate");
      } finally {
        setLoading(false);
      }
    };

    fetchCandidate();
  }, [candidateId]);

  if (loading) return <p>Loading...</p>;
  if (!candidate) return <p>No data available</p>;

  const profile = candidate.profile || {};
  const employment = candidate.employement
  ? Array.isArray(candidate.employement)
      ? candidate.employement
      : Object.values(candidate.employement)
  : [];
  const education = candidate.education
  ? Array.isArray(candidate.education)
      ? candidate.education
      : Object.values(candidate.education)
  : [];
  const resume = candidate.resume || {};

  	const createdAtDate = candidate.createdAt?.toDate();
	const updatedAtDate = candidate.updatedAt?.toDate();

	const formatDate = (date) =>
	date?.toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "2-digit",
	});

  return (
    <div className={styles.container}>
      <Toaster position="top-center" richColors />

      <div className={styles.headerContainer}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.headerImage}>
              <img
                src={profile.photoURL || "/placeholder.png"}
                alt=""
                width={100}
                height={100}
              />
            </div>

            <div className={styles.headerDetailsContainer}>
              <div className={styles.headerDetails}>
                <h1>
                  {candidate.firstName} {candidate.lastName}
                </h1>
                <p  className={styles.location}>
                  {profile.city}, {profile.state}, {profile.country}
                </p>

				<div className={styles.dates}>
					<p><strong style={{color:'var(--background)'}}>Created:</strong> {formatDate(createdAtDate)}</p>
					<p><strong style={{color:'var(--background)'}}>Updated:</strong> {formatDate(updatedAtDate)}</p>
				</div>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className={styles.headerRight}>
           	<Link href={`mailto:${profile.email}`}>
		   		<p className={styles.contactBtn}>Contact Candidate</p>
			</Link>
            <p className={styles.saveBtn}>Save Profile</p>
          </div>
        </div>
      </div>

      <div className={styles.candidateDetailsSection}>
        
		
		<div className={styles.candidateDetails}>

			<div className={styles.leftSection}>

          	<div className={styles.summary}>
				<h2>Summary</h2>
				<div className={styles.summarytext} dangerouslySetInnerHTML={{ __html: profile.summary }}/>
         	</div>

		  	<div className={styles.employmentDetails}>
				<h2>Employment</h2>
				<ul>
				{employment.map((job, index) => (
					<li key={index}>
						<h3>{job.title} ({job.startDate} – {job.current === "Yes" ? "Present" : job.endDate})</h3>
						<h4>{job.company}</h4>
					</li>
				))}
				</ul>
        	</div>

			<div className={styles.educationDetails}>
				<h2>Education</h2>
				<ul>
				{education.map((edu, index) => (
					<li key={index}>
						<h3>{edu.course} ({edu.percentage} %)</h3>
						<h4>{edu.institution}</h4>
						<p>Year of Passing: {edu.graduationYear}</p>
					</li>
				))}
				</ul>
        	</div>

			</div>
			<div className={styles.rightSection}>

			<div className={styles.resume}>
				<h2>Resume</h2>
				<Link href={resume.url} target="_blank" rel="noopener noreferrer" download>
					<p>
						<LuDownload /> {resume.name}
					</p>
				</Link>
        	</div>

			<div className={styles.contactDetails}>
				<h2>Contact Info</h2>
				<div>
					<p><span>Phone</span>: {profile.phone}</p>
					<p><span>Email</span>: {profile.email}</p>
				</div>
        	</div>

			</div>
        </div>
      </div>

    </div>
  );
};

export default CandidateDetailsPage;
