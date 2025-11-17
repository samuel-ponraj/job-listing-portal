import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, query, orderBy, updateDoc, doc } from "firebase/firestore";
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

export async function GET() {
  try {
    const jobsRef = collection(db, "jobs");
    const q = query(jobsRef, orderBy("createdAt", "desc"));
    const snap = await getDocs(q);

    const jobs = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return Response.json({ jobs });
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