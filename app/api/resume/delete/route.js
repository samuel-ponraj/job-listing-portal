import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { getAuth } from "@clerk/nextjs/server";

export async function DELETE(req) {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRef = doc(db, "users", userId);

    await updateDoc(userRef, {
      resume: null,
      updatedAt: new Date(),
    });

    return Response.json({ success: true });
  } catch (err) {
    console.error("Error deleting resume:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
