import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import "./department.css"; // Import the CSS file

const departments = [
  "ADMINISTRATION",
  "PUBLIC SERVICE",
  "SPECIAL PROGRAMS",
  "FINANCE",
  "ECONOMIC PLANNING",
  "ICT",
  "AGRICULTURE",
  "LIVESTOCK",
  "FISHERIES",
  "COOPERATIVES",
  "WATER",
  "SANITATION",
  "ENVIRONMENT",
  "NATURAL RESOURCES",
  "CLIMATE CHANGE",
  "MEDICAL SERVICES",
  "EDUCATION",
  "YOUTH",
  "SPORTS",
  "VOCATIONAL TRAINING",
  "LANDS",
  "HOUSING",
  "URBAN PLANNING",
  "ROADS",
  "PUBLIC WORKS",
  "TRANSPORT",
  "TRADE",
  "ENERGY",
  "TOURISM",
  "INVESTMENT",
  "INDUSTRY",
  "GENDER",
  "CULTURE",
  "SOCIAL SERVICES",
  "BOMET MUNICIPALITY",
];

export default function DepartmentListPage() {
  const navigate = useNavigate();

  return (
    <div>
      <Helmet>
        <title>Departments</title>
      </Helmet>
      <h1 style={{ textAlign: "center", textDecoration: "underline" }}>
        Departments
      </h1>
      <ul className='department-list'>
        {departments.map((department) => (
          <li key={department}>
            <Button
              type='button'
              variant='success'
              onClick={() => navigate(`/admin/users/department/${department}`)}
            >
              {department}
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
