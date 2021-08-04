import "./styles.css";
import { useEffect, useState } from "react";

// https://randomuser.me/api?results=20
const fetchData = () => {
  return fetch("https://randomuser.me/api?results=20")
    .then((response) => response.json())
    .catch((err) => console.error(err));
};

const getHeaderData = (location, k = "") => {
  let result = [];
  for (let key of Object.keys(location)) {
    if (typeof location[key] !== "object") {
      k !== "" ? result.push(k + " " + key) : result.push(key);
    } else {
      result = result.concat(getHeaderData(location[key], key));
    }
  }
  return result;
};

const getDataRows = (userLocation) => {
  let result = [];
  for (let value of Object.values(userLocation)) {
    if (typeof value !== "object") {
      result.push(value);
    } else {
      result = result.concat(getDataRows(value));
    }
  }
  return result;
};

export default function App() {
  const [users, setUsers] = useState([]);
  const [flag, setFlag] = useState(Array.from({ length: 10 }, (v, i) => false));
  const [locations, setLocations] = useState([]);
  const [headers, setHeaders] = useState([]);

  const sortByColumn = (idx) => {
    // Ascending Order
    // setLocations((data) => [...data.sort((a, b) => a[idx] - b[idx])]);
    if (!flag[idx]) {
      setLocations((data) => {
        if (typeof data[0][idx] === "number" || !isNaN(Number(data[0][idx]))) {
          return [...data.sort((a, b) => a[idx] - b[idx])];
        } else {
          return [
            ...data.sort((a, b) => {
              if (a[idx] < b[idx]) {
                return -1;
              }
              if (a[idx] > b[idx]) {
                return 1;
              }
              // a must be equal to b
              return 0;
            })
          ];
        }
      });
    } else {
      setLocations((data) => {
        if (typeof data[0][idx] === "number" || !isNaN(Number(data[0][idx]))) {
          return [...data.sort((a, b) => b[idx] - a[idx])];
        } else {
          return [
            ...data.sort((a, b) => {
              if (b[idx] < a[idx]) {
                return -1;
              }
              if (b[idx] > a[idx]) {
                return 1;
              }
              // a must be equal to b
              return 0;
            })
          ];
        }
      });
    }
    setFlag((flags) => flags.map((f, id) => (id === idx ? !f : f)));
    console.log(idx);
  };

  useEffect(() => {
    fetchData().then((data) => {
      const location = data.results[0].location;
      setUsers(data.results.name);
      setLocations(data.results.map((user, idx) => getDataRows(user.location)));
      setHeaders(getHeaderData(location));
    });
  }, []);
  return (
    <div className="App">
      <h1>Super Users and Their Location with FETCH</h1>
      <table className="App-table">
        <thead>
          <tr>
            {headers.map((header, idx) => (
              <th
                className="App-table-head"
                key={idx}
                onClick={() => sortByColumn(idx)}
              >
                {header.split(" ").length > 1
                  ? header
                      .split(" ")
                      .map(
                        (word) =>
                          word[0].toUpperCase() + word.slice(1, word.length)
                      )
                      .join(" ")
                  : header[0].toUpperCase() + header.slice(1, header.length)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {locations.map((loc, idx) => (
            <tr className="App-row" key={idx}>
              {loc.map((data, idx) => (
                <td className="App-row-data" key={idx}>
                  {data}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {/* <div style={{ margin: "0 auto", width: "50vw" }}>
        {JSON.stringify(locations, null, 2)}
      </div> */}
    </div>
  );
}
