import Header from "./_components/layout/Header";
import Footer from "./_components/layout/Footer";
export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
