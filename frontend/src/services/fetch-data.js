export default async function handler(req, res) {
    try {
        const response = await fetch('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch data' });
    }
}
