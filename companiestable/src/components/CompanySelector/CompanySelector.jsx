import React from 'react';

import styles from './CompanySelector.module.css';

const CompanySelector = ({ companies, selectedCompany, onCompanyChange }) => {
  return (
    <select
      className={styles.selectCompany}
      onChange={onCompanyChange}
      value={selectedCompany.name}
    >
      {companies.map((company) => (
        <option key={company.name} value={company.name}>
          {company.name}
        </option>
      ))}
    </select>
  );
};

export default CompanySelector;
