'use client'
import { useEffect, useState } from 'react';
import styles from './Overview.module.css';
import { PiSuitcaseSimple } from "react-icons/pi";
import { FaRegEnvelopeOpen } from "react-icons/fa6";
import Link from 'next/link';
import { db } from '@/lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useUser } from '@clerk/nextjs';

const Overview = () => {
  const { user, isLoaded } = useUser();
  const currentUserId = user?.id;

  const [jobsCount, setJobsCount] = useState(0);
  const [applicationsCount, setApplicationsCount] = useState(0);

  useEffect(() => {
    if (!isLoaded || !currentUserId) return;

    const fetchCounts = async () => {
      try {
        // 1️⃣ Count jobs for current employer
        const jobsSnap = await getDocs(collection(db, 'jobs'));
        const userJobs = jobsSnap.docs.filter(doc => doc.data().userId === currentUserId);
        setJobsCount(userJobs.length);

        // 2️⃣ Count applications where current employer received applications
        const usersSnap = await getDocs(collection(db, 'users'));
        let totalApplications = 0;

        usersSnap.docs.forEach(userDoc => {
          const company = userDoc.data()?.company;
          if (!company?.applications) return;

          // Count applications for jobs posted by current user
          const relevantApps = company.applications.filter(app => app.jobId && userJobs.some(j => j.id === app.jobId));
          totalApplications += relevantApps.length;
        });

        setApplicationsCount(totalApplications);
      } catch (err) {
        console.error('Error fetching counts:', err);
      }
    };

    fetchCounts();
  }, [isLoaded, currentUserId]);

  return (
    <section className={styles.container}>
      <div className={styles.statisticsCards}>
        <Link href='/employer/dashboard/jobs' className={styles.card}>
          <div>
            <PiSuitcaseSimple />
          </div>
          <div>
            <p>{jobsCount}</p>
            <h3>Listed Jobs</h3>
          </div>
        </Link>
        <Link href='/employer/dashboard/applications' className={styles.card}>
          <div>
            <FaRegEnvelopeOpen />
          </div>
          <div>
            <p>{applicationsCount}</p>
            <h3>Applications</h3>
          </div>
        </Link>
      </div>
    </section>
  );
};

export default Overview;
