"use client"
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [count, setCount] = useState(0);

  return (
    <div onClick={() => setCount(count + 1)} className="flex items-center justify-center h-screen text-6xl cursor-pointer select-none">
      {count}
    </ div>
  );
}
