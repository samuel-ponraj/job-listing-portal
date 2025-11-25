import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, query, orderBy, updateDoc, doc, getDoc, where  } from "firebase/firestore";
import { getAuth } from "@clerk/nextjs/server";

export async function POST(req) {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();

    const jobsRef = collection(db, "jobs");

    await addDoc(jobsRef, {
      ...data,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return Response.json({ success: true });
  } catch (err) {
    console.error("Error creating job:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}


export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const jobId = searchParams.get("id");

    // ✅ 1. If jobId is present → return only that job
    if (jobId) {
      const jobRef = doc(db, "jobs", jobId);
      const jobSnap = await getDoc(jobRef);

      if (!jobSnap.exists()) {
        return Response.json({ error: "Job not found" }, { status: 404 });
      }

      const jobData = jobSnap.data();

      // Fetch full company details
      let companyDetails = {};
      if (jobData.userId) {
        const userRef = doc(db, "users", jobData.userId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          companyDetails = userSnap.data()?.company || {};
        }
      }

      return Response.json({
        job: {
          id: jobSnap.id,
          ...jobData,
          company: companyDetails, // full company details
        },
      });
    }

    // ------------------------------------------------------
    // ❗ 2. If NO jobId → fetch all approved jobs
    // ------------------------------------------------------
    const q = query(collection(db, "jobs"), where("approved", "==", true));
    const jobSnapshot = await getDocs(q);

    const jobs = jobSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const userCache = {};

    const jobsWithCompany = await Promise.all(
      jobs.map(async (job) => {
        const userId = job.userId;

        if (!userId) return { ...job, company: {} };

        if (!userCache[userId]) {
          const userRef = doc(db, "users", userId);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            userCache[userId] = userSnap.data()?.company || {};
          } else {
            userCache[userId] = {};
          }
        }

        return {
          ...job,
          company: userCache[userId], // full company details
        };
      })
    );

    return Response.json({ jobs: jobsWithCompany });
  } catch (err) {
    console.error("Error fetching jobs:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}




export async function PUT(req) {
  try {
    const { searchParams } = new URL(req.url);
    const jobId = searchParams.get("id");

    if (!jobId)
      return new Response(JSON.stringify({ error: "Job ID missing" }), {
        status: 400,
      });

    const data = await req.json();

    await updateDoc(doc(db, "jobs", jobId), data);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
}