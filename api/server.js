let dataStore = []; // Temporary in-memory storage (not persistent)

// Main handler
export default function handler(req, res) {
    const { method } = req;

    switch (method) {
        case 'POST':
            handlePost(req, res);
            break;
        case 'PUT':
            handlePut(req, res);
            break;
        case 'DELETE':
            handleDelete(req, res);
            break;
        case 'GET':
            res.status(200).json(dataStore); // Return all stored data
            break;
        default:
            res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
            res.status(405).json({ error: `Method ${method} not allowed` });
    }
}

// Handle POST requests
function handlePost(req, res) {
    const data = req.body; // Use the full request body
    if (!data) {
        return res.status(400).json({ error: 'Data is required' });
    }
    const newItem = { id: Date.now(), ...data }; // Add unique ID
    dataStore.push(newItem);
    res.status(201).json({ message: 'Data added', item: newItem });
}

// Handle PUT requests
function handlePut(req, res) {
    const { id, data } = req.body;
    if (!id || !data) {
        return res.status(400).json({ error: 'ID and data are required' });
    }
    const itemIndex = dataStore.findIndex((item) => item.id === id);
    if (itemIndex === -1) {
        return res.status(404).json({ error: 'Item not found' });
    }
    dataStore[itemIndex] = { ...dataStore[itemIndex], ...data };
    res.status(200).json({ message: 'Data updated', item: dataStore[itemIndex] });
}

// Handle DELETE requests
function handleDelete(req, res) {
    const { id } = req.body;
    if (!id) {
        return res.status(400).json({ error: 'ID is required' });
    }
    const itemIndex = dataStore.findIndex((item) => item.id === id);
    if (itemIndex === -1) {
        return res.status(404).json({ error: 'Item not found' });
    }
    const deletedItem = dataStore.splice(itemIndex, 1);
    res.status(200).json({ message: 'Data deleted', item: deletedItem });
}
