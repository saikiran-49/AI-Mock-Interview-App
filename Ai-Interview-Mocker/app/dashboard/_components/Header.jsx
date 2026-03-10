"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";

function Header({ children }) {
  const path = usePathname();

  useEffect(() => {
    console.log(path); // Log the current path for debugging
  }, []);

  // Function to determine if the current path matches a specific route
  const isActive = (route) => path === route ? 'text-primary font-bold' : '';

  return (
    <div className="hidden md:flex p-4 items-center justify-between bg-secondary shadow-md">
      <Image src='/logo.svg' width={160} height={100} alt='logo' />
      <ul className="flex gap-6">
        <li className={`hover:text-primary hover:font-bold transition-all cursor-pointer ${isActive('/dashboard')}`}>
          Dashboard
        </li>
        <li className={`hover:text-primary hover:font-bold transition-all cursor-pointer ${isActive('/dashboard/questions')}`}>
          Question
        </li>
        <li className={`hover:text-primary hover:font-bold transition-all cursor-pointer ${isActive('/dashboard/upgrades')}`}>
          Upgrades
        </li>
        <li className={`hover:text-primary hover:font-bold transition-all cursor-pointer ${isActive('/dashboard/how')}`}>
          How it works
        </li>
      </ul>
      <UserButton />
    </div>
  );
}

export default Header;
