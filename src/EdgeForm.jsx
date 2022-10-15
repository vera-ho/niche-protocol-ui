import React from 'react';
import { BeagleEdgeSchema } from './util/beagle_schema';
import { getSpecSchema } from './util/beagle_specs';

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
    const { specSchema, specName, id, existingFieldValues, onLoad } = props;
    const [edgeName, setEdgeName] = React.useState();
    const edgeTypes = specSchema['edges'];

    // Choose edge type
    const handleEdgeSelect = React.useCallback((e) => {
        e.preventDefault();
        setEdgeName(e.target.value);
    })

    // Add id to selected edge type
    const handleAddEdge = React.useCallback(() => {

    })

    // Remove selected edge
    const handleDeleteEdge = React.useCallback(() => {

    })



    return (
        <div>
            <label>edge type: 
                <select name='edge_type' onChange={handleEdgeSelect} value={edgeName}>
                    <option value='Select an edge type'>Select an edge type</option>
                    {Object.keys(edgeTypes || {}).map( (edge, idx) => {
                        return (
                            <option key={idx} value={edge}>{edge}</option>
                        )
                    })}
                </select>
            </label>

            {/* Add new ID to an edge type */}
            <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const id = formData.get('id');

                if(!edgeName) return alert('Select an edge type!');
                
            }}>

            </form>
            
        </div>
    )
}

export default EdgeForm;