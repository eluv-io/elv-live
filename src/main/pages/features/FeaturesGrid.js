import React from "react";

const GridRows = ({bodyRows=[], dark=false}) => {
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

const FeaturesGrid = ({headerRows=[], bodyRows=[], caption, dark=false, className}) => {

  return (
    <div className={`features-grid-container ${className || ""}`}>
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
        <GridRows bodyRows={bodyRows} dark={dark} />
      </div>
      <div className="features-grid__caption"> { caption }</div>
    </div>
  );
};

export default FeaturesGrid;
