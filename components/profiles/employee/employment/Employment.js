'use client';
import { Box, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { useUser } from "@clerk/nextjs";

const Employment = () => {
  const { user } = useUser();
  const userId = user?.id;

  const [loading, setLoading] = useState(true);
  const [employmentForms, setEmploymentForms] = useState([]);

  useEffect(() => {
    if (!userId) return;

    const fetchEmployment = async () => {
      try {
        const ref = doc(db, "users", userId);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setEmploymentForms(snap.data().employement || []);
        }
      } catch (err) {
        console.error("Error fetching employment:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployment();
  }, [userId]);

  const addEmploymentForm = () => {
    setEmploymentForms((prev) => [
      ...prev,
      {
        current: "No",
        type: "",
        experience: "",
        company: "",
        title: "",
        startDate: "",
        endDate: "",
        noticePeriod: "",
      },
    ]);
  };

  const handleChange = (index, field, value) => {
    const updated = [...employmentForms];
    updated[index][field] = value;

    if (field === "current" && value === "Yes") {
      updated[index].endDate = ""; // hide ending date
    }

    setEmploymentForms(updated);
  };

  const handleSave = async () => {
    try {
      const ref = doc(db, "users", userId);

      await setDoc(ref, { employement: employmentForms }, { merge: true });

      toast.success("Employment details saved!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save employment details");
    }
  };

  if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>;

  return (
  <Box sx={{ mt: 5, minHeight: "100vh", position: "relative" }}>
    <Toaster position="top-center" richColors />

    {/* Center Add Button when NO forms exist */}
    {employmentForms.length === 0 ? (
      <Box
        sx={{
          height: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Button variant="contained" onClick={addEmploymentForm} sx={{ backgroundColor: "var(--background)" }}>
          Add Employment
        </Button>
      </Box>
    ) : (
      <>
        {/* Add Button for normal view */}
        <Box sx={{ textAlign: "right", mb: 2 }}>
          <Button variant="contained" onClick={addEmploymentForm} sx={{ backgroundColor: "var(--background)" }}>
            Add Employment
          </Button>
        </Box>

        {/* Employment Forms */}
        {employmentForms.map((emp, index) => (
          <Box
            key={index}
            sx={{
              border: "1px solid #ddd",
              borderRadius: "10px",
              padding: 3,
              mb: 3,
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: 3,
              boxShadow: "rgba(0, 0, 0, 0.05) 0px 3px 6px",
            }}
          >
            {/* Current Employment */}
            <Box>
              <label>Is this your current employment?</label>
              <Box sx={{ mt: 1 }}>
                <label style={{ marginRight: "15px" }}>
                  <input
                    type="radio"
                    name={`current-${index}`}
                    value="Yes"
                    checked={emp.current === "Yes"}
                    onChange={(e) =>
                      handleChange(index, "current", e.target.value)
                    }
                  />{" "}
                  Yes
                </label>
                <label>
                  <input
                    type="radio"
                    name={`current-${index}`}
                    value="No"
                    checked={emp.current === "No"}
                    onChange={(e) =>
                      handleChange(index, "current", e.target.value)
                    }
                  />{" "}
                  No
                </label>
              </Box>
            </Box>

            {/* Employment Type */}
            <Box>
              <label>Employment Type</label>
              <select
                style={inputStyle}
                value={emp.type}
                onChange={(e) =>
                  handleChange(index, "type", e.target.value)
                }
              >
                <option value="">Select</option>
                <option value="Full Time">Full Time</option>
                <option value="Part Time">Part Time</option>
                <option value="Internship">Internship</option>
              </select>
            </Box>

            {/* Experience */}
            <Box>
              <label>Total Experience</label>
              <input
                type="text"
                style={inputStyle}
                placeholder="e.g. 2 years"
                value={emp.experience}
                onChange={(e) =>
                  handleChange(index, "experience", e.target.value)
                }
              />
            </Box>

            {/* Company */}
            <Box>
              <label>Company Name</label>
              <input
                type="text"
                style={inputStyle}
                value={emp.company}
                onChange={(e) =>
                  handleChange(index, "company", e.target.value)
                }
              />
            </Box>

            {/* Job Title */}
            <Box>
              <label>Job Title</label>
              <input
                type="text"
                style={inputStyle}
                value={emp.title}
                onChange={(e) =>
                  handleChange(index, "title", e.target.value)
                }
              />
            </Box>

            {/* Joining Date */}
            <Box>
              <label>Joining Date</label>
              <input
                type="date"
                style={inputStyle}
                value={emp.startDate}
                onChange={(e) =>
                  handleChange(index, "startDate", e.target.value)
                }
              />
            </Box>

            {/* Ending Date */}
            {emp.current === "No" && (
              <Box>
                <label>Ending Date</label>
                <input
                  type="date"
                  style={inputStyle}
                  value={emp.endDate}
                  onChange={(e) =>
                    handleChange(index, "endDate", e.target.value)
                  }
                />
              </Box>
            )}

            {/* Notice Period */}
            <Box>
              <label>Notice Period</label>
              <input
                type="text"
                style={inputStyle}
                value={emp.noticePeriod}
                onChange={(e) =>
                  handleChange(index, "noticePeriod", e.target.value)
                }
              />
            </Box>
          </Box>
        ))}

        {/* Save Button — ONLY when forms exist */}
        <Box sx={{ textAlign: "center", mt: 2 }}>
          <Button
            variant="contained"
            sx={{ backgroundColor: "var(--background)" }}
            onClick={handleSave}
          >
            Save Employment Details
          </Button>
        </Box>
      </>
    )}
  </Box>
);
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  border: "1px solid #ccc",
  borderRadius: "6px",
  marginTop: "6px",
  boxShadow: "rgba(0, 0, 0, 0.04) 0px 3px 5px",
};

export default Employment;
