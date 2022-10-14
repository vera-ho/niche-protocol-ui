import axios from 'axios';

export const getSpecTypes = async (setTypes) => {
    const res = await axios.get(`https://beagleschema.demcrepl.repl.co/specs`);
    setTypes(res.data.specs);
}

export const getSpecSchema = async (specType, setSchema) => {
    const res = await axios.get(`https://beagleschema.demcrepl.repl.co/specs/${specType}/schema`);
    setSchema(res.data);
}