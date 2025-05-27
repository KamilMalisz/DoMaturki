// /src/admin/routes/AdminUserList/AdminUserList.js

import { useSearchParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import styles from "../../../styles/formStyles.module.css";
import CenteredContent from "../../../components/CenteredContent/CenteredContent";
import Pagination from "../../../components/Pagination/Pagination";
import { BACK_END_URL } from "../../../constants/api";
import DataTable from "../../../components/DataTable/DataTable";
import ContentBox from "../../../components/ContentBox/ContentBox";

function AdminUsersList() {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
  });

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    username: searchParams.get("username") || "",
    email: searchParams.get("email") || "",
    page: parseInt(searchParams.get("page")) || 1,
  });

  const fetchUsers = async () => {
    try {
      const query = new URLSearchParams(filters).toString();
      const response = await fetch(
        `${BACK_END_URL}/api/v1/users/all?${query}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();

      setUsers(data.users);
      setPagination({
        currentPage: data.currentPage,
        totalPages: data.totalPages,
      });
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({
      ...prev,
      page: newPage,
    }));
    setSearchParams({ ...filters, page: newPage });
    navigate(
      `/admin/users?${new URLSearchParams({
        ...filters,
        page: newPage,
      }).toString()}`
    );
  };

  // Definicja kolumn dla DataTable
  const columns = [
    { header: "ID", field: "id", isLink: true },
    { header: "Nazwa użytkownika", field: "username" },
    { header: "Email", field: "email" },
    { header: "Rola", field: "role" },
  ];

  // Dane do DataTable
  const data = users.map((user) => ({
    id: { text: user._id, link: `/profile/${user._id}` },
    username: user.username,
    email: user.email,
    role: user.role,
  }));

  return (
    <CenteredContent>
      <ContentBox title="Lista Użytkowników">
        <div className={styles.formContainer}>
          <div className={styles.formGroup}>
            <label htmlFor="username">Nazwa użytkownika:</label>
            <div>
              <input
                type="text"
                name="username"
                id="username"
                value={filters.username}
                onChange={handleFilterChange}
                className={styles.inputField}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email">Email:</label>
            <div>
              <input
                type="text"
                name="email"
                id="email"
                value={filters.email}
                onChange={handleFilterChange}
                className={styles.inputField}
              />
            </div>
          </div>
        </div>

        <DataTable columns={columns} data={data} />

        <Pagination
          page={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
        />
      </ContentBox>
    </CenteredContent>
  );
}

export default AdminUsersList;
