import CenteredContent from "../../components/CenteredContent/CenteredContent";
import ContentBox from "../../components/ContentBox/ContentBox";
import Faq from "../../components/FAQ/FAQ";
import { Hero } from "../../components/Hero/Hero";
import LatestListings from "../../components/LatestListings/LatestListings";
import PopularCities from "../../components/PopularCities/PopularCities";

function Home() {
  return (
    <> 
      <Hero />
      <CenteredContent>
        <ContentBox title= "">
          <LatestListings type="sprzedaż" />
        </ContentBox>

        <ContentBox title= "">
          <LatestListings type="wynajem" />
        </ContentBox>

        <ContentBox title="Popularne miasta:">
          <PopularCities />
        </ContentBox>
        <ContentBox>
          <Faq />
        </ContentBox>
      </CenteredContent>  
    </>
  );
}

export default Home;
