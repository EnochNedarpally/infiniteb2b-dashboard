
import CountUp from "react-countup";
import { Link } from 'react-router-dom';
import { Card, CardBody, Col } from 'reactstrap';
// import { totalecomWidgets } from '../../common/data/dashboardEcommerce';
import React, { useEffect, useState } from "react";
import axios from "axios";

const TotalecomWidgets = () => {
  const [totalecomWidgets, setTotalecomWidgets] = useState([]);
   
    useEffect(() => {
        fetchCategories();
      }, []); // Empty dependency array ensures it runs only once on mount
    
      // Function to fetch categories from the API
      const fetchCategories = async () => {
        // const token ="eyJhbGciOiJIUzUxMiJ9.eyJyb2xlcyI6WyJST0xFX1ZFTkRPUiJdLCJzdWIiOiJwYW5rYWouZ2F3YWRlQG9kdGVhbXMuY29tIiwiaWF0IjoxNzMzMDYyNzIwLCJleHAiOjE3MzM0MjI3MjB9.nQqJzQUW4W57Axcm60aOugWdgX5TTePuPm8uX9SyypPnj1-MCSmbbmEZ9ybBd6IB4Te99NLV7w1HR-mVwhh_6g";
        const token = JSON.parse(sessionStorage.getItem("authUser")) ? JSON.parse(sessionStorage.getItem("authUser")).token : null;
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
    
        try {
          // Make the GET request to the API
          const data = await axios.get(
            "https://infiniteb2b.com:8443/api/vendor/dashboard",
            config
          );
        //   console.log("data", data)
          const widgetsData = data.ecomWidgets; 
          setTotalecomWidgets(widgetsData); 
        //   console.log("widgetsData", widgetsData)
     
       
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      const hardcodedRoutes = [
        '/vendor/all-whitepapers?status=',
        '/vendor/all-whitepapers?status=1',
        '/vendor/all-whitepapers?status=2',
        '/vendor/all-whitepapers?status=3',
    ];
  

    return (
        // <div style={{ marginLeft: 400 }}>
        <>
           {totalecomWidgets.map((item, index) => {
    const route = hardcodedRoutes[index] !== undefined ? hardcodedRoutes[index] : '/default-route';

    return (
        <Col xl={3} md={6} key={index}>
            <Card className="card-animate">
                <CardBody>
                    <div className="d-flex align-items-center" >
                        <div className="flex-grow-1 overflow-hidden">
                            <p className="text-uppercase fw-medium text-muted text-truncate mb-0">
                                {item.label}
                            </p>
                        </div>
                        <div className="flex-shrink-0">
                            <h5 className={"fs-14 mb-0 text-" + item.badgeClass}>
                                {item.badge ? (
                                    <i className={"fs-13 align-middle " + item.badge}></i>
                                ) : null}{" "}
                                {item.percentage}
                            </h5>
                        </div>
                    </div>
                    <div className="d-flex align-items-end justify-content-between mt-4">
                        <div>
                            <h4 className="fs-20 fw-semibold ff-secondary mb-4">
                                <CountUp
                                    start={0}
                                    prefix={item.prefix}
                                    suffix={item.suffix}
                                    separator={item.separator}
                                    end={item.counter}
                                    decimals={item.decimals}
                                    duration={4}
                                />
                            </h4>
                            <Link to={route} className="text-decoration-underline">
                                {item.link}
                            </Link>
                        </div>
                        <div className="avatar-sm flex-shrink-0">
                            <span
                                className={
                                    "avatar-title rounded fs-3 bg-" +
                                    item.bgcolor +
                                    "-subtle"
                                }
                            >
                                <i className={`text-${item.bgcolor} ${item.icon}`}></i>
                            </span>
                        </div>
                    </div>
                </CardBody>
            </Card>
        </Col>
    );
})}



                {/* {totalecomWidgets.map((item, key) => (
                <Col xl={3} md={6} key={key}>
                    <Card className="card-animate">
                        <CardBody>
                            <div className="d-flex align-items-center">
                                <div className="flex-grow-1 overflow-hidden">
                                    <p className="text-uppercase fw-medium text-muted text-truncate mb-0">{item.label}</p>
                                </div>
                                <div className="flex-shrink-0">
                                    <h5 className={"fs-14 mb-0 text-" + item.badgeClass}>
                                        {item.badge ? <i className={"fs-13 align-middle " + item.badge}></i> : null} {item.percentage} 
                                    </h5>
                                </div>
                            </div>
                            <div className="d-flex align-items-end justify-content-between mt-4">
                                <div>
                                    <h4 className="fs-20 fw-semibold ff-secondary mb-4"><span className="counter-value" data-target="559.25">
                                        <CountUp
                                            start={0}
                                            prefix={item.prefix}
                                            suffix={item.suffix}
                                            separator={item.separator}
                                            end={item.counter}
                                            decimals={item.decimals}
                                            duration={4}
                                        />
                                    </span></h4>
                                    <Link to="/all-vendors" className="text-decoration-underline">{item.link}</Link>
                                </div>
                                <div className="avatar-sm flex-shrink-0">
                                    <span className={"avatar-title rounded fs-3 bg-" + item.bgcolor+"-subtle"}>
                                        <i className={`text-${item.bgcolor} ${item.icon}`}></i>
                                    </span>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </Col>))} */}
        </>
    );
};

export default TotalecomWidgets;