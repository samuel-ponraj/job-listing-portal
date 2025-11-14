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
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const userData = snap.data();
    return Response.json({ profile: userData.profile || {} });
  } catch (err) {
    console.error("Error fetching profile:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}


export async function POST(req) {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    const userRef = doc(db, "users", userId);

    await updateDoc(userRef, {
      profile: data,
      updatedAt: new Date(),
    });

    return Response.json({ success: true });
  } catch (err) {
    console.error("Error updating profile:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}


