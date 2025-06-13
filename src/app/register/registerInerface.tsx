import React from "react";

const RegisterInterface: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <section className={className}>
      <div className="rightside">
        <div className="d-flex flex-column flex-center py-15 px-5 px-md-15 w-100">
          <div className="head">
            <a href="/">
              <img alt="Logo" src="assets/icons/logogreen.svg" />
            </a>
            <span className="title">Suite</span>
            <a href="/auth/register" className="create">
              Create Store
            </a>
          </div>

          <img className="ecommercelayout" src="assets/images/auth-screens.svg" alt="" />

          <h2 className="text-white fs-2qx fw-bolder text-center mb-7">
            Empowering Commerce, Simplifying Success!
          </h2>

          <div className="desc text-white text-center">
            Revolutionize your <span>Online Business</span> with us!
            <br />
            Our <span>eCommerce SaaS Solution</span> makes selling a breeze, transforming startups
            into success stories.
            <br />
            Scale smartly, sell globally, and turn your <span>Dreams Into Reality</span>.
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegisterInterface;
