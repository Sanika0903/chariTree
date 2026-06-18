import React from "react";
import PublicNavbar from "./PublicNavbar";

export default function PublicLayout({ children }) {
  return (
    <>
      <PublicNavbar />
      {children}
    </>
  );
}
