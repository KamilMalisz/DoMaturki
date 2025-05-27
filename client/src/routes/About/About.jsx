import Accordion from "../../components/Accordion/Accordion";
import CenteredContent from "../../components/CenteredContent/CenteredContent";
import ContentBox from "../../components/ContentBox/ContentBox";
import { BACK_END_URL } from "../../constants/api";
import styles from "./about.module.css";
import { FaHome, FaCity, FaUsers } from "react-icons/fa";

function About() {
  const heroImgUrl = `${BACK_END_URL}/img/naszdom/hero/hero12.jpg`;

  return (
    <>
      <div
        className={styles.aboutHero}
        style={{ backgroundImage: `url(${heroImgUrl})` }}
      >
        <h1>DoMaturki</h1>
        <p>Portal dla Maturzystów</p>
      </div>
      <CenteredContent>
        <ContentBox title="O naszym serwisie">
          <p>
     
          </p>
        </ContentBox>

        <ContentBox title="Nasze statystyki">
          <div className={styles.statsContainer}>
            <div className={styles.stat}>
              <FaHome size={40} />
              <h3>1000+</h3>
              <p>Aktualnych nieruchomości</p>
            </div>
            <div className={styles.stat}>
              <FaCity size={40} />
              <h3>100+</h3>
              <p>Popularnych miast</p>
            </div>
            <div className={styles.stat}>
              <FaUsers size={40} />
              <h3>5000+</h3>
              <p>Zadowolonych użytkowników</p>
            </div>
          </div>
        </ContentBox>

        <ContentBox title="Często zadawane pytania">
          <Accordion
            items={[
              {
                title: "Jak zarejestrować się na stronie?",
                content: "Lorem ipsum...",
              },
              {
                title: "Jak dodać nieruchomość do oferty?",
                content: "Lorem ipsum...",
              },
              {
                title: "Czy mogę edytować ofertę?",
                content: "Lorem ipsum...",
              },
            ]}
          />
        </ContentBox>
      </CenteredContent>
    </>
  );
}

export default About;
