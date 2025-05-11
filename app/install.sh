#!/bin/bash

echo "Installing dependencies..."
npm install

echo "Creating next-env.d.ts file..."
cat > next-env.d.ts << 'EOL'
/// <reference types="next" />
/// <reference types="next/types/global" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/basic-features/typescript for more information.
EOL

echo "Setup complete. Run 'npm run dev' to start the development server." 