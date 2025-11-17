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
    jobArea: "",
  });

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
            jobArea: jobData.jobArea || "",
          });
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

    try {
      const res = await fetch(`/api/jobs?id=${jobId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
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
          <input
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            type="text"
            style={inputStyle}
            required
          />
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
            <option value="fulltime">Full Time</option>
            <option value="parttime">Part Time</option>
            <option value="freelance">Freelance</option>
          </select>
        </Box>

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

        <Box sx={{ gridColumn: "1 / span 2" }}>
          <label>Job Area</label>
          <input
            name="jobArea"
            value={formData.jobArea}
            onChange={handleChange}
            type="text"
            style={inputStyle}
            required
          />
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

export default EditJob;
