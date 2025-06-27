

// Import MongoDB client
const { MongoClient } = require('mongodb');


// Database and collection names
const dbName = 'plp_bookstore';
const collectionName = 'books';

// Function to perform CRUD operations and advanced queries
async function performQueries() {
  const client = new MongoClient(uri);

  try {
    // Connect to the MongoDB server
    await client.connect();
    console.log('Connected to MongoDB server');

    // Get database and collection
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // 1. Create: Insert a new book
    const newBook = {
      title: 'The Catcher in the Rye',
      author: 'J.D. Salinger',
      genre: 'Fiction',
      published_year: 1951,
      price: 8.99,
      in_stock: true,
      pages: 224,
      publisher: 'Little, Brown and Company'
    };
    const insertResult = await collection.insertOne(newBook);
    console.log(`Inserted book with id: ${insertResult.insertedId}`);

    // 2. Read: Find all books
    const allBooks = await collection.find().toArray();
    console.log('All Books:', allBooks);

    // 3. Update: Update a book's price
    const updateResult = await collection.updateOne(
      { title: '1984' },
      { $set: { price: 12.99 } }
    );
    console.log(`Updated ${updateResult.modifiedCount} book(s)`);

    // 4. Delete: Delete a book by title
    const deleteResult = await collection.deleteOne({ title: 'Moby Dick' });
    console.log(`Deleted ${deleteResult.deletedCount} book(s)`);

    // Advanced Queries
    // 5. Find books by a specific author with projection
    const authorBooks = await collection.find(
      { author: "George Orwell" },
      { projection: { title: 1, published_year: 1 } }
    ).toArray();
    console.log('Books by George Orwell:', authorBooks);

    // 6. Find books published after 1950 and sort by price
    const recentBooks = await collection.find({ published_year: { $gt: 1950 } })
      .sort({ price: 1 })
      .toArray();
    console.log('Books published after 1950 sorted by price:', recentBooks);

    // 7. Aggregation: Count books by genre
    const genreCount = await collection.aggregate([
      { $group: { _id: "$genre", count: { $sum: 1 } } }
    ]).toArray();
    console.log('Count of books by genre:', genreCount);

    // 8. Create an index on the title field for performance optimization
    await collection.createIndex({ title: 1 });
    console.log('Index created on title field');

  } catch (err) {
    console.error('Error occurred:', err);
  } finally {
    // Close the connection
    await client.close();
    console.log('Connection closed');
  }
}

// Run the function
performQueries().catch(console.error);
