"use client";

import { useEffect, useState } from "react";
import styles from "./Applications.module.css";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import Link from "next/link";

const Applications = () => {
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const { user, isLoaded } = useUser();
  const loggedUserId = user?.id;

  // Fetch applications for the employer
  useEffect(() => {
    if (!isLoaded || !loggedUserId) return;

    const fetchApplications = async () => {
      try {
        const employerRef = doc(db, "users", loggedUserId);
        const employerSnap = await getDoc(employerRef);
        if (!employerSnap.exists()) {
          toast.error("Employer not found");
          return;
        }

        const companyData = employerSnap.data()?.company;
        const apps = companyData?.applications || [];

        // Fetch candidate info for each application
        const appsWithCandidate = await Promise.all(
          apps.map(async (app) => {
            const candidateRef = doc(db, "users", app.candidateId);
            const candidateSnap = await getDoc(candidateRef);

            let candidateName = "Unknown";
            let resumeUrl = null;

            if (candidateSnap.exists()) {
              const candidateData = candidateSnap.data();

              candidateName =
                `${candidateData?.firstName || ""} ${candidateData?.lastName || ""}`
                  .trim() || "Unknown";

              resumeUrl = candidateData?.resume?.url || null;
            }

            // Get job title
            const jobRef = doc(db, "jobs", app.jobId);
            const jobSnap = await getDoc(jobRef);
            const jobTitle = jobSnap.exists()
              ? jobSnap.data()?.jobTitle
              : "Deleted Job";

            return {
              ...app,
              candidateName,
              jobTitle,
              resumeUrl,
            };
          })
        );

        // Sort newest first
        appsWithCandidate.sort(
          (a, b) => b.appliedAt.toDate() - a.appliedAt.toDate()
        );

        setApplications(appsWithCandidate);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch applications");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [isLoaded, loggedUserId]);

  // Delete application
  const handleDelete = async (appl) => {
    if (!confirm("Are you sure you want to delete this application?")) return;

    try {
      const employerRef = doc(db, "users", loggedUserId);

      // Remove application
      const updatedApps = applications
        .filter(
          (a) =>
            a.candidateId !== appl.candidateId ||
            a.jobId !== appl.jobId
        )
        .map((a) => ({
          jobId: a.jobId,
          candidateId: a.candidateId,
          appliedAt: a.appliedAt,
        }));

      await updateDoc(employerRef, {
        "company.applications": updatedApps,
      });

      setApplications(updatedApps);
      toast.success("Application deleted");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete application");
    }
  };

  return (
    <div className={styles.container}>
      {loading ? (
        <p>Loading applications...</p>
      ) : applications.length === 0 ? (
        <p>No applications yet.</p>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>S.No.</th>
                <th>Date</th>
                <th>Candidate Name</th>
                <th>Job Applied For</th>
                <th>Resume</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {applications.map((app, index) => (
                <tr key={`${app.candidateId}-${app.jobId}`}>
                  <td>{index + 1}</td>
                  <td>{app.appliedAt.toDate().toLocaleDateString()}</td>

                  <td>
                    <Link
                      href={`/candidates/${app.candidateId}`}
                      className={styles.link}
                    >
                      {app.candidateName}
                    </Link>
                  </td>

                  <td>
                    <Link
                      href={`/jobs/${app.jobId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.link}
                    >
                      {app.jobTitle}
                    </Link>
                  </td>

                  <td>
                    {app.resumeUrl ? (
                      <a
                        href={app.resumeUrl}
                        download
                        className={styles.link}
                      >
                        Download
                      </a>
                    ) : (
                      "Not uploaded"
                    )}
                  </td>

                  <td>
                    <button
                      onClick={() => handleDelete(app)}
                      className={styles.deleteBtn}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      )}
    </div>
  );
};

export default Applications;
