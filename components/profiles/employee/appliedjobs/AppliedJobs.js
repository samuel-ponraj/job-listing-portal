"use client";

import { useEffect, useState } from "react";
import { PiBriefcase } from "react-icons/pi";
import { IoLocationOutline } from "react-icons/io5";
import { BsCashStack } from "react-icons/bs";
import { RiDeleteBin6Line } from "react-icons/ri";
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, getDoc, updateDoc } from "firebase/firestore";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { toast } from "sonner";
import styles from "./AppliedJobs.module.css";

const AppliedJobs = () => {
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, isLoaded } = useUser();
  const currentUserId = user?.id;

  useEffect(() => {
    if (!isLoaded || !currentUserId) return;

    const fetchAppliedJobs = async () => {
      try {
        const usersSnap = await getDocs(collection(db, "users"));
        const jobsArray = [];

        for (const userDoc of usersSnap.docs) {
          const company = userDoc.data()?.company;
          if (!company?.applications) continue;

          const myApplications = company.applications.filter(
            (app) => app.candidateId === currentUserId
          );

          for (const app of myApplications) {
            const jobRef = doc(db, "jobs", app.jobId);
            const jobSnap = await getDoc(jobRef);
            if (!jobSnap.exists()) continue;

            jobsArray.push({
              id: jobSnap.id,
              ...jobSnap.data(),
              company: {
                companyName: company.companyName,
                companyLogoURL: company.companyLogoURL,
                city: company.city,
                state: company.state,
                country: company.country,
              },
              companyUserId: userDoc.id, // needed for deletion
            });
          }
        }

        setAppliedJobs(jobsArray);
      } catch (err) {
        console.error("Error fetching applied jobs:", err);
        toast.error("Failed to fetch applied jobs");
      } finally {
        setLoading(false);
      }
    };

    fetchAppliedJobs();
  }, [isLoaded, currentUserId]);

  const handleWithdraw = async (job) => {
    if (!confirm("Do you want to withdraw job application?")) return;

    try {
      const employerRef = doc(db, "users", job.companyUserId);
      const employerSnap = await getDoc(employerRef);

      if (!employerSnap.exists()) {
        toast.error("Employer not found");
        return;
      }

      const company = employerSnap.data().company;
      const updatedApplications = company.applications.filter(
        (app) => !(app.jobId === job.id && app.candidateId === currentUserId)
      );

      await updateDoc(employerRef, {
        "company.applications": updatedApplications,
      });

      setAppliedJobs((prev) =>
        prev.filter((j) => !(j.id === job.id && j.companyUserId === job.companyUserId))
      );

      toast.success("Application withdrawn successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to withdraw application");
    }
  };


  return (
    <div className={styles.container}>{loading ? (
        <p>Loading applied jobs...</p>
      ) : appliedJobs.length === 0 ? (
        <p>No Applied Jobs</p>
      ) : (
       appliedJobs.map((job) => (
        <div key={job.id} className={styles.jobCard}>
          <div
            className={styles.deleteBtn}
            onClick={() => handleWithdraw(job)}
            style={{ cursor: "pointer" }}
          >
            <RiDeleteBin6Line />
          </div>
          <div className={styles.companyLogo}>
            <img src={job.company.companyLogoURL || "/placeholder.png"} alt="" />
          </div>
          <div className={styles.job}>
            <Link href={`/jobs/${job.id}`}>
              <h3>{job.jobTitle}</h3>
            </Link>
            <h4>{job.company.companyName}</h4>
            <div className={styles.jobdetails}>
              <p><PiBriefcase /> {job.industry}</p>
              <p><IoLocationOutline /> {job.jobLocation}</p>
            </div>
            <p className={styles.salaryDetails}><BsCashStack /> Rs. {job.salary.min} - {job.salary.max} / Month</p>
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

export default AppliedJobs;
