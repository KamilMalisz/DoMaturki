// src/components/DataTable/DataTable.jsx

import { NavLink } from "react-router-dom";
import styles from "./dataTable.module.css"; // Import wspólnych stylów

const DataTable = ({ columns, data, labelValueMode = false }) => {
  if (labelValueMode) {
    // Tryb etykieta-wartość, np. dla ListingPage
    return (
      <table className={styles.dataTable}>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              <td>{row.label}</td>
              <td>{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  // Klasyczny tryb tabeli z kolumnami
  return (
    <table className={styles.dataTable}>
      <thead>
        <tr>
          {columns.map((col, index) => (
            <th key={index}>{col.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {columns.map((col, colIndex) => {
              const cellData = row[col.field];

              // Obsługa linków (gdy cellData jest obiektem typu { text, link })
              if (col.isLink && cellData) {
                return (
                  <td key={colIndex}>
                    <NavLink to={cellData.link}>{cellData.text}</NavLink>
                  </td>
                );
              }

              // Obsługa pogrubienia (col.bold === true)
              if (col.bold) {
                return (
                  <td key={colIndex}>
                    <strong>{cellData}</strong>
                  </td>
                );
              }

              // Zwykła komórka z danymi
              return <td key={colIndex}>{cellData}</td>;
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DataTable;
