"use client";

import { useEffect, useState } from "react";
import styles from "./JobDetailPage.module.css"
import { PiBriefcase } from "react-icons/pi";
import { IoLocationOutline } from "react-icons/io5";
import { BsCashStack } from "react-icons/bs";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { toast, Toaster } from "sonner";
import { useUser } from "@clerk/nextjs";

export default function JobDetailPage({ jobId }) {
  const [job, setJob] = useState(null);
   const { user, isLoaded } = useUser();

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await fetch(`/api/jobs?id=${jobId}`);
        const data = await res.json();

        if (data.job) {
          setJob(data.job);
        }
      } catch (err) {
        console.error("Error fetching job:", err);
      }
    };

    fetchJob();
  }, [jobId]);

  if (!job) return <p>Loading...</p>;


  const handleApplyJob = async (job) => {
  if (!isLoaded || !user) {
    toast.error("Please login to apply");
    return;
  }

  try {
    const employerId = job.userId;
    const employerRef = doc(db, "users", employerId);
    const employerSnap = await getDoc(employerRef);

    if (!employerSnap.exists()) {
      toast.error("Employer not found");
      return;
    }

    const employerData = employerSnap.data();
    const applications = employerData?.company?.applications || [];

    // Check if the user has already applied for this job
    const alreadyApplied = applications.some(
      (app) => app.jobId === job.id && app.employeeId === user.id
    );

    if (alreadyApplied) {
      toast.error("You have already applied for this job");
      return;
    }

    // Add application
    await updateDoc(employerRef, {
      "company.applications": arrayUnion({
        jobId: job.id,
        employeeId: user.id,
        appliedAt: new Date(),
      }),
    });

    toast.success("Applied successfully!");
  } catch (err) {
    console.error(err);
    toast.error("Failed to apply");
  }
};



  return (
    <div className={styles.container}>
		<Toaster position="top-center" richColors />
      <div className={styles.headerContainer}>
        <div className={styles.header}>
			<div  className={styles.headerLeft}>
				<div className={styles.headerImage}>
					<img src={job.company.companyLogoURL || "/placeholder.png"} alt="" width={80} height={80}/>
				</div>
				<div className={styles.headerDetailsContainer}>
					<div className={styles.headerDetails}>
						<h1>{job.jobTitle}</h1>
						<h2>{job.company.companyName}</h2>
						<div className={styles.headerJobdetails}>
							<p><PiBriefcase /> {job.industry}</p>
							<p><IoLocationOutline /> {job.jobLocation}</p>
							<p><BsCashStack /> Rs. {job.salary.min} - {job.salary.max} / Month</p>
						</div>
						<div style={{display:'flex', alignItems:'center', gap:'20px'}}>
							<p className={styles.jobType}>{job.jobType}</p>
							<p className={styles.workMode}>{job.workMode}</p>
						</div>
					</div>
				</div>
			</div>
			<div  className={styles.headerRight}>
				<p>
					Posted on: November 25, 2025
				</p>
				<button className={styles.headerApplyBtn} onClick={() => handleApplyJob(job)} >Apply Job</button>
			</div>
        </div>
      </div>
      <div className={styles.jobDetailsContainer}>
		<div className={styles.jobDetailsSection}>
			<div className={styles.jobDetails}>
				<h3>Description</h3>
				<p>{job.description || "No description available"}</p>
			</div>
			{/* <div className={styles.companyDetailsContainer}>
				<h2>About Company</h2>
				<div className={styles.companyDetailsHeader}>
					<img src={job.company.companyLogoURL || "/placeholder.png"} alt="" width={50} height={50}/>
					<h3>{job.company.companyName}</h3>
				</div>
				<div className={styles.companyDetails}>
					<p>City:</p>
					<p>{job.company.city}</p>
				</div>
				<div className={styles.companyDetails}>
					<p>State:</p>
					<p>{job.company.state}</p>
				</div>
				<div className={styles.companyDetails}>
					<p>Country:</p>
					<p>{job.company.country}</p>
				</div>
				<div className={styles.companyDetails}>
					<p>Phone Number:</p>
					<p>{job.company.phone}</p>
				</div>
				<div className={styles.companyDetails}>
					<p>Email:</p>
					<p>{job.company.email}</p>
				</div>
				<div className={styles.companyDetails}>
					<p>Website:</p>
					<p>{job.company.website}</p>
				</div>
			</div> */}
		</div>
      </div>

      
      
    </div>
  );
}
