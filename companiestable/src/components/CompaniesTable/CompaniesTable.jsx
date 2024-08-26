import React, { useState, useEffect } from 'react';
import CompanySelector from '../CompanySelector/CompanySelector';
import CompanyData from '../CompanyData/CompanyData';

import styles from './CompaniesTable.module.css';

const CompaniesTable = () => {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/data/companies.json')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Соединение с сетью нестабильно');
        }
        return response.json();
      })
      .then((data) => {
        setCompanies(data.companies);
        setSelectedCompany(data.companies[0]);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Ошибка получения данных:', error);
        setError(error.message);
        setIsLoading(false);
      });
  }, []);

  const handleCompanyChange = (event) => {
    const companyName = event.target.value;
    const company = companies.find((c) => c.name === companyName);
    setSelectedCompany(company);
  };

  if (isLoading) {
    return <div>Данные загружаются</div>;
  }

  if (error) {
    return <div>Произошла ошибка: {error} напишите в поддержку</div>;
  }

  return (
    <section className={styles.companies}>
      <CompanySelector
        companies={companies}
        selectedCompany={selectedCompany}
        onCompanyChange={handleCompanyChange}
      />
      {selectedCompany && <CompanyData company={selectedCompany} />}
    </section>
  );
};

export default CompaniesTable;
