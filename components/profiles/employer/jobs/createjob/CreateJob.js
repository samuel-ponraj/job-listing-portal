'use client'
import { Box, Button, Toolbar } from "@mui/material";
import { useState } from "react";
import { Toaster, toast } from "sonner";

const Jobs = () => {


  const [formData, setFormData] = useState({
    jobTitle: "",
    experience: "",
    jobType: "",
    description: "",
    jobLocation: "",
    jobArea: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await fetch("/api/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      toast.success("Job posted successfully!");

      setFormData({
        jobTitle: "",
        experience: "",
        jobType: "",
        description: "",
        jobLocation: "",
        jobArea: "",
      });
 
    } else {
      const err = await res.json();
      toast.error(err.error || "Failed to post job");
    }
  } catch (error) {
    console.error(error);
    toast.error("Something went wrong!");
  }
};


  return (
    <Box component="section" sx={{ flexGrow: 1 }}>
      <Toaster position="top-center" richColors />
      <Toolbar />

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
          gap: 3,
        }}
      >
        {/* Job Title */}
        <Box>
          <label>Job Title</label>
          <input
            name="jobTitle"
            value={formData.jobTitle}
            onChange={handleChange}
            type="text"
            placeholder="Enter Job Title"
            style={inputStyle}
            required
          />
        </Box>

        {/* Experience Needed */}
        <Box>
          <label>Experience Needed</label>
          <input
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            type="text"
            placeholder="e.g., 1-3 years"
            style={inputStyle}
            required
          />
        </Box>

        {/* Job Type */}
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
            <option value="fulltime">Full Time</option>
            <option value="parttime">Part Time</option>
            <option value="freelance">Freelance</option>
          </select>
        </Box>

        {/* Job Location Type */}
        <Box>
          <label>Job Location Type</label>
          <select
            name="jobLocation"
            value={formData.jobLocation}
            onChange={handleChange}
            style={inputStyle}
            required
          >
            <option value="">Select Location Type</option>
            <option value="onsite">Onsite</option>
            <option value="remote">Remote</option>
            <option value="hybrid">Hybrid</option>
          </select>
        </Box>

        {/* Job Area (City / Region) */}
        <Box sx={{ gridColumn: "1 / span 2" }}>
          <label>Job Area</label>
          <input
            name="jobArea"
            value={formData.jobArea}
            onChange={handleChange}
            type="text"
            placeholder="e.g., Chennai, Bangalore, Mumbai"
            style={inputStyle}
            required
          />
        </Box>

        {/* Description */}
        <Box sx={{ gridColumn: "1 / span 2" }}>
          <label>Job Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter job description..."
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
            Post Job
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

// Styles (same as ProfileForm)
const inputStyle = {
  width: "100%",
  padding: "10px",
  border: "1px solid #ccc",
  borderRadius: "6px",
  marginTop: "6px",
  background: "#fff",
};

const textareaStyle = {
  width: "100%",
  padding: "10px",
  border: "1px solid #ccc",
  borderRadius: "6px",
  marginTop: "6px",
  resize: "vertical",
  background: "#fff",
};

export default Jobs;
