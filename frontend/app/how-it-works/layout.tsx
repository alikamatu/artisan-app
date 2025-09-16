import React from 'react';
import Navbar from "@/_components/homepage/Navbar";
import Footer from "@/_components/homepage/Footer";

export default function HowItWorksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col w-screen items-center justify-center">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
