#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo "Running tests for Connectify Nigeria..."

# Run backend tests
echo -e "\n${GREEN}Running backend tests...${NC}"
cd backend
pytest --cov=app tests/ --cov-report=term-missing
BACKEND_EXIT_CODE=$?

# Run frontend tests
echo -e "\n${GREEN}Running frontend tests...${NC}"
cd ../frontend
npm run test:coverage
FRONTEND_EXIT_CODE=$?

# Check if all tests passed
if [ $BACKEND_EXIT_CODE -eq 0 ] && [ $FRONTEND_EXIT_CODE -eq 0 ]; then
    echo -e "\n${GREEN}All tests passed!${NC}"
    exit 0
else
    echo -e "\n${RED}Some tests failed.${NC}"
    exit 1
fi 