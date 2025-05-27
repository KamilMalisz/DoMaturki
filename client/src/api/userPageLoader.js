import { BACK_END_URL } from "../constants/api";

export function userPageLoader({ params: { id } }) {
  return fetch(`${BACK_END_URL}/api/v1/users/${id}`);
}
