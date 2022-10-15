import React from 'react';
import { BeagleEdgeSchema } from './util/beagle_schema';

const EdgeForm = props => {
    const { specName, id, existingFieldValues, onLoad } = props;

    // Option to add new edge to specs in dropdown menu
    // - options are keys from edge schema for current spec
    // Get existing edge information frome existingFieldValues
    // Destructure edge data from existingFieldValues
    // - expect arrays of IDs
    // Get spec data of each ID
    // Generate react component for each item that displays ID and name with option to delete



    const handleDeleteEdge = React.useCallback(() => {

    })

    return (
        <div>
            
        </div>
    )
}

export default EdgeForm;