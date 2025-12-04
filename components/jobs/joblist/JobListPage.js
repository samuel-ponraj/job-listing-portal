'use client'
import { useEffect, useState } from 'react';
import styles from './JobListPage.module.css'
import { PiBriefcase } from "react-icons/pi";
import { IoLocationOutline } from "react-icons/io5";
import { BsCashStack } from "react-icons/bs";
import Link from 'next/link';
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Box } from "@mui/material";
import { BiFilterAlt } from "react-icons/bi";
import { BsBookmark } from "react-icons/bs";
import { useUser } from "@clerk/nextjs";
import { BsBookmarkCheck } from "react-icons/bs";
import { toast, Toaster } from 'sonner';


const JobListPage = ({ search }) => {

  const { user, isLoaded } = useUser();
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);

  // Filters
  const [keyword, setKeyword] = useState("");
  const [jobLocation, setJobLocation] = useState("");
  const [jobType, setJobType] = useState("");
  const [workMode, setWorkMode] = useState("");
  const [industry, setIndustry] = useState("");
  const [minSalary, setMinSalary] = useState("");
  const [maxSalary, setMaxSalary] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [searchInput, setSearchInput] = useState(keyword);
  const [savedJobs, setSavedJobs] = useState([]);


  // Fetch jobs
  useEffect(() => {
    const fetchJobs = async () => {
      const res = await fetch("/api/jobs");
      const data = await res.json();

      if (data.jobs) {
        setJobs(data.jobs);
        setFilteredJobs(data.jobs);
      }
    };

    fetchJobs();
  }, []);

  useEffect(() => {
  const fetchSavedJobs = async () => {
    if (!isLoaded || !user) return;

    const userRef = doc(db, "users", user.id);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      setSavedJobs(userSnap.data()?.savedJobs || []);
    }
  };

  fetchSavedJobs();
}, [isLoaded, user]);


 useEffect(() => {
  if (search) {
    setKeyword(search);  
  }
}, [search]);

  // Filter + Sort
  useEffect(() => {
    let result = [...jobs];

    // Keyword (jobTitle or jobArea)
    if (keyword.trim()) {
      result = result.filter(job =>
        job.jobTitle.toLowerCase().includes(keyword.toLowerCase()) ||
        job.jobLocation.toLowerCase().includes(keyword.toLowerCase())
      );
    }

    // Job Area (Chennai, Bangalore)
    if (jobLocation.trim()) {
      result = result.filter(job =>
        job.jobLocation.toLowerCase().includes(jobLocation.toLowerCase())
      );
    }

    // Location
        if (workMode.trim()) {
        result = result.filter(job =>
            job.workMode?.toLowerCase() === workMode.toLowerCase()
        );
        }

        if (industry.trim()) {
        result = result.filter(job =>
            job.industry?.toLowerCase() === industry.toLowerCase()
        );
        }

        // Job Type
        if (jobType.trim()) {
        result = result.filter(job =>
            job.jobType?.toLowerCase() === jobType.toLowerCase()
        );
        }


    // Salary Min
    if (minSalary) {
      result = result.filter(job =>
        Number(job.salary?.max) >= Number(minSalary)
      );
    }

    // Salary Max
    if (maxSalary) {
      result = result.filter(job =>
        Number(job.salary?.min) <= Number(maxSalary)
      );
    }

    // Sorting
    if (sortBy === "date_new_old") {
      result.sort((a, b) => new Date(b.dateCreated) - new Date(a.dateCreated));
    }

    if (sortBy === "date_old_new") {
      result.sort((a, b) => new Date(a.dateCreated) - new Date(b.dateCreated));
    }

    if (sortBy === "salary_low_high") {
      result.sort((a, b) => a.salary?.min - b.salary?.min);
    }

    if (sortBy === "salary_high_low") {
      result.sort((a, b) => b.salary?.max - a.salary?.max);
    }

    setFilteredJobs(result);

  }, [keyword, jobLocation, industry, jobType, workMode, minSalary, maxSalary, sortBy, jobs]);

 
  const handleSaveJob = async (jobId) => {
  if (!isLoaded || !user) {
    toast.error("Please login to save the job");
    return;
  }

  try {
    const userRef = doc(db, "users", user.id);
    const userSnap = await getDoc(userRef);

    const userData = userSnap.data();
    const saved = userData?.savedJobs || [];

    if (saved.includes(jobId)) {
      toast.error("You have already saved this job");
      return;
    }

    await updateDoc(userRef, {
      savedJobs: arrayUnion(jobId),
    });

    // Update UI immediately
    setSavedJobs((prev) => [...prev, jobId]);

    toast.success("Job saved successfully!");
  } catch (err) {
    console.error(err);
    toast.error("Failed to save job");
  }
};




  return (
    <div className={styles.container}>
      <Toaster position="top-center" richColors />
      <div className={styles.jobListPage}>
        
        {/* Sidebar Filters */}
        <div className={styles.sidebar}>
          <h2><BiFilterAlt /> Filters</h2>
          {/* Keyword Search */}
          <Box className={styles.filterInputs}>
            <label>Search by Keywords</label>
            <input
              type="text"
              style={inputStyle}
              placeholder='Developer, Java...'
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </Box>

          <Box className={styles.filterInputs}>
                                    <label>Industry</label>
                                    <select
                                      value={industry}
                                      onChange={(e) => setIndustry(e.target.value)}
                                      style={{
                                          ...inputStyle,
                                          color: workMode ? "#000" : "#888", 
                                        }}
                                    >
                                      <option value="">Select Industry</option>
                          <option value="Information Technology">Information Technology</option>
                          <option value="Publishing">Publishing</option>
                          <option value="Healthcare">Healthcare</option>
                          <option value="Education & Training">Education & Training</option>
                          <option value="Banking & Finance">Banking & Finance</option>
                          <option value="E-Commerce">E-Commerce</option>
                          <option value="Marketing & Advertising">Marketing & Advertising</option>
                          <option value="Media & Entertainment">Media & Entertainment</option>
                          <option value="Manufacturing">Manufacturing</option>
                          <option value="Retail">Retail</option>
                          <option value="Telecommunications">Telecommunications</option>
                          <option value="Real Estate">Real Estate</option>
                          <option value="Construction">Construction</option>
                          <option value="Transportation & Logistics">Transportation & Logistics</option>
                          <option value="Hospitality & Tourism">Hospitality & Tourism</option>
                          <option value="Human Resources">Human Resources</option>
                          <option value="Legal Services">Legal Services</option>
                          <option value="Consulting">Consulting</option>
                          <option value="Automotive">Automotive</option>
                          <option value="Aerospace">Aerospace</option>
                          <option value="Agriculture">Agriculture</option>
                          <option value="Pharmaceuticals">Pharmaceuticals</option>
                          <option value="Public Sector / Government">Public Sector / Government</option>
                          <option value="Nonprofit / NGO">Nonprofit / NGO</option>
                          <option value="Energy & Utilities">Energy & Utilities</option>
                          <option value="Food & Beverage">Food & Beverage</option>
                          <option value="Insurance">Insurance</option>
                          <option value="Fashion & Apparel">Fashion & Apparel</option>
                          <option value="Sports & Recreation">Sports & Recreation</option>
                          <option value="Cybersecurity">Cybersecurity</option>
                          <option value="Fintech">Fintech</option>
                          <option value="Biotechnology">Biotechnology</option>
                          <option value="Event Management">Event Management</option>
                          <option value="Animation & Graphic Design">Animation & Graphic Design</option>
                          <option value="Customer Service / BPO">Customer Service / BPO</option>
                          
                                    </select>
                                  </Box>

          {/* Job Area */}
          <Box className={styles.filterInputs}>
            <label>Job Location</label>
            <input
              type="text"
              style={inputStyle}
              placeholder='Chennai, Bangalore...'
              value={jobLocation}
              onChange={(e) => setJobLocation(e.target.value)}
            />
          </Box>

          {/* Job Location */}
          <Box className={styles.filterInputs}>
            <label>Work Mode</label>
            <select
              style={{
                 ...inputStyle,
                color: workMode ? "#000" : "#888", 
                }}
              value={workMode}
              onChange={(e) => setWorkMode(e.target.value)}
            >
              <option value="">Select Location</option>
              <option value="Onsite">Onsite</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </Box>

          {/* Job Type */}
          <Box className={styles.filterInputs}>
            <label>Job Type</label>
            <select
              style={{
                 ...inputStyle,
                color: workMode ? "#000" : "#888", 
                }}
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
            >
              <option value="">Select Job Type</option>
              <option value="Full Time">Full Time</option>
              <option value="Part Time">Part Time</option>
              <option value="Freelance">Freelance</option>
            </select>
          </Box>

          {/* Salary Range */}
          <Box className={styles.filterInputs}>
            <label>Salary Range</label>
            <div style={{ display: 'flex', gap: '20px' }}>
              <input
                type="number"
                placeholder="Min"
                style={inputStyle}
                value={minSalary}
                onChange={(e) => setMinSalary(e.target.value)}
              />
              <input
                type="number"
                placeholder="Max"
                style={inputStyle}
                value={maxSalary}
                onChange={(e) => setMaxSalary(e.target.value)}
              />
            </div>
          </Box>
        </div>

        {/* Job List */}
        <div className={styles.jobList}>

          <div style={{ display: 'flex', alignItems:'center', justifyContent:'space-between', fontSize:'14px' }}>
            <p>Showing {filteredJobs.length} Jobs</p>
          </div>

          {filteredJobs.map((job) => (
            <div key={job.id} className={styles.jobCard}>
              <div className={styles.bookmark} onClick={() => handleSaveJob(job.id)}>
                {savedJobs.includes(job.id) ? (
                    <BsBookmarkCheck />
                  ) : (
                    <BsBookmark />
                  )}

                  
              </div>
              
              <div className={styles.companyLogo}>
                <img src={job.company.companyLogoURL || "/placeholder.png"} alt="" />
              </div>
              
              <div className={styles.job}>
                
                  <h3>
                    <Link href={`/jobs/${job.id}`}>
                      {job.jobTitle}
                    </Link>
                  </h3>
                
                <h4>{job.company.companyName}</h4>

                <div className={styles.jobdetails}>
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
          ))}

        </div>
      </div>
    </div>
  )
}

const inputStyle = {
  width: "100%",
  padding: "10px",
  border: "1px solid #ccc",
  borderRadius: "6px",
  marginTop: "6px",
  background: "#fff"
};

export default JobListPage;
