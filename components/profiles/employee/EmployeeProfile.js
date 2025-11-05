import styles from './EmployeeProfile.module.css'
import { CgProfile } from "react-icons/cg";
import { IoLocationOutline } from "react-icons/io5";

const EmployeeProfile = () => {
  return (
    <div style={{paddingTop:'70px'}} className={styles.container}>
        <section className={styles.header}>
            <div>
                <CgProfile />
            </div>
            <div>
                <div>
                    <h1>Samuel Ponraj</h1>
                    <p>Profile last updated: 5 Nov 2025</p>
                </div>
                <div>
                    <div>
                        <p><IoLocationOutline /> Chennai, INDIA</p>
                    </div>
                </div>
            </div>
        </section>
    </div>
  )
}

export default EmployeeProfile