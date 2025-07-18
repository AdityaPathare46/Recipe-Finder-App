Recipe Finder Application
A responsive web application built with React that allows users to search for recipes and view detailed instructions and ingredients, powered by TheMealDB API.

✨ Features
Dynamic Recipe Search: Search for recipes by name or ingredients using a live API.

Detailed Recipe View: Click on any recipe card to see its full list of ingredients and step-by-step instructions.

Responsive Design: Optimized for various screen sizes, from mobile to desktop.

Loading & Error States: Provides visual feedback during API calls and gracefully handles errors.

Clean User Interface: Intuitive and easy-to-navigate design.

📸 Screenshots
A glimpse of the main recipe listing.
![alt text](<Screenshot 2025-07-18 131159.png>)
Detailed view of a selected recipe, showing ingredients.
![alt text](<Screenshot 2025-07-18 131220.png>)
Detailed view of a selected recipe, showing instructions.
![alt text](<Screenshot 2025-07-18 131236.png>)

🚀 Technologies Used
React: A JavaScript library for building user interfaces.

JavaScript (ES6+): Core programming language.

HTML5: Structure of the web pages.

CSS3: Styling and responsiveness (using standard CSS and media queries).

Lucide React: For beautiful and lightweight SVG icons.

TheMealDB API: Provides a comprehensive database of recipes.

📦 Setup and Installation
Follow these steps to get the project up and running on your local machine.

Prerequisites
Node.js (LTS version recommended)

npm (Node Package Manager, comes with Node.js)

Installation Steps
Clone the repository:

git clone https://github.com/YOUR_USERNAME/recipe-finder-app.git

Replace YOUR_USERNAME with your GitHub username.

Navigate into the project directory:

cd recipe-finder-app

Install dependencies:

npm install

Start the development server:

npm start

This will open the application in your default web browser at http://localhost:3000.

💡 Usage
Upon opening the application, you'll see a default list of "chicken" recipes.

Use the search bar at the top to find recipes by typing a dish name (e.g., "pasta", "curry") or an ingredient (e.g., "cheese", "tomato").

Click on any recipe card to view its detailed ingredients and cooking instructions.

Click the 'X' button in the top right of the detailed view to return to the recipe list.

🛠️ Future Enhancements
Favorites Feature: Allow users to save their favorite recipes (could use localStorage or a backend like Firebase Firestore).

Recipe Categories/Filters: Add options to filter recipes by category (e.g., "Dessert", "Breakfast") or cuisine (e.g., "Italian", "Indian").

Pagination: Implement pagination for search results if the API returns a large number of recipes.

More API Data: Integrate more details from TheMealDB API (e.g., YouTube links for video instructions).

User Authentication: If implementing a favorites feature with a backend, add user authentication.

📄 License
This project is open source and available under the MIT License.