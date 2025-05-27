import { BACK_END_URL } from "../constants/api";

export async function cityByNameLoader({ params: { name } }) {
  const response = await fetch(
    `${BACK_END_URL}/api/v1/cities/searchByName/${name}`
  );

  if (!response.ok) {
    throw new Response("Not Found", { status: 404 });
  }

  const data = await response.json();
  return data;
}
