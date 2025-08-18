import React, { useState, useEffect } from 'react';
import './DengueForm.css';

const DengueForm = () => {
  const [provinces, setProvinces] = useState([]);
  const [districtsByProvince, setDistrictsByProvince] = useState({});
  const [inputs, setInputs] = useState({
    year: 2025,
    month: 1,
    province: "",
    district: "",
    temperature: 28.0,
    rainfall: 50.0,
    humidity: 80.0
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load provinces and districts on component mount
  useEffect(() => {
    const loadProvinces = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/provinces');
        const data = await response.json();
        setProvinces(data.provinces);
        
        // Load districts for each province
        const districtMap = {};
        for (const province of data.provinces) {
          const districtResponse = await fetch(`http://127.0.0.1:8000/districts/${encodeURIComponent(province)}`);
          const districtData = await districtResponse.json();
          districtMap[province] = districtData.districts;
        }
        setDistrictsByProvince(districtMap);
        
        // Set default values
        if (data.provinces.length > 0) {
          const firstProvince = data.provinces[0];
          setInputs(prev => ({
            ...prev,
            province: firstProvince,
            district: districtMap[firstProvince]?.[0] || ""
          }));
        }
      } catch (error) {
        console.error('Error loading provinces/districts:', error);
      }
    };

    loadProvinces();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'province') {
      // When province changes, update district to first district of that province
      const newDistrict = districtsByProvince[value]?.[0] || "";
      setInputs({ 
        ...inputs, 
        [name]: value,
        district: newDistrict
      });
    } else {
      setInputs({ ...inputs, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('http://127.0.0.1:8000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          year: parseInt(inputs.year),
          month: parseInt(inputs.month),
          district: inputs.district,
          temperature: parseFloat(inputs.temperature),
          rainfall: parseFloat(inputs.rainfall),
          humidity: parseFloat(inputs.humidity),
        })
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: "Failed to connect to the server. Is FastAPI running?" });
    } finally {
      setLoading(false);
    }
  };

  const formStyles = {
    container: {
      width: '100vw',
      height: '100vh',
      margin: '0',
      padding: '20px 10px 20px 20px',
      fontFamily: "'Segoe UI', 'Roboto', sans-serif",
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxSizing: 'border-box',
      position: 'relative',
      overflow: 'hidden'
    },
    backgroundLayer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundImage: 'url("/GPJNews_SriLanka_MW_Dengue_255_web_E2.jpg")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      filter: 'blur(3px)',
      zIndex: 0
    },
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.4)',
      zIndex: 1
    },
    mainWrapper: {
      display: 'flex',
      gap: '0px',
      width: '100%',
      maxWidth: '1000px',
      position: 'relative',
      zIndex: 2,
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      borderRadius: '16px',
      padding: '40px',
      boxShadow: '0 15px 35px rgba(0,0,0,0.2)',
      alignItems: 'space-evenly'
    },
    formCard: {
      flex: '1',
      maxWidth: '500px',
      display: 'flex',
      flexDirection: 'column',
      paddingRight: '0px'
    },
    resultsCard: {
      flex: '1',
      maxWidth: '400px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      borderLeft: '2px solid rgba(102, 126, 234, 0.2)',
      paddingLeft: '40px',
      marginLeft: '40px'
    },
    title: {
      fontSize: '2rem',
      fontWeight: '700',
      color: '#333',
      textAlign: 'center',
      margin: '0 0 20px 0',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    },
    formGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '16px',
      marginBottom: '20px'
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column'
    },
    label: {
      fontSize: '12px',
      fontWeight: '600',
      color: '#555',
      marginBottom: '6px',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    },
    input: {
      padding: '10px 14px',
      border: '2px solid #e1e5e9',
      borderRadius: '8px',
      fontSize: '14px',
      transition: 'all 0.3s ease',
      backgroundColor: '#f8f9fa',
      outline: 'none',
      color: '#333',
      width: '100%',
      boxSizing: 'border-box'
    },
    inputFocus: {
      borderColor: '#667eea',
      backgroundColor: 'white',
      transform: 'translateY(-1px)',
      boxShadow: '0 3px 10px rgba(102, 126, 234, 0.15)'
    },
    select: {
      padding: '10px 14px',
      border: '2px solid #e1e5e9',
      borderRadius: '8px',
      fontSize: '14px',
      backgroundColor: '#f8f9fa',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      outline: 'none',
      color: '#333',
      width: '100%',
      boxSizing: 'border-box'
    },
    submitButton: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      border: 'none',
      padding: '12px 24px',
      borderRadius: '10px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: loading ? 'not-allowed' : 'pointer',
      transition: 'all 0.3s ease',
      width: '100%',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      opacity: loading ? 0.7 : 1
    },
    submitButtonHover: {
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)'
    }
  };

  const availableDistricts = inputs.province ? (districtsByProvince[inputs.province] || []) : [];

  return (
    <div style={formStyles.container}>
      <div style={formStyles.backgroundLayer}></div>
      <div style={formStyles.overlay}></div>
      <div style={formStyles.mainWrapper}>
        {/* Left Side - Form */}
        <div style={formStyles.formCard}>
          <h2 style={formStyles.title}>🩺 Dengue Case Prediction</h2>
          <form onSubmit={handleSubmit} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={formStyles.formGrid}>
              <div style={formStyles.inputGroup}>
                <label style={formStyles.label}>Year</label>
                <input
                  style={formStyles.input}
                  className="dengue-input"
                  type="number"
                  name="year"
                  value={inputs.year}
                  onChange={handleChange}
                  placeholder="Enter year (2019-2030)"
                  min="2019"
                  max="2030"
                  required
                  onFocus={(e) => Object.assign(e.target.style, formStyles.inputFocus)}
                  onBlur={(e) => Object.assign(e.target.style, formStyles.input)}
                />
              </div>

              <div style={formStyles.inputGroup}>
                <label style={formStyles.label}>Month</label>
                <select 
                  style={formStyles.select} 
                  name="month" 
                  value={inputs.month} 
                  onChange={handleChange}
                  onFocus={(e) => Object.assign(e.target.style, formStyles.inputFocus)}
                  onBlur={(e) => Object.assign(e.target.style, formStyles.select)}
                >
                  {[...Array(12)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {new Date(2020, i).toLocaleString('default', { month: 'long' })}
                    </option>
                  ))}
                </select>
              </div>

              <div style={formStyles.inputGroup}>
                <label style={formStyles.label}>Province</label>
                <select 
                  style={formStyles.select} 
                  name="province" 
                  value={inputs.province} 
                  onChange={handleChange}
                  onFocus={(e) => Object.assign(e.target.style, formStyles.inputFocus)}
                  onBlur={(e) => Object.assign(e.target.style, formStyles.select)}
                >
                  <option value="">Select Province</option>
                  {provinces.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>

              <div style={formStyles.inputGroup}>
                <label style={formStyles.label}>District</label>
                <select 
                  style={formStyles.select} 
                  name="district" 
                  value={inputs.district} 
                  onChange={handleChange}
                  onFocus={(e) => Object.assign(e.target.style, formStyles.inputFocus)}
                  onBlur={(e) => Object.assign(e.target.style, formStyles.select)}
                  disabled={!inputs.province}
                >
                  <option value="">Select District</option>
                  {availableDistricts.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              <div style={formStyles.inputGroup}>
                <label style={formStyles.label}>Temperature (°C)</label>
                <input
                  style={formStyles.input}
                  className="dengue-input"
                  type="number"
                  step="0.1"
                  name="temperature"
                  value={inputs.temperature}
                  onChange={handleChange}
                  placeholder="Enter temperature (°C)"
                  required
                  onFocus={(e) => Object.assign(e.target.style, formStyles.inputFocus)}
                  onBlur={(e) => Object.assign(e.target.style, formStyles.input)}
                />
              </div>

              <div style={formStyles.inputGroup}>
                <label style={formStyles.label}>Rainfall (mm)</label>
                <input
                  style={formStyles.input}
                  className="dengue-input"
                  type="number"
                  step="0.1"
                  name="rainfall"
                  value={inputs.rainfall}
                  onChange={handleChange}
                  placeholder="Enter rainfall (mm)"
                  required
                  onFocus={(e) => Object.assign(e.target.style, formStyles.inputFocus)}
                  onBlur={(e) => Object.assign(e.target.style, formStyles.input)}
                />
              </div>

              <div style={formStyles.inputGroup}>
                <label style={formStyles.label}>Humidity (%)</label>
                <input
                  style={formStyles.input}
                  className="dengue-input"
                  type="number"
                  step="0.1"
                  name="humidity"
                  value={inputs.humidity}
                  onChange={handleChange}
                  placeholder="Enter humidity percentage"
                  required
                  onFocus={(e) => Object.assign(e.target.style, formStyles.inputFocus)}
                  onBlur={(e) => Object.assign(e.target.style, formStyles.input)}
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading || !inputs.province || !inputs.district}
              style={{ ...formStyles.submitButton, marginTop: 'auto' }}
              onMouseEnter={(e) => !loading && Object.assign(e.target.style, formStyles.submitButtonHover)}
              onMouseLeave={(e) => !loading && Object.assign(e.target.style, formStyles.submitButton)}
            >
              {loading ? '🔄 Predicting...' : '🔍 Predict Dengue Cases'}
            </button>
          </form>
        </div>

        {/* Right Side - Results */}
        <div style={formStyles.resultsCard}>
          {loading ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                fontSize: '3rem', 
                marginBottom: '16px',
                animation: 'spin 1s linear infinite' 
              }}>
                🔄
              </div>
              <h3 style={{ 
                color: '#667eea', 
                margin: '0', 
                fontSize: '1.2rem' 
              }}>
                Analyzing Data...
              </h3>
              <p style={{ 
                color: '#666', 
                margin: '8px 0 0 0', 
                fontSize: '14px' 
              }}>
                Please wait while we predict dengue cases
              </p>
            </div>
          ) : result ? (
            <div style={{
              width: '100%',
              padding: '16px',
              border: 'none',
              borderRadius: '12px',
              background: result.error ? 
                'linear-gradient(135deg, #ff6b6b 0%, #ffa8a8 100%)' : 
                'linear-gradient(135deg, #51cf66 0%, #8ce99a 100%)',
              color: 'white',
              boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
              textAlign: 'center'
            }}>
              <h3 style={{ 
                margin: '0 0 8px 0', 
                fontSize: '1.2rem',
                fontWeight: '700'
              }}>
                {result.error ? '❌ Prediction Failed' : '✅ Prediction Result'}
              </h3>
              {result.error ? (
                <p style={{ 
                  margin: 0, 
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  <strong>Error:</strong> {result.error}
                </p>
              ) : (
                <div>
                  <p style={{ 
                    margin: '0 0 6px 0', 
                    fontSize: '18px',
                    fontWeight: '700'
                  }}>
                    <strong>{result.predicted_cases}</strong> estimated cases
                  </p>
                  <p style={{ 
                    margin: '0 0 6px 0', 
                    fontSize: '14px',
                    opacity: 0.9
                  }}>
                    in <strong>{result.district}</strong> for {result.month}/{result.year}
                  </p>
                  {result.coordinates && (
                    <p style={{ 
                      margin: 0, 
                      fontSize: '12px',
                      opacity: 0.8
                    }}>
                      📍 Lat: {result.coordinates.latitude.toFixed(3)}, 
                      Lng: {result.coordinates.longitude.toFixed(3)}
                    </p>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div style={{ textAlign: 'center', color: '#666' }}>
              <div style={{ fontSize: '4rem', marginBottom: '16px' }}>📊</div>
              <h3 style={{ 
                color: '#667eea', 
                margin: '0', 
                fontSize: '1.2rem' 
              }}>
                Prediction Results
              </h3>
              <p style={{ 
                margin: '8px 0 0 0', 
                fontSize: '14px' 
              }}>
                Fill out the form and click "Predict" to see dengue case predictions for your selected location and conditions.
              </p>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default DengueForm;