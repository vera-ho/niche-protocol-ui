import React from 'react'
import { uuidv4 } from '@firebase/util';
import { createSpec, getSpec, getSpecDocs, updateSpec } from './util/firebase';
import { getSpecTypes, getSpecSchema } from './util/beagle_specs';
import LookupForm from './LookupForm';
import SpecItem from './SpecItem';
import SpecForm from './SpecForm';
import EdgeForm from './EdgeForm';
import './App.css'

function App() {
  const [specName, setSpecName] = React.useState('user');
  const [specTypes, setSpecTypes] = React.useState([])
  const [specSchema, setSpecSchema] = React.useState({});
  const [existingSpec, setExistingSpec] = React.useState({});
  const [existingDocs, setExistingDocs] = React.useState([]);

  // Get spec types for document creation and loading and spec schema for validation/form entries
  // Try this later: https://github.com/reactjs/rfcs/pull/229
  React.useEffect( () => {
    getSpecTypes(setSpecTypes);
    getSpecSchema(specName, setSpecSchema);
  }, [specName])

  // Save to Firestore and return resulting spec (can be used for validating sucessful operation)
  const handleSave = React.useCallback(async (specName, id, values) => {
    if (id === null) {
      id = uuidv4();
      const newSpec = await createSpec(`${specName}/${id}`, { id, ...values });
      return newSpec;
    }

    const updatedSpec = await updateSpec(`${specName}/${id}`, values);
    return updatedSpec;
  }, []);

  // Load one document from a spec with a given UUID`
  const handleLoadOne = React.useCallback(async (specName, id) => {
    const spec = await getSpec(`${specName}/${id}`);
    if (!spec) {
      return alert(`${specName}/${id} not found!`);
    }

    setExistingSpec(spec);
    setExistingDocs([spec]);
  }, []);

  // Load all documents from a spec when no UUID is given
  const handleLoadAll = React.useCallback(async (specName) => {
    const specItems = await getSpecDocs(`${specName}`);
    if (!specItems) {
      return alert(`${specName} not found!`);
    }

    let items = [];
    specItems.forEach(doc => items.push(doc.data()));
    setExistingDocs(items);
    setExistingSpec(items[0]);
  }, []);
  
  // Set specName from dropdown for entire app
  const handleSpecSelect = React.useCallback((e) => {
    e.preventDefault();
    setSpecName(e.target.value);
    setExistingSpec({});
    setExistingDocs([]);
  })
  
  // Reset all fields - datetime pickers seem not resettable
  const handleAddNew = React.useCallback(() => {
    let initValues = {};
    Object.keys(specSchema['fields'] || {}).forEach(field => {
      initValues[field] = specSchema['fields'][field]['initialValue'];
    });
    
    // setExistingSpec({});
    setExistingSpec(initValues);
  })
  
  const specItems = existingDocs.map((spec, idx) => {
    return (
        <SpecItem key={idx} itemNum={idx} spec={spec} specName={specName} setExistingSpec={setExistingSpec} />
    )
  }); 

  const listTitle = specItems.length ? (
    <div>
      <h3>all {specName} specs</h3>
    </div>
  ) : (
    <div className='list-title'>
      <h3>spec entries will display here</h3>
      <p>1. select spec type from the dropdown above</p>
      <p>2. load at least one spec entry</p>
    </div>
  );

  return (
    <div>

      <h1>Beagle Data Manager</h1>

      <div className='nav-bar-container'>
        <div className='nav-bar-content'>

          <div className='spec-type-selection'>
            <label>spec type:
              <select name="spec_name" onChange={handleSpecSelect} value={specName}>
                  {specTypes.map((spec, idx) => <option key={idx} value={spec}>{spec}</option>)}
              </select>
            </label>
          </div>

          <div className='look-up-form'>
            <LookupForm 
              onLoadOne={handleLoadOne} 
              onLoadAll={handleLoadAll}
              specName={specName}
            />
          </div>

        </div>
      </div>

      <div className='spec-container'>
        <div className='spec-content'>

          <div className='spec-index-content'>
            {listTitle}
            {specItems}
          </div>

          <div className='spec-details-content'>
            <div className='spec-add-new-entry'>
              <button type='button' onClick={handleAddNew}>Add New Entry</button>
            </div>
          
            <div className='spec-form-details'>
              <h3>Spec Details</h3>
              {existingSpec
              ?
                <SpecForm
                  specName={specName}  
                  id={existingSpec.id}
                  existingFieldValues={existingSpec}
                  onSave={handleSave} 
                  onLoadAll={handleLoadAll}  
                  specSchema={specSchema}    
                  setSpec={setExistingSpec}  
                />
              :
                <SpecForm
                  specName={specName}
                  specSchema={specSchema}      
                  onSave={handleSave}
                  onLoadAll={handleLoadAll}
                  setSpec={setExistingSpec}
                />
              }
            </div>

            <div className='edge-form-container'>
              <h3>Edges</h3>
              {existingSpec ?
                <EdgeForm 
                  specSchema={specSchema}
                  specName={specName}
                  id={existingSpec.id}
                  existingFieldValues={existingSpec}
                  onLoad={handleLoadOne}
                  onSave={handleSave}
                />
              : 
                <EdgeForm 
                  specSchema={specSchema}
                  specName={specName}
                  onLoad={handleLoadOne}
                  onSave={handleSave}
                />
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App;