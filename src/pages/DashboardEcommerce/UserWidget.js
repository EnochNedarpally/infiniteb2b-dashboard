
import CountUp from "react-countup";
import { Link } from 'react-router-dom';
import { Card, CardBody, Col } from 'reactstrap';
import React, { useEffect, useState } from "react";
import axios from "axios";
import { api } from "../../config";

const UserWidget = () => {
  const [userWidgets, setUserWidgets] = useState([]);
   
    useEffect(() => {
        fetchWidgets();
      }, []);
    
      const fetchWidgets = async () => {
        const token = JSON.parse(sessionStorage.getItem("authUser")).data.jwtToken ?? null;
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
    
        try {
          const data = await axios.get(
            `${api.API_URL}/api/user/dashboard`,
            config
          );
          const widgetsData = data.ecomWidgets; 
          setUserWidgets(widgetsData); 
     
       
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      const hardcodedRoutes = [
        '/user/saved-whitepapers',
        '/user/downloaded-whitepapers',
        '/user/viewed-whitepapers',
        '/user/news-letter',    
    ];
    return (
        <React.Fragment>
           {userWidgets?.map((item, index) => {
    const route = hardcodedRoutes[index] !== undefined ? hardcodedRoutes[index] : '/default-route';

    return (
        <Col xl={3} md={6} key={index}>
            <Card className="card-animate">
                <CardBody>
                    <div className="d-flex align-items-center">
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
        </React.Fragment>
    );
};

export default UserWidget;