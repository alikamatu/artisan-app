import ContactForm from "@/_components/homepage/_contact/ContactForm";
import ContactPageHero from "@/_components/homepage/_contact/ContactHero";
import ContactMap from "@/_components/homepage/_contact/ContactMap";
import ContactPage from "@/_components/homepage/_contact/ContactPage";
import FAQSection from "@/_components/homepage/FAQSection";
import Footer from "@/_components/homepage/Footer";
import Navbar from "@/_components/homepage/Navbar";
import Testimonials from "@/_components/homepage/Testimonials";

export default function CantactUs() {

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <Navbar />
            <ContactPageHero />
            <Testimonials />
            <ContactPage />
            <ContactForm />
            <ContactMap />
            <FAQSection />
            <Footer />
        </div>
    )
}