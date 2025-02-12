import React from 'react'
import image from "../../assets/images/white 1.png";
import "./OtpPage.css";

function OtpPage() {
  return (
    <div className='container'>
         <img
        src={image}
        alt="Yaba College of Technology Logo"
        className="logo-1"
      />
      <form className="Regform">
        <div className="sub-title">A One Time Password (OTP has been <br /> sent to your email address)</div>
        <label htmlFor="number">Enter OTP (check your email)</label>
        <input
          type="number"
          placeholder="                                       /       /       /       /       /"
          required
        />
       
        <button type="submit">Verify</button>
      </form>
    </div>
  )
}

export default OtpPage