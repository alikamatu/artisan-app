"use client";

import CoreFeatures from "@/_components/homepage/CoreFeatures";
import FAQSection from "@/_components/homepage/FAQSection";
import Footer from "@/_components/homepage/Footer";
import HeroPage from "@/_components/homepage/Hero";
import HowItWorks from "@/_components/homepage/HowItWorks";
import Navbar from "@/_components/homepage/Navbar";
import PricingServices from "@/_components/homepage/PricingServices";
import ProblemStatement from "@/_components/homepage/ProblemStatement";
import Testimonials from "@/_components/homepage/Testimonials";
import TrustVerification from "@/_components/homepage/TrustVerification";
import ValuePropositions from "@/_components/homepage/ValuePropositions";

export default function HomePage() {

  return (
    <div className="flex flex-col w-screen items-center justify-center">
      <Navbar />
      <HeroPage />
      <ValuePropositions />
      <ProblemStatement />
      <HowItWorks />
      <CoreFeatures />
      <TrustVerification />
      <Testimonials />
      <PricingServices />
      <FAQSection />
      <Footer />
    </div>
  )
}
