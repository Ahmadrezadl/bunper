# Bunper: Lightweight Web Framework for Bun

Welcome to Bunper, a lightweight and evolving web framework designed for the Bun runtime. Tailored for simplicity and ease of use, Bunper is ideal for small to medium-sized projects, where performance and quick setup are key. Please note, Bunper is currently in active development and not yet stable, making it an exciting project for those who wish to contribute to its growth and stability.

## Features

- **Lightweight & Simple**: Bunper is designed to be straightforward and unobtrusive, perfect for smaller projects.
- **Efficient Routing**: Easy-to-use routing system, allowing you to get your server up and running in no time.
- **Middleware Support**: Includes essential middleware capabilities for handling requests and responses.
- **In Development**: Actively being developed, offering an opportunity to shape its future and contribute to a growing project.
- **Optimized for Bun**: Leveraging the speed and efficiency of the Bun runtime.

## Getting Started

### Prerequisites

Ensure the latest version of [Bun](https://bun.sh/) is installed on your system.

### Installation

Bunper is available on npm and can be easily installed with Bun:

```bash
bun install bunper
```

This will add Bunper to your project, getting you ready to set up your web server.

### Basic Usage

Here's a quick example to help you get started with Bunper:

```typescript
import { Bunper } from 'bunper';

// Initialize Bunper
const app = new Bunper();

// Define a simple GET route
app.get('/', (req, params) => {
  return new Response('Welcome to Bunper!');
});

// Listen on port 3000
app.listen(3000);
```

## In Progress

Bunper is a work in progress and is currently not in a stable version. This is an excellent opportunity for developers who want to contribute to an open-source project and help shape its development.

## Contributing

Your contributions are welcome! Whether it's bug reports, feature