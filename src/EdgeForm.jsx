import React from 'react';
import { deleteSpec, getSpec } from './util/firebase';
// import { BeagleEdgeSchema } from './util/beagle_schema';
// import { getSpecSchema } from './util/beagle_specs';

/**
    Option to add new edge to specs in dropdown menu
    - select which field to add entry to (drop down of options -> keys from edge schema for current spec)
    - field to enter ID number
    - button to submit, which adds ID to data structure holding all IDs for the specified field
    Get existing edge information from existingFieldValues
    Destructure edge data from existingFieldValues
    - expect arrays of IDs
    Get spec data of each ID
    Generate react component for each item that displays ID and name with option to delete
 */
const EdgeForm = props => {
    const { specSchema, specName, id, existingFieldValues, onLoad, onSave } = props;
    const [edgeName, setEdgeName] = React.useState();
    const edgeTypes = specSchema['edges'];
    const edges = existingFieldValues ? existingFieldValues[edgeName] : ['',''];

    // Choose edge type
    const handleEdgeSelect = React.useCallback((e) => {
        e.preventDefault();
        setEdgeName(e.target.value);
    })

    // Add new edge ID
    const handleAddEdge = React.useCallback(e => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const edge_id = formData.get('id');

        if(!edgeName) return alert('Select an edge type!');
        if(!edge_id) return alert('Enter an ID!')

        existingFieldValues[edgeName].push(edge_id);
        onSave(specName, id, existingFieldValues);
    })

    const edgeItems = edges.map((edge, idx) => {
        return (
            <EdgeItem key={idx} specName={specName} id={edge} />
        )
    })

    return (
        <div>
            <label>edge type: 
                <select name='edge_type' onChange={handleEdgeSelect} value={edgeName}>
                    <option value='Select an edge type'>Select an edge type</option>
                    {Object.keys(edgeTypes || {}).map( (edge, idx) => {
                        return ( <option key={idx} value={edge}>{edge}</option> )
                    })}
                </select>
            </label>

            <form onSubmit={handleAddEdge}>
                <label>add id to edge: 
                    <input name='id' type='text'/>
                </label>
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
    const { specName, id } = props;
    const [edgeSpec, setEdgeSpec] = React.useState();
    
    // Retrieve spec associated with edge
    const handleLoadEdgeSpec = React.useCallback(async (specName, id) => {
        const spec = await getSpec(`${specName}/${id}`);
        if(!spec) return alert((`${specName}/${id} not found!`));
        setEdgeSpec(spec);
    })

    // Remove selected edge
    const handleDeleteEdge = React.useCallback(async () => {
        let msg = 'Are you sure you want to delete this edge?';
        if(confirm(msg)) await deleteSpec(`${specName}/${id}`);
    })

    handleLoadEdgeSpec(specName, id);
    const name = edgeSpec ? edgeSpec['name'] : 'No name available';

    return (
        <div>
            <div>
                <span>{id || 'No ID available'}{' - '}</span>
                <span>{name}</span>
                <span><button type='button' onClick={handleDeleteEdge}>🗑</button></span>
            </div>
        </div>
    )
}

export default EdgeForm;