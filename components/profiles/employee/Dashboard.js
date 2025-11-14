import styles from './Dashboard.module.css'
import { PiSuitcaseSimple } from "react-icons/pi";
import { IoEyeOutline } from "react-icons/io5";
import { FaRegEnvelopeOpen } from "react-icons/fa6";

const Dashboard = () => {
  return (
    <section className={styles.container}>
      <div className={styles.statisticsCards}>
        <div className={styles.card}>
          <div>
            <PiSuitcaseSimple />
          </div>
          <div>
            <p>2</p>
            <h3>Applied Jobs</h3>
          </div>
        </div>

        <div className={styles.card}>
          <div>
            <FaRegEnvelopeOpen />
          </div>
          <div>
            <p>4</p>
            <h3>Job Invites</h3>
          </div>
        </div>

        <div className={styles.card}>
          <div>
            <IoEyeOutline />
          </div>
          <div>
            <p>13</p>
            <h3>Views</h3>
          </div>
        </div>
        
      </div>
    </section>
  );
};

export default Dashboard;
