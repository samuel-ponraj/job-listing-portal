import React, { useState, useEffect } from "react";
import styles from "./ResumeUpload.module.css";
import { AiOutlineDownload } from "react-icons/ai";
import { RiDeleteBin6Line } from "react-icons/ri";
import { toast } from "sonner";
import { storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

const ResumeUpload = () => {
  const [resume, setResume] = useState(null);
  const [uploading, setUploading] = useState(false);


  useEffect(() => {
    const fetchResume = async () => {
      try {
        const res = await fetch("/api/resume", { credentials: "include" });
        if (!res.ok) return;

        const data = await res.json();
        if (data?.resume) setResume(data.resume);
      } catch (err) {
        console.error("Failed to load resume:", err);
      }
    };

    fetchResume();
  }, []);


  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      if (resume?.storagePath) {
        const oldRef = ref(storage, resume.storagePath);
        await deleteObject(oldRef).catch(() => {});
      }

 
      const fileRef = ref(
        storage,
        `users/resumes/${file.name}-${Date.now()}`
      );

      await uploadBytes(fileRef, file);
      const downloadURL = await getDownloadURL(fileRef);

      const payload = {
        url: downloadURL,
        name: file.name,
        storagePath: fileRef.fullPath,
        uploadedDate: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
      };

      const res = await fetch("/api/resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success("Resume updated successfully!");
        setResume(payload);
      } else {
        toast.error("Failed to save resume");
      }
    } catch (err) {
      console.error(err);
      toast.error("Resume upload failed");
    } finally {
      setUploading(false);
    }
  };


  const handleDownload = () => {
    if (!resume?.url) return;
    const link = document.createElement("a");
    link.href = resume.url;
    link.download = resume.name;
    link.click();
  };

  const handleDelete = async () => {
    if (!resume?.storagePath) return;

    try {
      const fileRef = ref(storage, resume.storagePath);
      await deleteObject(fileRef);

      await fetch("/api/resume/delete", {
        method: "DELETE",
        credentials: "include",
      });

      toast.success("Resume deleted");
      setResume(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete resume");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {resume ? (
          <>
            <div className={styles.header}>
              <div>
                <p className={styles.name}>{resume.name}</p>
                <p className={styles.date}>Uploaded on {resume.uploadedDate}</p>
              </div>

              <div className={styles.icons}>
                <AiOutlineDownload className={styles.iconBtn} onClick={handleDownload} />
                <RiDeleteBin6Line className={styles.iconBtn} onClick={handleDelete} />
              </div>
            </div>

            <div className={styles.uploadBox}>
              <label htmlFor="resume-upload" className={styles.uploadBtn}>
                {uploading ? "Updating..." : "Update Resume"}
              </label>

              <input
                type="file"
                id="resume-upload"
                className={styles.fileInput}
                onChange={handleFileChange}
                accept=".pdf"
              />

              <p className={styles.formatText}>Supported Format: .pdf</p>
            </div>
          </>
        ) : (
          <>
            <div className={styles.header}>
              <p>No resume uploaded</p>
            </div>

            <div className={styles.uploadBox}>
              <label htmlFor="resume-upload" className={styles.uploadBtn}>
                {uploading ? "Uploading..." : "Upload Resume"}
              </label>

              <input
                type="file"
                id="resume-upload"
                className={styles.fileInput}
                onChange={handleFileChange}
                accept=".pdf"
              />

              <p className={styles.formatText}>Supported Format: .pdf</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ResumeUpload;
