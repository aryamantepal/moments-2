"use client"
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [count, setCount] = useState(0);

  return (
    <div>
      {count}
    </ div>
  );
}
