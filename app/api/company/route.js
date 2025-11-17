import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getAuth } from "@clerk/nextjs/server";

export async function GET(req) {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRef = doc(db, "users", userId);
    const snap = await getDoc(userRef);

    if (!snap.exists()) {
      return Response.json({ company: null });
    }

    const data = snap.data();

    return Response.json({
      company: data.company || null
    });
  } catch (err) {
    console.error("Error fetching company:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}


export async function POST(req) {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { company } = await req.json();
    const userRef = doc(db, "users", userId);

    await updateDoc(userRef, {
      company,
      updatedAt: new Date(),
    });

    return Response.json({ success: true });
  } catch (err) {
    console.error("Error updating profile:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}

   
