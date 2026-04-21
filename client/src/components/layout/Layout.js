import Header from "./Header";
import Footer from "./Footer";
import { Helmet } from "react-helmet";

const Layout = ({ children, title, description, keywords, author }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-200">
      {/* SEO */}
      <Helmet>
        <meta charSet="utf-8" />
        <meta
          name="description"
          content={description || "MERN Ecommerce App"}
        />
        <meta name="keywords" content={keywords} />
        <meta name="author" content={author} />
        <title>{title}</title>
      </Helmet>

      {/* Header */}
      <Header />

      {/* Main */}
      <main className="flex-grow">{children}</main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

Layout.defaultProps = {
  title: "Ecommerce App - Shop Now",
  description: "MERN Stack Ecommerce Project",
  keywords: "MERN, React, Node, MongoDB, Ecommerce",
  author: "Prema Sagar",
};

export default Layout;
