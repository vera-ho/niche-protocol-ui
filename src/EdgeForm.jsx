import React from 'react';
import { getSpec } from './util/firebase';

const EdgeForm = props => {
    const { specSchema, specName, id, existingFieldValues, onSave } = props;
    const [edgeName, setEdgeName] = React.useState('');
    const [edgeSpec, setEdgeSpec] = React.useState({});
    const edgeTypes = specSchema['edges'];
    const edges = existingFieldValues ? existingFieldValues[edgeName] : [];

    // Choose edge type
    const handleEdgeSelect = React.useCallback((e) => {
        e.preventDefault();
        setEdgeName(e.target.value);
    })

    // Retrieve spec associated with given edge ID
    const handleLoadSpec = React.useCallback(async (specName, id) => {
        if(!specName || !id) return alert('Specify both specName and id');
        const spec = await getSpec(`${specName}/${id}`);
        if(!spec) return alert((`${specName}/${id} not found!`));
        setEdgeSpec(spec);
    })

    // Add new edge connection
    const handleAddEdge = React.useCallback(e => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const edgeID = formData.get('id');
        const specID = id;
        const alias = edgeName === 'owner' ? 'user' : edgeName;

        if(!edgeName) return alert('Select an edge type!');
        if(!edgeID) return alert('Enter an ID!')
        
        handleLoadSpec(alias, edgeID);

        // Create array if it doesn't exist so that IDs can be pushed
        if(!existingFieldValues[edgeName]) existingFieldValues[edgeName] = [];
        if(!edgeSpec[specName]) edgeSpec[specName] = [];

        // Add edgeID to current spec if it doesn't exist
        if(existingFieldValues[edgeName].includes(edgeID)) {
            alert(`${edgeID} already exists in ${edgeName}`);
        } else {
            existingFieldValues[edgeName].push(edgeID);
            onSave(specName, specID, existingFieldValues);
        }

        // Add current spec ID to edgeID's spec if it doesn't exist
        console.log('handleAddEdge specName: ' + specName)
        console.log(edgeSpec)
        console.log(existingFieldValues)
        if(edgeSpec[specName].includes(specID)) {
            alert(`${specID} already exists in ${specName}`)
        } else {
            edgeSpec[specName].push(specID);
            onSave(alias, edgeID, edgeSpec);
        }
    })

    // Remove edge connection
    const handleDeleteEdge = React.useCallback(async (e) => {
        e.preventDefault();

        let msg = 'Are you sure you want to delete this edge?';
        if(confirm(msg)) {
            const edgeID = e.target.value;
            const specID = id;
            const alias = edgeName === 'owner' ? 'user' : edgeName;

            await handleLoadSpec(alias, edgeID);

            // Delete self from edge's spec
            let specIdx = edgeSpec[specName] ? edgeSpec[specName].indexOf(specID) : -1;
            if(specIdx < 0) {
                alert(`${specID} doesn't exist in ${specName}`);
            } else {
                edgeSpec[specName].splice(specIdx, 1)
                await onSave(alias, edgeID, edgeSpec);
                setEdgeSpec({});
            }

            // Delete edge ID from own spec
            let edgeIdx = existingFieldValues[edgeName].indexOf(edgeID);
            if(edgeIdx < 0) {
                alert(`${edgeID} doesn't exist in ${edgeName}`) 
            } else {
                existingFieldValues[edgeName].splice(edgeIdx, 1)
                onSave(specName, specID, existingFieldValues);
            }
        }
    })

    // Generate components for each edge 
    const edgeItems = (edges || []).map((edge, idx) => {
        const alias = edgeName === 'owner' ? 'user' : edgeName;
        return (
            <EdgeItem key={idx} specName={specName} edgeName={alias} id={edge} onDelete={handleDeleteEdge} />
        )
    })

    return (
        <div>
            <label className='edge-form-fields'>edge type: 
                <select name='edge_type' onChange={handleEdgeSelect} value={edgeName}>
                    <option value='Select an edge type'>Select an edge type</option>
                    {Object.keys(edgeTypes || {}).map( (edge, idx) => {
                        return ( <option key={idx} value={edge}>{edge}</option> )
                    })}
                </select>
            </label>

            <form onSubmit={handleAddEdge}>
                <label className='edge-form-fields'>add id to edge: 
                    <input name='id' type='text'/>
                </label>
                <br/>
                <button type='submit'>Add ID</button>
                <button type='reset'>Clear UUID</button>
            </form>

            <div>
                <h4>{edgeName}</h4>
                {edgeItems}
            </div>
        </div>
    )
}

// Component for each edge associated with edge type
const EdgeItem = props => {
    const { edgeName, id, onDelete } = props;
    const [edgeSpec, setEdgeSpec] = React.useState();
    
    // Retrieve spec associated with edge
    const handleLoadEdgeSpec = React.useCallback(async (edgeName, id) => {
        if(!edgeName || !id) return;
        const spec = await getSpec(`${edgeName}/${id}`);
        if(!spec) return alert((`${edgeName}/${id} not found!`));
        setEdgeSpec(spec);
    })

    handleLoadEdgeSpec(edgeName, id);
    const name = edgeSpec ? edgeSpec['name'] : 'No name available';

    return (
        <div>
            <div className='edge-form'>
                <span>{id || 'No ID available'}{' - '}</span>
                <span>{name}</span>
                <span><button type='button' value={id} onClick={onDelete}>🗑</button></span>
            </div>
        </div>
    )
}

export default EdgeForm;