import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getAuth } from "@clerk/nextjs/server";


export async function GET(req) {
  try {
    const { userId } = getAuth(req);
    if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const userRef = doc(db, "users", userId);
    const snap = await getDoc(userRef);

    return Response.json({ resume: snap.data().resume || null });
  } catch (err) {
    console.error(err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}


export async function POST(req) {
  try {
    const { userId } = getAuth(req);
    if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const data = await req.json();
    await updateDoc(doc(db, "users", userId), {
      resume: data,
      updatedAt: new Date(),
    });

    return Response.json({ success: true });
  } catch (err) {
    console.error(err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
