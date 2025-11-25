'use client'
import { useEffect, useState } from 'react';
import styles from './FeaturedJobs.module.css'
import { PiBriefcase } from "react-icons/pi";
import { IoLocationOutline } from "react-icons/io5";
import { BsCashStack } from "react-icons/bs";
import Link from 'next/link';

const FeaturedJobs = () => {

  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      const res = await fetch("/api/jobs");
      const data = await res.json();

      if (data.jobs) {
        setJobs(data.jobs);
      }
    };

    fetchJobs();
  }, []);

  return (
      <div className={styles.container}>
          <h2>Featured Jobs</h2>
          <p>Find the job that qualify your life</p>
          <div className={styles.featuredJobList}>
            {jobs.map((job) => (
              <div key={job.id} className={styles.jobCard}>
                <div className={styles.companyLogo}>
                  <img src={job.company.companyLogoURL || "/placeholder.png"} alt="" />
                </div>

                <div className={styles.job}>
                  <Link href={`/jobs/${job.id}`}>
                    <h3>{job.jobTitle}</h3>
                  </Link>
                  <h4>{job.company.companyName}</h4>
                  <div className={styles.jobdetails}>
                    <p><span style={{marginRight:'5px'}}><PiBriefcase /></span>{job.industry}</p>
                    <p><span style={{marginRight:'5px'}}><IoLocationOutline /></span>{job.jobLocation}</p>
                    <p><span style={{marginRight:'5px'}}><BsCashStack /></span>Rs. {job.salary?.min} - {job.salary?.max} / Month</p>
                  </div>
                  <div style={{display:'flex', alignItems:'center', gap:'20px'}}>
                  <p className={styles.jobType}>{job.jobType}</p>
                  <p className={styles.workMode}>{job.workMode}</p>
                </div>
                </div>
              </div>
            ))}
          </div>
          <Link href='/jobs'>
            <p className={styles.loadMoreBtn}>Load More Jobs</p>
          </Link>
      </div>
  )
}

export default FeaturedJobs