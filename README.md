# Employee Manager

## Description

Employee Manager is a Node CLI tool that allows users to manage the departments, roles, and employees of a company. The user can perform various tasks like adding, removing, or updating employees, roles, and departments. For a full list of what tasks a user can perform, start the application and see what actions are available in the list when prompted with "What would you like to do?".

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Example Usage](#example-usage)
- [License](#license)
- [Contributing](#contributing)
- [Questions](#questions)

## Installation

To install the required dependencies, run `npm install`

This project assumes there is a MySQL server running on localhost:3306. If your server is running somewhere else, or your root password isn't "password", you can edit `index.js` (lines 6-10) to reflect that.

Run the provided file `sql/schema.sql` in MySQL Workbench to initialize the schema for this application. If you want to pre-populate the database with test values, run `sql/seed.sql` inside MySQL Workbench.

## Usage

To start the application, run `npm start`

To exit the application, select `Exit` from the list within the application when prompted with "What would you like do?".

## Example Usage

Video Demonstration: https://www.youtube.com/watch?v=7PmIXxFvEl0

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

If you want to contribute, open a Pull Request and include a detailed description and screenshots of the changes.

## Questions

If you have any questions about the repo, open an issue or contact [ryan-harris](https://github.com/ryan-harris) directly at harris.ucla@gmail.com.
