'use client';
import { Box, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useUser } from "@clerk/nextjs";

const Education = () => {
  const { user } = useUser();
  const userId = user?.id;

  const [loading, setLoading] = useState(true);
  const [educationForms, setEducationForms] = useState([]);

  useEffect(() => {
    if (!userId) return;

    const fetchEducation = async () => {
      try {
        const ref = doc(db, "users", userId);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setEducationForms(snap.data().education || []);
        }
      } catch (err) {
        console.error("Error fetching education:", err);
        toast.error("Failed to fetch education details");
      } finally {
        setLoading(false);
      }
    };

    fetchEducation();
  }, [userId]);

  const addEducationForm = () => {
    setEducationForms((prev) => [
      ...prev,
      {
        course: "",
        institution: "",
        percentage: "",
        graduationYear: "",
      },
    ]);
  };

  const handleChange = (index, field, value) => {
    const updated = [...educationForms];
    updated[index][field] = value;
    setEducationForms(updated);
  };

  const handleSave = async () => {
    try {
      const ref = doc(db, "users", userId);
      await setDoc(ref, { education: educationForms }, { merge: true });
      toast.success("Education details saved!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save education details");
    }
  };

  if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>;

  return (
    <Box sx={{ mt: 5, minHeight: "100vh", position: "relative" }}>
      <Toaster position="top-center" richColors />

      {educationForms.length === 0 ? (
        <Box
          sx={{
            height: "60vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Button
            variant="contained"
            onClick={addEducationForm}
            sx={{ backgroundColor: "var(--background)" }}
          >
            Add Education
          </Button>
        </Box>
      ) : (
        <>
          <Box sx={{ textAlign: "right", mb: 2 }}>
            <Button variant="contained" onClick={addEducationForm} sx={{ backgroundColor: "var(--background)" }}>
              Add Education
            </Button>
          </Box>

          {educationForms.map((edu, index) => (
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
              {/* Course / Class / Grade */}
              <Box>
                <label>Course / Class / Grade</label>
                <input
                  type="text"
                  style={inputStyle}
                  value={edu.course}
                  onChange={(e) =>
                    handleChange(index, "course", e.target.value)
                  }
                />
              </Box>

              {/* University / College / School */}
              <Box>
                <label>University / College / School</label>
                <input
                  type="text"
                  style={inputStyle}
                  value={edu.institution}
                  onChange={(e) =>
                    handleChange(index, "institution", e.target.value)
                  }
                />
              </Box>

              {/* Percentage */}
              <Box>
                <label>Percentage / CGPA</label>
                <input
                  type="text"
                  style={inputStyle}
                  value={edu.percentage}
                  onChange={(e) =>
                    handleChange(index, "percentage", e.target.value)
                  }
                />
              </Box>

              {/* Year of Graduation */}
              <Box>
                <label>Year of Graduation</label>
                <input
                  type="number"
                  style={inputStyle}
                  value={edu.graduationYear}
                  onChange={(e) =>
                    handleChange(index, "graduationYear", e.target.value)
                  }
                />
              </Box>
            </Box>
          ))}

          <Box sx={{ textAlign: "center", mt: 2 }}>
            <Button
              variant="contained"
              sx={{ backgroundColor: "var(--background)" }}
              onClick={handleSave}
            >
              Save Education Details
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

export default Education;
