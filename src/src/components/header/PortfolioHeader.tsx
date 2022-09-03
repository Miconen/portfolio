import "./PortfolioHeader.scss";

const PortfolioHeader = () => {
  return (
    <header>
      <div className="container">
        <section className="hero">
          <h1>Mico Rintala</h1>
          <p>
            Programming <span>|</span> Web Development <span>|</span> Coding
          </p>
        </section>
      </div>
      {/* <LanderCard /> */}
      {/* <div class="floatingsvg landercard"></div> */}
      {/* <div class="floatingsvg pointgrid"></div> */}
      <div className="background fade"></div>
      <div className="background blob"></div>
    </header>
  );
};

export default PortfolioHeader;
