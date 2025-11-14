import React, { useState } from 'react';
import styles from './ResumeUpload.module.css';
import { AiOutlineDownload } from "react-icons/ai";
import { RiDeleteBin6Line } from "react-icons/ri";

const ResumeUpload = () => {
	const [resume, setResume] = useState({});

	const handleFileUpload = (e) => {
		const file = e.target.files[0];
		if (file) {
			setResume({
				name: file.name,
				date: new Date().toLocaleDateString('en-US', {
					month: 'short',
					day: 'numeric',
					year: 'numeric',
				}),
			});
		}
	};

	const handleDelete = () => {
		setResume(null);
	};

	return (
		<div className={styles.container}>
			{resume ? (
				<div className={styles.card}>
					<div className={styles.header}>
						<div>
							<p className={styles.name}>{resume.name}</p>
							<p className={styles.date}>Uploaded on {resume.date}</p>
						</div>
						<div className={styles.icons}>
								<AiOutlineDownload className={styles.iconBtn}/>
                <RiDeleteBin6Line className={styles.iconBtn} onClick={handleDelete}/>
						</div>
					</div>

					<div className={styles.uploadBox}>
						<label htmlFor="resume-upload" className={styles.uploadBtn}>
							Update resume
						</label>
						<input
							type="file"
							id="resume-upload"
							className={styles.fileInput}
							onChange={handleFileUpload}
							accept=".pdf"
						/>
						<p className={styles.formatText}>
							Supported Format: .pdf
						</p>
					</div>
				</div>
			) : (
				<div className={styles.card}>
          <div className={styles.header}>
						<div>
							<p>Having a Resume?</p>
						</div>
					</div>
					<div className={styles.uploadBox}>
            
						<label htmlFor="resume-upload" className={styles.uploadBtn}>
							Upload resume
						</label>
						<input
							type="file"
							id="resume-upload"
							className={styles.fileInput}
							onChange={handleFileUpload}
							accept=".pdf"
						/>
						<p className={styles.formatText}>
							Supported Format: .pdf
						</p>
					</div>
				</div>
			)}
		</div>
	);
};

export default ResumeUpload;
