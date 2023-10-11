import argparse

import backend
from backend import app


def main():
    # Create an ArgumentParser object
    parser = argparse.ArgumentParser(description="Reset the database")

    # Add the optional flag
    parser.add_argument('-r', '--run_function', action='store_true', default=False, help='Reset the database')

    # Parse the command-line arguments
    args = parser.parse_args()

    # Check if the flag is present and run the specific function
    if args.run_function:
        backend.reset_database()
        app.run(debug=True, threaded=True)
    else:
        app.run(debug=True, threaded=True)

if __name__ == "__main__":
    main()
