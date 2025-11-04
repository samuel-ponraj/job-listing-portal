"use client"
import { useState, useEffect } from 'react'
import styles from './Header.module.css'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { 
  SignedIn, 
  SignedOut, 
  SignInButton, 
  SignOutButton, 
  UserButton 
} from "@clerk/nextjs"

const Header = () => {
  const [employerPortal, setEmployerPortal] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setEmployerPortal(pathname === "/employer")
  }, [pathname])

  return (
    <div className={styles.headerContainer}>
      <div className={styles.jobListingLogo}>
        {employerPortal ? "Employer Portal" : "Job Listing Portal"}
      </div>

      <div className={styles.headerButtons}>
        <ul>
          <SignedOut>
            <li className={styles.signInBtn} style={{cursor: 'pointer'}}>
              <SignInButton mode="modal">
                <span>Sign In</span>
              </SignInButton>
            </li>
          </SignedOut>

          <SignedIn>
            <li>
              <UserButton afterSignOutUrl="/" />
            </li>
          </SignedIn>

          {!employerPortal ? (
            <li className={styles.roleSwitchBtn}><Link href="/employer">Post Jobs</Link></li>
          ) : (
            <li className={styles.roleSwitchBtn}><Link href="/">Find Jobs</Link></li>
          )}
        </ul>
      </div>
    </div>
  )
}

export default Header
