# AppHelper

Helper functions shared by React and NextJS Apps

## Testing

### Using the Playground

The playground is a Vite-based development environment for testing and demonstrating AppHelper components interactively.

#### Quick Start

```bash
# Run playground with latest code (builds all packages first)
npm run playground:reload

# Or run playground without rebuilding
npm run playground
```

The playground will be available at **http://localhost:3001**


## To Publish

There are multiple packages contained within this repo

1. Update version number in package.json of the package you wish to publish
2. Run `npm run publish:apphelper`, `npm run publish:login` or whichever package you wish to publish.
