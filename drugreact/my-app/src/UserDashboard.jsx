import React, { useState } from 'react';
import './navigation.css';
import capsule from "./images/capsulecart.jpg";
import { Link, useNavigate } from "react-router-dom";
import caps1 from "./images/caps1.jpg";
import caps10 from "./images/caps10.jpg";
import caps8 from "./images/caps8.jpg";
import caps4 from "./images/caps4.jpg";
import caps7 from "./images/caps7.jpg";
import axios from 'axios';

export function UserDashboard() {
    const [location, setLocation] = useState("Location");
    const [drugName, setMedicine] = useState("");
    const [results, setResults] = useState([]);
    const [error, setError] = useState("");
    const [searchInitiated, setSearchInitiated] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();
    const [isPopupShown, setIsPopupShown] = useState(false);
    const handleBuyNowClick = (drug) => {
        console.log('Drug object before navigation:', drug);

        const user = JSON.parse(localStorage.getItem("user"));

        if (user && user.token) {
            navigate("/order", { state: { drug } });
        } else {
            localStorage.setItem("redirectPath", "/order");
            localStorage.setItem("selectedDrug", JSON.stringify(drug));
            navigate("/login");
        }
    };

    const handleSearch = async () => {
        setSearchInitiated(true);
        setError("");

        try {
            const response = await axios.get(`http://localhost:3000/search/${location}/${drugName}`);
            if (response.data.success) {
                setResults(response.data.results);
                setError("");
            } else {
                setResults([]);
                setError(response.data.message || "No drugs found");
            }
        } catch (err) {
            setError("Error fetching results");
            setResults([]);
        }
    };

    const handleLocationSubmit = (newLocation) => {
        setLocation(newLocation);
        setShowModal(false);
    };

    const handleInputChange = (e) => {
        const inputValue = e.target.value;
        setMedicine(inputValue);

        // Show the modal only if it hasn't been shown yet and user starts typing the first letter
        if (inputValue.length === 1) {
            setShowModal(true);
            setIsPopupShown(true); // Set the flag to true to prevent showing again
        }
    };

    return (
        <div className="App">
            <header className="header">
                <div className="header-container">
                    <div className="logo-container">
                        <img src={capsule} width={'65px'} height={'60px'} className='logo' /><h2 className='title-content1'> CapsuleCart </h2>
                    </div>
                    <div className='header-marquee'>
                        <marquee>Affordable Healthcare at Your Fingertips – Start Shopping with CapsuleCart!</marquee>
                    </div>
                    <div className="header-right">
                        <button
                            className="login-btn"
                            onClick={() => {
                                localStorage.removeItem("user");
                                localStorage.removeItem("redirectPath");
                                localStorage.removeItem("selectedDrug");
                                navigate('/');
                            }}
                        >
                            Logout
                        </button>
                        <Link to='/contact'>
                            <button className="login-btn">ContactUs</button>
                        </Link>
                    </div>
                </div>
            </header>

            <div className="search-section">
                <div className="search-container">
                    <h1>Medicines at discounted rates, home delivered.</h1>
                    <p>Order Medicines Now.</p>
                    <div className="search-bar-container">
                        <label className="location-label">{location}</label>
                        <div className="divider"> </div>
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search Medicines"
                            value={drugName}
                            onChange={handleInputChange}
                        />
                        <div className="divider"> </div>
                        <button className="search-button" onClick={handleSearch}>
                            <span className="search-icon">🔍</span> Search
                        </button>
                    </div>
                </div>
            </div>


            {showModal && (
                <div className="popup">
                    <h2>Enter Your Nearest City</h2>
                    <p>Enter your nearest city to check the availability of medicine.</p>
                    <input
                        type="text"
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Type your city here"
                    />
                    <div className="button-row">
                        <button onClick={() => handleLocationSubmit(location.charAt(0).toUpperCase() + location.slice(1))}>
                            Submit
                        </button>
                        <button className="cancel-button" onClick={() => setShowModal(false)}>Cancel</button>
                    </div>
                </div>
            )}

            {/* Show features and cards only when search is not initiated */}
            {!searchInitiated && (
                <div>
                    <div className="container">
                        <div className="cards">
                            <div className="card-wrapper">
                                <img src={caps1} alt="Capsule 1" />
                            </div>
                            <div className="card-wrapper">
                                <img src={caps7} alt="Capsule 7" />
                            </div>
                            <div className="card-wrapper">
                                <img src={caps4} alt="Capsule 4" />
                            </div>
                            <div className="card-wrapper">
                                <img src={caps8} alt="Capsule 8" />
                            </div>
                            <div className="card-wrapper">
                                <img src={caps10} alt="Capsule 10" />
                            </div>
                        </div>
                    </div>
                    <div className="features">
                        <div className="feature">
                            <div className="icon">💊</div>
                            <h3>Genuine Meds</h3>
                            <p>Be assured that you will always receive genuine brands and medicines from authorized distribution partners.</p>
                        </div>
                        <div className="feature">
                            <div className="icon">🚴‍♂</div>
                            <h3>Door Delivery</h3>
                            <p>Get your prescription medicines conveniently delivered right at your doorstep.</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Results Section */}
            {searchInitiated && (
                <div className="results">
                    {error && <p className="error-message">{error}</p>}
                    {results.length > 0 ? (
                        <ul className="drug-list">
                            {results.map((result, index) => (
                                <li key={index} className="drug-item">
                                    <div className="drug-row">
                                        <img
                                            src={`http://localhost:3000/${result.image}`}
                                            alt={result.drugName}
                                            className="drug-image"
                                        />

                                        <div className="drug-details">
                                            <p><strong>Drug Name:</strong> {result.drugName}</p>
                                            <p><strong>Cost:</strong> {result.Cost}</p>
                                            <p><strong>Capsules Per Pack:</strong> {result.CapsulesPerPack}</p>
                                            <p><strong>Company:</strong> {result.Company}</p>
                                        </div>

                                        <button className="order-button" onClick={() => handleBuyNowClick(result)}>
                                            BUY NOW
                                        </button>

                                    </div>
                                </li>
                            ))}
                        </ul>

                    ) : (
                        <p>No drugs found</p>
                    )}

                </div>
            )}

            {/* Footer */}
            {!searchInitiated && (
                <footer>
                    <div className="footer-container">
                        <div className="footer-section-left-area">
                            <h3>FOLLOW US</h3>
                            <ul>
                                <li><a href=""><i className="fa-brands fa-square-instagram fa-2x"></i></a></li>
                                <li><a href=""><i className="fa-brands fa-square-facebook fa-2x"></i></a></li>
                                <li><a href=""><i className="fa-brands fa-linkedin fa-2x"></i></a></li>
                            </ul>
                        </div>
                        <div className="footer-section links">
                            <h3>LINK</h3>
                            <ul className="footer-links">
                                <li><a href="#">Home</a></li>
                                <li><a href="#">Privacy Policy</a></li>
                                <li><a href="#">Terms and Conditions</a></li>
                            </ul>
                        </div>
                        <div className="footer-section contact-us">
                            <h3>CONTACT US</h3>
                            <p><a href="mailto:capsulecart@example.com">Mail: capsulecart@example.com</a></p>
                            <p><a href="tel:+5555555555">Phone: 0555 555 55 55</a></p>
                        </div>
                    </div>
                </footer>
            )}
        </div>
    );
}
