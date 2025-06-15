import React from "react";
import { Link } from "react-router-dom";

const NavLinks = ({ user }) => {
  const baseLinks = [{ path: "/", text: "Главная" }];

  const roleBasedLinks = {
    student: [
      { path: "/schedule", text: "Расписание" },
      { path: "/grades", text: "Оценки" },
    ],
    professor: [{ path: "/students", text: "Студенты" }],
    admin: [{ path: "/admin", text: "Админ-панель" }],
  };

  const links = [
    ...baseLinks,
    ...(user ? roleBasedLinks[user.role] || [] : []),
  ];

  return (
    <>
      {links.map((link) => (
        <Link key={link.path} to={link.path}>
          {link.text}
        </Link>
      ))}
    </>
  );
};

export default NavLinks;
