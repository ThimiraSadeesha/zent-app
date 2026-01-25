
import styles from "./page.module.css";
import { BackgroundBeams } from "./components/login";

export default function Home() {
  return (
    <div className={styles.page}>
        <BackgroundBeams/>
    </div>
  );
}
