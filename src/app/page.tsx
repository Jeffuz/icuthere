import Navbar from "./component/Navbar";
import Hero from "./component/Hero";
import Demo from "./component/Demo";
import Footer from "./component/Footer";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-black">
      <div className="fixed inset-0 z-1 w-screen h-screen [background:radial-gradient(125%_125%_at_50%_10%,#000_40%,#63e_100%)]"></div>
      <Navbar />
      <main className="py-48">
        <Hero />
      </main>
      <section className="pb-48">
        <Demo />
      </section>
      <footer className="relative z-20 w-full bg-[#0B0219] py-10 px-6">
        <Footer />
      </footer>
    </div>
  );
}
