import React from "react";

const FeaturesGrid = ({headerRows=[], bodyRows=[], caption, dark=false}) => {
  const GridRows = () => {
    return (
      <>
        {
          bodyRows.map(({id, cells, className}, rowIndex) => (
            <div className={`features-grid__item-card ${dark ? "dark" : "light"}`} key={`item-card-${id}`}>
              <div className={`features-grid__body-row ${className}`}>
                {
                  cells.map(({label, className}, index) => <span key={`header-row-${rowIndex}-cell-${index}`} className={className}>{ label }</span>)
                }
              </div>
            </div>
          ))
        }
      </>
    );
  };

  return (
    <div className="features-grid-container">
      <div className="features-grid">
        {
          headerRows.map(({id, cells, className=""}, rowIndex) => (
            <div key={id} className={`features-grid__header-row ${className}`}>
              {
                cells.map(({label, className}, index) => (
                  <span className={className} key={`grid-header-${rowIndex}-cell-${index}`}>{ label }</span>
                ))
              }
            </div>
          ))
        }
        <GridRows />
      </div>
      <div className="features-grid__caption"> { caption }</div>
    </div>
  );
};

export default FeaturesGrid;
