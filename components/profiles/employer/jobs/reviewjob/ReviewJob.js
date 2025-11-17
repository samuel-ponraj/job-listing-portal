"use client";

import { useEffect, useState } from "react";
import styles from "./ReviewJob.module.css";
import { db } from "@/lib/firebase";
import { collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import Link from "next/link";

const ReviewJob = () => {
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [approvalStatus, setApprovalStatus] = useState({});
  const [approvedJobs, setApprovedJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "jobs"));
        const jobs = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        // sort newest first
        jobs.sort((a, b) => {
          const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt);
          const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt);
          return dateB - dateA;
        });

        setJobs(jobs);

        const initialApproval = {};
        const approvedList = [];

        jobs.forEach((job) => {
          initialApproval[job.id] = job.approved || false;
          if (job.approved) approvedList.push(job);
        });

        setApprovalStatus(initialApproval);
        setApprovedJobs(approvedList);
      } catch (err) {
        console.error("Error loading jobs", err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const toggleApproval = async (jobId) => {
    const newStatus = !approvalStatus[jobId];

    setApprovalStatus((prev) => ({ ...prev, [jobId]: newStatus }));

    try {
      await updateDoc(doc(db, "jobs", jobId), { approved: newStatus });
    } catch (err) {
      console.error("Error updating job status", err);
    }
  };

  const handleDelete = async (jobId) => {
    if (!confirm("Are you sure you want to delete this job?")) return;

    try {
      await deleteDoc(doc(db, "jobs", jobId));
      setJobs((prev) => prev.filter((job) => job.id !== jobId));
    } catch (err) {
      console.error("Error deleting job", err);
    }
  };

  return (
    <div className={styles.container}>
      {loading ? (
        <p>Loading jobs...</p>
      ) : jobs.length === 0 ? (
        <div>No jobs found.</div>
      ) : (
        <>
        <div className={styles.buttonWrapper}>
          <Link href='/employer/dashboard/jobs/create-job'>
            <button className={styles.createJobBtn}>Create Job</button>
          </Link>
        </div>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>S.No</th>
                <th>Date Created</th>
                <th>Job Title</th>
                <th>Job Type</th>
                <th>Experience</th>
                <th colSpan={2}>Description</th>
                <th>Approve</th>
                <th>Delete</th>
              </tr>
            </thead>

            <tbody>
              {jobs.map((job, index) => (
                <tr key={job.id}>
                  <td>{index + 1}</td>
                  <td>{job.createdAt?.seconds ? new Date(job.createdAt.seconds * 1000).toLocaleDateString() : "N/A"}</td>
                  <td>{job.jobTitle}</td>
                  <td>{job.jobType}</td>
                  <td>{job.experience}</td>
                  <td>
                    <Link href={`/jobs/${job.id}`} className={styles.link}>View</Link>
                  </td>
                  <td>
                    <Link
                      href={{
                        pathname: "/employer/dashboard/jobs/edit-job",
                        query: { id: job.id },
                      }}
                      className={styles.link}
                    >
                      Edit
                    </Link>
                  </td>

                  <td>
                    <button
                      onClick={() => toggleApproval(job.id)}
                      className={`${styles.approveBtn} ${
                        approvalStatus[job.id] ? styles.approved : styles.pending
                      }`}
                    >
                      {approvalStatus[job.id] ? "Approved" : "Approve"}
                    </button>
                  </td>

                  <td>
                    <button
                      onClick={() => handleDelete(job.id)}
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
        </>
      )}
    </div>
  );
};

export default ReviewJob;
