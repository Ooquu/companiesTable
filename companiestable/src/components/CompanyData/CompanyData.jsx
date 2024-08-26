import React, { useState, useEffect } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import styles from './CompanyData.module.css';

const CompanyData = ({ company }) => {
  const [expandedRow, setExpandedRow] = useState(null);
  const [weeklyPlans, setWeeklyPlans] = useState({});

  useEffect(() => {
    fetch('/data/weeklyPlans.json')
      .then((response) => response.json())
      .then((data) => {
        console.log('Планы загружены', data);
        setWeeklyPlans(data);
      })
      .catch((error) => console.error('Ошибка в загрузке планов', error));
  }, []);

  const formatNumber = (number) => {
    return new Intl.NumberFormat('ru-RU').format(number);
  };

  const calculatePercentChange = (current, previous) => {
    if (previous === 0) return 'N/A';
    const percentChange = ((current - previous) / previous) * 100;
    return percentChange;
  };

  const formatPercentChange = (percentChange) => {
    if (percentChange === 'N/A') return percentChange;
    const absPercentChange = Math.abs(percentChange);
    if (absPercentChange >= 10) {
      return `${Math.round(percentChange)}%`;
    } else {
      return `${Math.round(percentChange)}%`;
    }
  };

  const getChartOptions = (label, dataKey) => {
    const weekData = company.data[0][dataKey].week;
    return {
      title: {
        text: `График за неделю: ${label}`,
      },
      xAxis: {
        categories: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
      },
      yAxis: {
        title: {
          text: '',
        },
        gridLineWidth: 0,
      },
      series: [
        {
          name: label,
          data: weekData,
          color: '#369774',
        },
      ],
    };
  };

  const renderRow = (label, dataKey) => {
    const currentData = company.data[0][dataKey];
    const current = currentData.current;
    const yesterday = formatNumber(currentData.yesterday);
    const lastWeek = formatNumber(currentData.lastWeek);
    const changePercent = calculatePercentChange(
      current,
      currentData.yesterday
    );
    const formattedChangePercent = formatPercentChange(changePercent);
    const profitValue = parseFloat(changePercent);
    const isPositiveProfit = profitValue > 0;
    const isNegativeProfit = profitValue < 0;
    const isProfitOrZero = profitValue >= 0;

    let lastWeekClass = '';
    if (weeklyPlans[dataKey] !== undefined) {
      const weeklyPlan = weeklyPlans[dataKey];
      if (current > weeklyPlan) {
        lastWeekClass = styles.profit;
      } else if (current < weeklyPlan) {
        lastWeekClass = styles.loss;
      }
    }

    const isExpanded = expandedRow === dataKey;

    return (
      <React.Fragment key={dataKey}>
        <tr
          className={styles.tableBodyRow}
          onClick={() => setExpandedRow(isExpanded ? null : dataKey)}
        >
          <td className={styles.tableBodyRowData}>{label}</td>
          <td className={`${styles.tableBodyRowData} ${styles.currentDay}`}>
            {formatNumber(current)}
          </td>
          <td
            className={`${styles.tableBodyRowData} ${
              styles.tableBodyRowDataContainer
            } ${
              isPositiveProfit
                ? styles.profit
                : isNegativeProfit
                ? styles.loss
                : ''
            }`}
          >
            <div className={styles.tableBodyRowDataWrapper}>
              <span className={styles.tableBodyRowDataValue}>{yesterday}</span>
              <span
                className={`${styles.tableBodyRowDataProfit} ${
                  isProfitOrZero ? styles.percentProfit : styles.percentLoss
                }`}
              >
                {changePercent !== 'N/A'
                  ? formattedChangePercent
                  : changePercent}
              </span>
            </div>
          </td>
          <td className={`${styles.tableBodyRowData} ${lastWeekClass}`}>
            {lastWeek}
          </td>
        </tr>
        {isExpanded && (
          <tr>
            <td colSpan="4" className={styles.chartContainer}>
              <HighchartsReact
                highcharts={Highcharts}
                options={getChartOptions(label, dataKey)}
              />
            </td>
          </tr>
        )}
      </React.Fragment>
    );
  };

  if (!company) {
    return <div>Выберите компанию</div>;
  }

  return (
    <table className={styles.table}>
      <thead className={styles.tableHeader}>
        <tr className={styles.tableHeaderRow}>
          <th className={styles.tableHeaderRowHead}>Показатель</th>
          <th className={`${styles.tableHeaderRowHead} ${styles.currentDay}`}>
            Текущий день
          </th>
          <th className={styles.tableHeaderRowHead}>Вчера</th>
          <th className={styles.tableHeaderRowHead}>Этот день недели</th>
        </tr>
      </thead>
      <tbody className={styles.tableBody}>
        {renderRow('Выручка, руб.', 'revenue')}
        {renderRow('Наличные', 'cash')}
        {renderRow('Безналичный расчет', 'card')}
        {renderRow('Кредитные карты', 'creditCard')}
        {renderRow('Средний чек, руб.', 'averageCheck')}
        {renderRow('Средний гость, руб.', 'averageGuest')}
        {renderRow(
          'Удаление из чека (после оплаты, руб)',
          'deletionAfterPayment'
        )}
        {renderRow(
          'Удаление из чека (до оплаты), руб.',
          'deletionBeforePayment'
        )}
        {renderRow('Количество чеков', 'checkCount')}
        {renderRow('Количество гостей', 'guestCount')}
      </tbody>
    </table>
  );
};

export default React.memo(CompanyData);
