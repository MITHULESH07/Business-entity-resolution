import {useEffect, useState} from "react";
import api from "./services/api";
import "./App.css";

function App(){
  const [record1,setRecord1] = useState({
    name:"",
    address:"",
    city:"",
    state:"",
    zip_code:""
  });
  const [record2,setRecord2]= useState({
    name:"",
    address:"",
    city:"",
    state:"",
    zip_code:""
  });
  
  const [result,setResult] = useState(null);
  const [loading,setLoading]= useState(false);
  const [error,setError]=useState("");

  function handleLoadSample(){
    setRecord1({
    name: "Amazon",
    address: "410 Terry Avenue North",
    city: "Seattle",
    state: "Washington",
    zip_code: "98109",
    });

    setRecord2({
    name: "Amazon Inc",
    address: "410 Terry Ave N",
    city: "Seattle",
    state: "Washington",
    zip_code: "98109",
    });

    setError("");
    setResult(null);
  }

  function handleReset(){
    const emptyRecord = {
      name:"",
      address:"",
      city:"",
      state:"",
      zip_code:""
    };
    setRecord1({...emptyRecord});
    setRecord2({...emptyRecord});
    setError("");
    setResult(null);
  }

  async function handleCompare(){
    const records=[record1,record2];

    for(const record of records){
      for(const value of Object.values(record)){
        if(!value.trim()){
          setError("All fields are required.");
          return;
        }
      }
    }
    setLoading(true);
    setError("");
    setResult(null);

    try{
      const response = await api.post("/predict",{
        record1,
        record2
      });

      setResult(response.data);
    }catch(error){
      setError(error.response?.data?.detail?JSON.stringify(error.response.data.detail):"An error occurred while comparing records.");
    }finally{
      setLoading(false);
    }
  }

  return (
    <div className="container">

      <header className="header"> 
        <h1>Business Entity Resolution</h1>
        <p>AI-Poweres business record matching using XGBoost</p>
      </header>

      <div className="records">
        <div className="card">
          <h2>Record 1</h2>
          <input placeholder="Name" value={record1.name} onChange={(e)=>setRecord1({...record1,name:e.target.value})}/>
          <input placeholder="Address" value={record1.address} onChange={(e)=>setRecord1({...record1,address:e.target.value})}/>
          <input placeholder="City" value={record1.city} onChange={(e)=>setRecord1({...record1,city:e.target.value})}/>
          <input placeholder="State" value={record1.state} onChange={(e)=>setRecord1({...record1,state:e.target.value})}/>
          <input placeholder="Zip" value={record1.zip_code} onChange={(e)=>setRecord1({...record1,zip_code:e.target.value})}/>
        </div>
        <div className="card">
          <h2>Record 2</h2>
          <input placeholder="Name" value={record2.name} onChange={(e)=>setRecord2({...record2,name:e.target.value})}/>
          <input placeholder="Address" value={record2.address} onChange={(e)=>setRecord2({...record2,address:e.target.value})}/>
          <input placeholder="City" value={record2.city} onChange={(e)=>setRecord2({...record2,city:e.target.value})}/>
          <input placeholder="State" value={record2.state} onChange={(e)=>setRecord2({...record2,state:e.target.value})}/>
          <input placeholder="Zip" value={record2.zip_code} onChange={(e)=>setRecord2({...record2,zip_code:e.target.value})}/>
        </div>
      </div>

      <div className="compare-section">

        <button onClick={handleCompare} disabled={loading}>
          {loading ? "Analizing Records..." : "Compare Records"}
        </button>

        <button onClick={handleLoadSample} style={{backgroundColor:"#64748b", marginLeft:"10px"}}>
          Load Sample
        </button>
              
        <button onClick={handleReset} style={{backgroundColor:"#64748b", marginLeft:"10px"}}>
          Reset
        </button>

        {error && (<div className="error-message">{error}</div>)}

        {result && (
          <div className="result">
            <h2>Prediction Result</h2>
            <div className={`result-badge ${result.match ? "match" : "no-match"}`}> 
              {result.match ? "Match" : "No Match"}
            </div>

            <h3>{(result.confidence*100).toFixed(2)}% Confidence</h3>
            
            <div className="confidence-bar">
              <div className="confidence-fill" style={{width:`${result.confidence*100}%`}}/>
            </div>

            <div calssName="features">
              <h3>Features Similarities</h3>
                {Object.entries(result.features).map(([name, value]) => (
                  <div className="feature-row" key={name}>
                    <div className="feature-label">
                      <span>{name.replaceAll("_", " ")}</span>
                      <span>
                        {typeof value === "number"
                          ? (value * 100).toFixed(0) + "%"
                          : value}
                      </span>
                    </div>

                  <div className="feature-bar">
                    <div
                      className="feature-fill"
                      style={{
                        width: `${Number(value) * 100}%`,
                      }}
                    />
                  </div>
              </div>
            ))}
            </div>
          </div>
        )}  
      </div>
    </div>
  )
}
export default App;