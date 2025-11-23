"use client";
import { useEffect, useState } from "react";

interface Data {
  message: string;
}

export default function Home() {
  const [data, setData] = useState<Data>({ message: "" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8080/");
        const data: Data = await response.json();
        console.log(data);
        setData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <h1>Hello World</h1>
      <p>{data?.message}</p>
    </div>
  );
}
