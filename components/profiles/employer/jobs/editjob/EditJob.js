"use client";
import { Box, Button, Toolbar } from "@mui/material";
import { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const EditJob = () => {
  const searchParams = useSearchParams();
  const jobId = searchParams.get("id");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    jobTitle: "",
    experience: "",
    jobType: "",
    description: "",
    jobLocation: "",
    workMode:"",
    industry:"",
  });

  const [minSalary, setMinSalary] = useState("");
  const [maxSalary, setMaxSalary] = useState("");

  useEffect(() => {
    async function fetchJob() {
      if (!jobId) return;

      try {
        const docRef = doc(db, "jobs", jobId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const jobData = docSnap.data();

          setFormData({
            jobTitle: jobData.jobTitle || "",
            experience: jobData.experience || "",
            jobType: jobData.jobType || "",
            description: jobData.description || "",
            jobLocation: jobData.jobLocation || "",
            workMode: jobData.workMode || "",
            industry: jobData.industry || ""
          }),
          setMinSalary(jobData.salary?.min || "");
          setMaxSalary(jobData.salary?.max || "");
        } else {
          setError("Job not found");
        }
      } catch (err) {
        setError("Error fetching job data");
      } finally {
        setLoading(false);
      }
    }

    fetchJob();
  }, [jobId]);


  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
    ...formData,
    salary: {
      min: Number(minSalary),
      max: Number(maxSalary),
    },
    };

    try {
      const res = await fetch(`/api/jobs?id=${jobId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success("Job updated!");
      } else {
        const err = await res.json();
        toast.error(err.error || "Failed to update job");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <Box component="section" sx={{ flexGrow: 1,marginTop:'30px' }}>
      <Toaster position="top-center" richColors />

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
          gap: 3,
        }}
      >
        <Box>
          <label>Job Title</label>
          <input
            name="jobTitle"
            value={formData.jobTitle}
            onChange={handleChange}
            type="text"
            style={inputStyle}
            required
          />
        </Box>

        <Box>
                  <label>Experience Needed</label>
                  <select
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    style={inputStyle}
                    required
                  >
                    <option value="">Select Experience</option>
                    <option value="Fresher">Fresher</option>
                    <option value="1-2">1-2</option>
                    <option value="2-5">2-5</option>
                    <option value="5-8">5-8</option>
                    <option value="more than 8">More than 8</option>
                  </select>
                </Box>


                <Box sx={{ gridColumn: "1 / span 2" }}>
                          <label>Industry</label>
                          <select
                            name="industry"
                            value={formData.industry}
                            onChange={handleChange}
                            style={inputStyle}
                            required
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

        <Box>
          <label>Job Type</label>
          <select
            name="jobType"
            value={formData.jobType}
            onChange={handleChange}
            style={inputStyle}
            required
          >
            <option value="">Select Job Type</option>
            <option value="Full Time">Full Time</option>
            <option value="Part Time">Part Time</option>
            <option value="Freelance">Freelance</option>
            <option value="Internship">Internship</option>
          </select>
        </Box>

        <Box>
                  <label>Job Location</label>
                  <input
                    name="jobLocation"
                    value={formData.jobLocation}
                    onChange={handleChange}
                    type="text"
                    placeholder="e.g., Chennai, Bangalore, Mumbai"
                    style={inputStyle}
                    required
                  />
                </Box>

        <Box>
                  <label>Work Mode</label>
                  <select
                    name="workMode"
                    value={formData.workMode}
                    onChange={handleChange}
                    style={inputStyle}
                    required
                  >
                    <option value="">Select Work Mode</option>
                    <option value="Onsite">Onsite</option>
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </Box>

          <Box>
                    <label>Salary Range</label>
                    <div style={{display:'flex', alignItems:'center', gap:'24px'}}>
                    <input
                        name="minSalary"
                        type="number"
                        placeholder="Min Salary"
                        value={minSalary}
                        onChange={(e) => setMinSalary(e.target.value)}
                        style={inputStyle}
                        required
                      />
          
                      <input
                        name="maxSalary"
                        type="number"
                        placeholder="Max Salary"
                        value={maxSalary}
                        onChange={(e) => setMaxSalary(e.target.value)}
                        style={inputStyle}
                        required
                      />
                      </div>
                  </Box>

        <Box sx={{ gridColumn: "1 / span 2" }}>
          <label>Job Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            style={textareaStyle}
            required
          />
        </Box>

        <Box sx={{ gridColumn: "1 / span 2", textAlign: "center" }}>
          <Button
            variant="contained"
            type="submit"
            sx={{ mt: 2, backgroundColor: "var(--background)" }}
          >
            Update Job
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  border: "none",
  borderRadius: "6px",
  marginTop: "6px",
  background: "#fff",
  boxShadow: '  rgba(0, 0, 0, 0.04) 0px 3px 5px'
};

const textareaStyle = {
  width: "100%",
  padding: "10px",
  border: "none",
  borderRadius: "6px",
  marginTop: "6px",
  resize: "vertical",
  background: "#fff",
  fontFamily: "inherit",
  boxShadow: '  rgba(0, 0, 0, 0.04) 0px 3px 5px'
};

export default EditJob;
