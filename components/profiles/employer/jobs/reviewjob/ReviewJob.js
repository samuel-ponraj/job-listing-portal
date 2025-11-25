"use client";

import { useEffect, useState } from "react";
import styles from "./ReviewJob.module.css";
import { db } from "@/lib/firebase";
import { collection, getDocs, deleteDoc, doc, updateDoc, query, where, getDoc } from "firebase/firestore";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const ReviewJob = () => {
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [approvalStatus, setApprovalStatus] = useState({});
  const [approvedJobs, setApprovedJobs] = useState([]);
  const { user, isLoaded } = useUser();
  const loggedUserId = user?.id;
  const router = useRouter();


  const handleCreateJobClick = async () => {
  try {
    const userRef = doc(db, "users", loggedUserId);
    const userSnap = await getDoc(userRef);

    const userData = userSnap.data();

    const hasCompanyProfile =
      userData?.company && Object.keys(userData.company).length > 0;

    if (!hasCompanyProfile) {
      toast.warning("Please create a company profile first to post a job");
      router.push("/employer/dashboard/profile");
      return;
    }

    // Otherwise go to create job page
    router.push("/employer/dashboard/jobs/create-job");

  } catch (err) {
    console.error("Company profile check failed:", err);
  }
};

  

  useEffect(() => {
  if (!isLoaded || !loggedUserId) return;

  const fetchJobs = async () => {
    try {
      // Fetch jobs only created by the logged in company
      const q = query(
        collection(db, "jobs"),
        where("userId", "==", loggedUserId)
      );

      const querySnapshot = await getDocs(q);
      const jobsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // sort newest first
      jobsData.sort((a, b) => {
        const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt);
        const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt);
        return dateB - dateA;
      });

      setJobs(jobsData);

      const initialApproval = {};
      const approvedList = [];

      jobsData.forEach(job => {
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
}, [isLoaded, loggedUserId]);


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
        <div className={styles.createFirstJob}>
          <h1>Create Your First Job Posting</h1>
          <Link href='/employer/dashboard/jobs/create-job'>
            <button onClick={handleCreateJobClick}>Create Job</button>
          </Link>
        </div>
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
