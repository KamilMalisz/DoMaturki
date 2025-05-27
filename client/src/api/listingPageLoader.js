import { BACK_END_URL } from "../constants/api";

export function listingPageLoader({ params: { id } }) {
  return fetch(`${BACK_END_URL}/api/v1/listings/${id}`);
}
