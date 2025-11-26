'use client'
import styles from './Home.module.css'
import FeaturedJobs from '@/components/jobs/featuredjobs/FeaturedJobs'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const Home = () => {

  const router = useRouter()
  const [query, setQuery] = useState("")

  const handleSearch = () => {
    if (!query.trim()) return;

    router.push(`/jobs?search=${encodeURIComponent(query)}`)
  }

  return (
    <main className={styles.container}>
        <section className={styles.homePageBanner}>
            <div className={styles.homePageBannerContent}>
                <h1>Find Your Perfect Job Match</h1>
                <p>Find Jobs, Employment & Career Opportunities</p>
                <div className={styles.searchBox}>
                    <input 
                      type="text" 
                      placeholder="Search jobs..."
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                    />
                    <button onClick={handleSearch}>Search</button>
                </div>
            </div>
            <div>
              {/* <img src="/man.png" alt="man" /> */}
            </div>
        </section>

        <section className={styles.featuredJobsSection}>
          <FeaturedJobs />
        </section>
    </main>
  )
}

export default Home