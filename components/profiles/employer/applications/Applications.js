"use client";

import { useEffect, useState } from "react";
import styles from "./Applications.module.css";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";

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

        // Fetch employee names for each application
        const appsWithEmployee = await Promise.all(
          apps.map(async (app) => {
            const employeeRef = doc(db, "users", app.employeeId);
            const employeeSnap = await getDoc(employeeRef);

            let employeeName = "Unknown";
            let resumeUrl = null;
            if (employeeSnap.exists()) {
              const employeeData = employeeSnap.data();
              employeeName = employeeData?.firstName || "Unknown";
              resumeUrl = employeeData?.resume?.url || null;
            }

            // Get job title from jobs collection
            const jobRef = doc(db, "jobs", app.jobId);
            const jobSnap = await getDoc(jobRef);
            const jobTitle = jobSnap.exists() ? jobSnap.data()?.jobTitle : "Deleted Job";

            return {
              ...app,
              employeeName,
              jobTitle,
              resumeUrl
            };
          })
        );

        // Sort newest first
        appsWithEmployee.sort((a, b) => b.appliedAt.toDate() - a.appliedAt.toDate());

        setApplications(appsWithEmployee);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch applications");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [isLoaded, loggedUserId]);

  const handleDelete = async (appl) => {
    if (!confirm("Are you sure you want to delete this application?")) return;

    try {
      const employerRef = doc(db, "users", loggedUserId);

      // Remove the application from employer's company.applications
      const updatedApps = applications
        .filter((a) => a.employeeId !== appl.employeeId || a.jobId !== appl.jobId)
        .map((a) => ({
          jobId: a.jobId,
          employeeId: a.employeeId,
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
                <th>Employee Name</th>
                <th>Job Applied For</th>
                <th>Resume</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app, index) => (
                <tr key={`${app.employeeId}-${app.jobId}`}>
                  <td>{index + 1}</td>
                  <td>{app.appliedAt.toDate().toLocaleDateString()}</td>
                  <td>{app.employeeName}</td>
                  <td><a
                      href={`/jobs/${app.jobId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.link}
                    >
                      {app.jobTitle}
                    </a></td>
                  <td>
                      {app.resumeUrl ? (
                        <a href={app.resumeUrl} download className={styles.link}>
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
