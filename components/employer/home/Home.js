import styles from './Home.module.css'


const Home = () => {
  return (
    <main className={styles.container}>
        <section className={styles.homePageBanner}>
            <div className={styles.homePageBannerContent}>
                <h1>Find Your Perfect Employees</h1>
                {/* <p>Find Jobs, Employment & Career Opportunities</p> */}
                {/* <div className={styles.searchBox}>
                    <input type="text" placeholder="Search jobs..." />
                    <button>Search</button>
                </div> */}
            </div>
        </section>
    </main>
  )
}

export default Home