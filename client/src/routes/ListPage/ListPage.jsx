import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { BACK_END_URL } from "../../constants/api";
import CenteredContent from "../../components/CenteredContent/CenteredContent";
import ListingItem from "../../components/ListingItem/ListingItem";
import styles from "./listPage.module.css";
import Pagination from "../../components/Pagination/Pagination";
import SearchBar from "../../components/SearchBar/SearchBar";

function ListPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [values, setValues] = useState({
    listings: [],
    page: parseInt(searchParams.get("page")) || 1,
    limit: 20,
    totalCount: 0,
  });

  const setPage = (pageNumber) => {
    setSearchParams({
      ...Object.fromEntries(searchParams.entries()),
      page: pageNumber,
    });

    setValues({ ...values, page: pageNumber });
  };

  useEffect(() => {
    const fetchListings = async () => {
      const response = await fetch(
        `${BACK_END_URL}/api/v1/listings/search?${searchParams.toString()}&limit=${
          values.limit
        }`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch listings");
      }

      const data = await response.json();
      setValues({
        ...values,
        listings: data.listings,
        totalCount: data.totalCount,
      });
    };

    fetchListings();
  }, [searchParams, values.limit]);

  return (
    <>
      <div className={styles.searchBarWrapper}>
        <SearchBar setPage={setPage} />
      </div>
      <CenteredContent>
        <h3>Ogłoszenia:</h3>
        <div className={styles.listings}>
          {values.listings.map((listing) => (
            <ListingItem key={listing._id} listing={listing} />
          ))}
        </div>
        <Pagination
          page={values.page}
          totalPages={Math.ceil(values.totalCount / values.limit)}
          onPageChange={setPage}
        />
      </CenteredContent>
    </>
  );
}

export default ListPage;
