import axios from 'axios';

const DecryptionProcess = async (response) => {
    if (response.data.mac && response.data.value) {
        try {
            const decryptionResponse = await axios.post('http://localhost:8080/decryptionProcess', {
                mac: response.data.mac,
                value: response.data.value
            });

            console.log("Decryption process Data: ", decryptionResponse.data);

            return decryptionResponse.data;
        } catch (error) {
            console.error("Error in decryption process:", error);
            throw error;
        }
    } else {
        throw new Error("Missing required data for decryption");
    }
};

export default DecryptionProcess;