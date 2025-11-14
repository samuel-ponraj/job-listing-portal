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
  useUser,
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

  const isHome = pathname === "/" || pathname === "/employer";

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
        console.log("User profile stored in Firestore");
      } else {
        console.log("User already exists in Firestore");
      }
    };

    saveUserToFirestore();
  }, [isSignedIn, user]);

    const homeLink = pathname.startsWith("/employer") ? "/employer" : "/";
    const profilePath = pathname.startsWith("/employer") ? "/employer/profile" : "/profile";
    const headerLink = pathname.startsWith("/employer") ? "Find Jobs" : "Post Jobs";
    const logoLink = pathname.startsWith("/employer") ? "Employer Portal" : "Job Listing Portal";

  return (
    <div
      className={`${styles.headerContainer} ${
        isHome
          ? scrolled
            ? styles.solidHeavy
            : styles.solidLight
          : styles.solidHeavy
      }`}
    >
      <div className={styles.headerSection}>
        <div className={styles.jobListingLogo}>
          <Link href={employerPortal ? "/employer" : "/"}>
            {logoLink}
          </Link>
        </div>
        <div className={styles.headerButtons}>
          <ul>
            <Link href={homeLink}>
              <li>Home</li>
            </Link>
            
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
                      labelIcon={<ImProfile />}
                      href={profilePath}
                    />
                  </UserButton.MenuItems>
                </UserButton>
              </li>
            </SignedIn>

            {headerLink === "Find Jobs" ? (
              <li className={styles.roleSwitchBtn}>
                <Link href="/">{headerLink}</Link>
              </li>
            ):(
              <li className={styles.roleSwitchBtn}>
                <Link href="/employer">{headerLink}</Link>
              </li>
            )}

          </ul>
        </div>
      </div>
    </div>
  );
};

export default Header;
