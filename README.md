Poll System - Setup and Run Instructions
----------------------------------------

This is a simple web-based poll system built using Python, MySQL, HTML, CSS, and JavaScript.

The system allows:
- Teachers to create and manage polls.
- Students to submit responses.
- Results to be displayed as interactive pie charts.


HOW TO RUN THE PROJECT
----------------------

1. Make sure Python and MySQL are installed on your system.

2. Open the project folder in VS Code or any terminal.

3. Create a virtual environment:
   python -m venv venv

4. Activate the virtual environment:
   For Windows:
       venv\Scripts\activate
   For Mac/Linux:
       source venv/bin/activate

5. Install the required dependencies:
   pip install -r requirements.txt

6. Open MySQL and create a new database:
   CREATE DATABASE poll_system_db;

7. Update your database credentials in the configuration file (config.py or .env):
   Example:
       DB_HOST = 'localhost'
       DB_USER = 'root'
       DB_PASSWORD = 'yourpassword'
       DB_NAME = 'poll_system_db'

8. Run the application:
   python app.py

9. Open your browser and go to:
   http://localhost:5000

10. You can now log in, create polls (as a teacher), or vote (as a student).


PROJECT STRUCTURE
-----------------
app.py               -> Main application file
templates/           -> HTML templates
static/              -> CSS, JS, and image files
routes/              -> Application routes
models/              -> Database models
config.py            -> Configuration file
requirements.txt     -> Python dependencies


AUTHOR
-------
Varshita Reddy
Email: varshitareddynallamilli@gmail.com
