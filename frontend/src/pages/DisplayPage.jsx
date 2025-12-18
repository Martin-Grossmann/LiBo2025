import styles from "./DisplayPage.module.css";
import PictureDisplay from "../components/PictureDisplay/PictureDisplay";

const DisplayPage = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Display Page</h1>
      <div className={styles.content}>
        <p>This is the Display Page content.</p>
        <PictureDisplay pictureId={"1"} />
      </div>
    </div>
  );
};

export default DisplayPage;
