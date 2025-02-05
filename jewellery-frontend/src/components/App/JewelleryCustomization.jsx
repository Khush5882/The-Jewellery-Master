import React, { useState, useEffect } from 'react';
import './JewelryCustomizationPage.css';

const JewelryCustomizationPage = () => {
  const [formData, setFormData] = useState({
    jewelryType: '',
    material: '',
    size: '',
    engravingText: '',
    stone: '',
    color: '',
  });

  const [priceDetails, setPriceDetails] = useState({
    basePrice: 0,
    materialPrice: 0,
    stonePrice: 0,
    totalPrice: 0,
  });

  const [previewImage, setPreviewImage] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [error, setError] = useState('');
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    const savedData = localStorage.getItem('customization');
    if (savedData) setFormData(JSON.parse(savedData));
  }, []);

  const basePrices = {
    ring: 100,
    necklace: 200,
    bracelet: 150,
  };

  const materialPrices = {
    gold: 300,
    silver: 150,
    platinum: 500,
  };

  const stonePrices = {
    diamond: 500,
    emerald: 300,
    ruby: 400,
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    updatePreviewImage({ ...formData, [name]: value });
    updatePriceDetails({ ...formData, [name]: value });
  };

  const updatePriceDetails = (data) => {
    const basePrice = basePrices[data.jewelryType] || 0;
    const materialPrice = materialPrices[data.material] || 0;
    const stonePrice = stonePrices[data.stone] || 0;
    const totalPrice = basePrice + materialPrice + stonePrice;
    setPriceDetails({ basePrice, materialPrice, stonePrice, totalPrice });
  };

  const updatePreviewImage = (data) => {
    if (data.jewelryType && data.material) {
      setPreviewImage(/images/${data.jewelryType}_${data.material}.jpg);
    } else {
      setPreviewImage('');
    }
  };

  const validateForm = () => {
    let isValid = true;

    if (!formData.jewelryType) {
      setError('Please select a jewelry type.');
      isValid = false;
    }

    if (!formData.material) {
      setError('Please select a material.');
      isValid = false;
    }

    if (currentStep === 2 && !formData.size) {
      setError('Please enter the size.');
      isValid = false;
    }

    setError(isValid ? '' : 'Please fill in all required fields.');
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    localStorage.setItem('customization', JSON.stringify(formData));
    alert('Customization saved successfully!');
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark-mode', !darkMode);
  };

  const nextStep = () => {
    if (validateForm()) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  return (
    <div className={jewelry-customization-page ${darkMode ? 'dark' : ''}}>
      <div className="customization-container">
        <h1 className="page-title">Customize Your Jewelry</h1>

        <button onClick={toggleDarkMode} className="dark-mode-toggle">
          {darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        </button>

        {error && <div className="error-message">{error}</div>}

        <div className="form-image-container">
          <form onSubmit={handleSubmit} className="customization-form">
            <div className="step-indicator">Step {currentStep} of 3</div>

            {currentStep === 1 && (
              <>
                <div>
                  <label className="form-label">Jewelry Type:</label>
                  <select name="jewelryType" value={formData.jewelryType} onChange={handleChange}>
                    <option value="">Select</option>
                    <option value="ring">Ring</option>
                    <option value="necklace">Necklace</option>
                    <option value="bracelet">Bracelet</option>
                  </select>
                  {!formData.jewelryType && <div className="error-message">This field is required.</div>}
                </div>

                <div>
                  <label className="form-label">Material:</label>
                  <select name="material" value={formData.material} onChange={handleChange}>
                    <option value="">Select</option>
                    <option value="gold">Gold</option>
                    <option value="silver">Silver</option>
                    <option value="platinum">Platinum</option>
                  </select>
                  {!formData.material && <div className="error-message">This field is required.</div>}
                </div>
              </>
            )}

            {currentStep === 2 && (
              <>
                <div>
                  <label className="form-label">Size:</label>
                  <input type="text" name="size" value={formData.size} onChange={handleChange} />
                  {!formData.size && <div className="error-message">Please enter the size.</div>}
                </div>

                <div>
                  <label className="form-label">Engraving Text (optional):</label>
                  <input type="text" name="engravingText" value={formData.engravingText} onChange={handleChange} />
                </div>
              </>
            )}

            {currentStep === 3 && (
              <>
                <div>
                  <label className="form-label">Stone:</label>
                  <select name="stone" value={formData.stone} onChange={handleChange}>
                    <option value="">Select</option>
                    <option value="diamond">Diamond</option>
                    <option value="emerald">Emerald</option>
                    <option value="ruby">Ruby</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Color:</label>
                  <select name="color" value={formData.color} onChange={handleChange}>
                    <option value="">Select</option>
                    <option value="red">Red</option>
                    <option value="blue">Blue</option>
                    <option value="green">Green</option>
                  </select>
                </div>
              </>
            )}

            <div className="form-navigation">
              {currentStep > 1 && <button type="button" onClick={prevStep}>Previous</button>}
              {currentStep < 3 ? (
                <button type="button" onClick={nextStep}>Next</button>
              ) : (
                <button type="submit">Submit Customization</button>
              )}
            </div>
          </form>

          {previewImage && (
            <div className="image-preview-container">
              <h3>Preview</h3>
              <img src={previewImage} alt="Jewelry Preview" className="preview-image" />
            </div>
          )}
        </div>

        <div className="price-display">
          <h3>Price Breakdown</h3>
          <p>Base Price: ${priceDetails.basePrice}</p>
          <p>Material Price: ${priceDetails.materialPrice}</p>
          <p>Stone Price: ${priceDetails.stonePrice}</p>
          <p><strong>Total Price: ${priceDetails.totalPrice}</strong></p>
        </div>
      </div>
    </div>
  );
};

export default JewelryCustomizationPage;
