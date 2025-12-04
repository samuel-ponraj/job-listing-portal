"use client";

import { useEffect, useState } from "react";
import { PiBriefcase } from "react-icons/pi";
import { IoLocationOutline } from "react-icons/io5";
import { BsCashStack } from "react-icons/bs";
import { RiDeleteBin6Line } from "react-icons/ri";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { toast } from "sonner";
import styles from "./SavedJobs.module.css";

const SavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user, isLoaded } = useUser();
  const currentUserId = user?.id;

  // ---------------------------
  // 📌 Fetch saved jobs
  // ---------------------------
  useEffect(() => {
    if (!isLoaded || !currentUserId) return;

    const fetchSavedJobs = async () => {
      try {
        const userRef = doc(db, "users", currentUserId);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          setSavedJobs([]);
          setLoading(false);
          return;
        }

        const savedJobIds = userSnap.data()?.savedJobs || [];

        const jobsData = [];

        for (const jobId of savedJobIds) {
          const jobRef = doc(db, "jobs", jobId);
          const jobSnap = await getDoc(jobRef);

          if (jobSnap.exists()) {
            jobsData.push({
              id: jobSnap.id,
              ...jobSnap.data(),
            });
          }
        }

        setSavedJobs(jobsData);
      } catch (err) {
        console.error("Error fetching saved jobs:", err);
        toast.error("Failed to fetch saved jobs");
      } finally {
        setLoading(false);
      }
    };

    fetchSavedJobs();
  }, [isLoaded, currentUserId]);

  // ---------------------------
  // 📌 Remove saved job
  // ---------------------------
  const handleRemoveSavedJob = async (jobId) => {
    if (!confirm("Do you want to remove this saved job?")) return;

    try {
      const userRef = doc(db, "users", currentUserId);
      const userSnap = await getDoc(userRef);

      const userData = userSnap.data();
      const savedJobIds = userData?.savedJobs || [];

      const updatedSavedJobs = savedJobIds.filter((id) => id !== jobId);

      await updateDoc(userRef, {
        savedJobs: updatedSavedJobs,
      });

      setSavedJobs((prev) => prev.filter((job) => job.id !== jobId));

      toast.success("Job removed from saved list!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove job");
    }
  };

  return (
    <div className={styles.container}>
      {loading ? (
        <p>Loading saved jobs...</p>
      ) : savedJobs.length === 0 ? (
        <p>No Saved Jobs</p>
      ) : (
        savedJobs.map((job) => (
          <div key={job.id} className={styles.jobCard}>
            <div
              className={styles.deleteBtn}
              onClick={() => handleRemoveSavedJob(job.id)}
              style={{ cursor: "pointer" }}
            >
              <RiDeleteBin6Line />
            </div>

            <div className={styles.companyLogo}>
              <img src={job.company?.companyLogoURL || "/placeholder.png"} alt="" />
            </div>

            <div className={styles.job}>
              <Link href={`/jobs/${job.id}`}>
                <h3>{job.jobTitle}</h3>
              </Link>

              <h4>{job.company?.companyName}</h4>

              <div className={styles.jobdetails}>
                <p><PiBriefcase /> {job.industry}</p>
                <p><IoLocationOutline /> {job.jobLocation}</p>
              </div>

              <p className={styles.salaryDetails}>
                <BsCashStack /> Rs. {job.salary?.min} - {job.salary?.max} / Month
              </p>

              <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                <p className={styles.jobType}>{job.jobType}</p>
                <p className={styles.workMode}>{job.workMode}</p>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default SavedJobs;
