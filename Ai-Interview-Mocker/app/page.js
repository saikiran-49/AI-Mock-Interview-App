import Image from "next/image";
import { Button } from "@/components/ui/button";
// Adjusted the import path for Header
import Header from './dashboard/_components/Header'; 

// Default export for Home component
export default function Home() {
  return (
    <div>
      <h1>Home Page</h1>
      <Button>Subscribe</Button>
    </div>
  );
}

// Named export for the other component
export function AnotherComponent() {
  return <h1>Another Page</h1>;
}
