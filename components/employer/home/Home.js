import Link from 'next/link'
import styles from './Home.module.css'


const Home = () => {
  return (
    <main className={styles.container}>
        <section className={styles.homePageBanner}>
            <div className={styles.homePageBannerContent}>
                <h1>Find Your Perfect Employees</h1>
                <p>No matter the skills, experience or qualifications you&apos;re looking for, you&apos;ll find the right people here.</p>
                <Link href='/employer/profile'>
                  <button className={styles.postJobBtn}>
                      Post a Job
                  </button>
                </Link>
            </div>
        </section>
    </main>
  )
}

export default Home