"use client";
import { useState, useEffect } from "react";
import styles from "./Header.module.css";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { 
  SignedIn, 
  SignedOut, 
  SignInButton, 
  UserButton,
  useUser
} from "@clerk/nextjs";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { ImProfile } from "react-icons/im";


const Header = () => {
  const { user, isSignedIn } = useUser();
  const [employerPortal, setEmployerPortal] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setEmployerPortal(pathname === "/employer");
  }, [pathname]);

  useEffect(() => {
    const saveUserToFirestore = async () => {
      if (!isSignedIn || !user) return;

      const userRef = doc(db, "users", user.id);
      const existing = await getDoc(userRef);

      if (!existing.exists()) {
        await setDoc(userRef, {
          userId: user.id,
          email: user.primaryEmailAddress?.emailAddress || "",
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          createdAt: new Date(),
        });
        console.log("✅ User profile stored in Firestore");
      } else {
        console.log("ℹ️ User already exists in Firestore");
      }
    };

    saveUserToFirestore();
  }, [isSignedIn, user]);

 

  return (
    <div className={styles.headerContainer}>
      <div className={styles.jobListingLogo}>
        {employerPortal ? "Employer Portal" : "Job Listing Portal"}
      </div>

      <div className={styles.headerButtons}>
        <ul>
          <SignedOut>
            <li className={styles.signInBtn} style={{ cursor: "pointer" }}>
              <SignInButton mode="modal">
                <span>Sign In</span>
              </SignInButton>
            </li>
          </SignedOut>

          <SignedIn>
            <li className={styles.userAvatar}>
              <UserButton afterSignOutUrl="/">
                 <UserButton.MenuItems>
                  <UserButton.Link
                    label="Manage profile"
                    labelIcon={<ImProfile  />}
                    href="/manage-profile"
                  />
        </UserButton.MenuItems>
              </UserButton>
            </li>
          </SignedIn>

          {!employerPortal ? (
            <li className={styles.roleSwitchBtn}>
              <Link href="/employer">Post Jobs</Link>
            </li>
          ) : (
            <li className={styles.roleSwitchBtn}>
              <Link href="/">Find Jobs</Link>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Header;
